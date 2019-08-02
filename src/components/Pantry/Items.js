import React, { Component } from 'react';
import pantryStyles from './pantry.module.css';
import { TiDeleteOutline } from 'react-icons/ti';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
// import { useSpring, animated } from 'react-spring';

class ItemsBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      items: [],
      error: null
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.pantryItems().on('value', snapshot => {
      const pantryObject = snapshot.val();

      if (pantryObject) {
        const pantryItemsList = Object.keys(pantryObject).map(key => ({
          ...pantryObject[key],
          uid: key,
        }));

        this.setState({
          items: pantryItemsList,
          loading: false,
        });
      } else {
        this.setState({ items: null, loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.pantryItems().off();
  }

  // FIX: Not working yet, just need to get the opposite of the current value
  // NOTE: Re-renders on first click BUT not after, lifecycle method needed?
  onStockItem = item => {
    console.log('onStockItem', item);

    this.props.firebase.pantry(item.uid).update({
      stocked: !this.state.stocked
    });
  }

  onRemoveItem = uid => {
    this.props.firebase.pantry(uid).remove();
  }

  render() {
    const { items, loading, error } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div className={pantryStyles.items}>
            {error && <p>{error.message}</p>}

            {loading && <div>Loading...</div>}

            {items ? (
              <ItemsList
                items={items}
                onRemoveItem={this.onRemoveItem}
                onStockItem={this.onStockItem}
                authUser={authUser} />
            ) : (<div>There are no pantry items...</div>
              )}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const ItemsList = ({ authUser, items, onStockItem, onRemoveItem }) => (
  <ul>
    {items.map(item => (
      <PantryItem
        authUser={authUser}
        key={item.uid}
        item={item}
        onRemoveItem={onRemoveItem}
        onStockItem={onStockItem} />
    ))}
  </ul>
);

const PantryItem = props => {
  const { authUser, item, onStockItem, onRemoveItem } = props;

  return (
    <li>
      {authUser.uid === item.userId && (
        <React.Fragment>
          {/* ORIGINAL */}
          {/* <p>Stocked: {item.stocked.toString()}</p> */}
          {/* <input type="checkbox" */}
          {/* name="stocked" */}
          {/* onChange={() => onStockItem(item)} /> */}
          {/* <p>{item.item}</p> */}

          {item.stocked && (
            <label className={pantryStyles.checkbox}>
              {item.item}
              <input
                type="checkbox"
                id={item.uid}
                onChange={() => onStockItem(item)}
                checked
              />
              <span className={pantryStyles.checkmark} />
            </label>
          )}

          {!item.stocked && (
            <label className={pantryStyles.checkbox}>
              {item.item}
              <input
                type="checkbox"
                id={item.uid}
                onChange={() => onStockItem(item)}
              />
              <span className={pantryStyles.checkmark} />
            </label>
          )}

          <p>{item.desc}</p>
          <button
            type="button"
            onClick={() => onRemoveItem(item.uid)}>
            <TiDeleteOutline />
          </button>
        </React.Fragment>
      )}
    </li>
  );
}

const Items = withFirebase(ItemsBase);

export default Items;
