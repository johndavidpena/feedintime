import React, { Component } from 'react';
import pantryStyles from './pantry.module.css';
import { TiDeleteOutline } from 'react-icons/ti';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import { useSpring, animated } from 'react-spring';

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

  onStockItem = item => {
    if (item.stocked) {
      this.props.firebase.pantry(item.uid).update({
        stocked: false
      });
    } else {
      this.props.firebase.pantry(item.uid).update({
        stocked: true
      });
    }

    // this.props.firebase.pantryItems().on('child_changed', function (data) {
    //   console.log('child_changed', data);
    // });
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

const ItemsList = ({ authUser, items, onStockItem, onRemoveItem }) => {
  function compare(a, b) {
    let comparison = 0;
    if (a.stocked && b.stocked) comparison = -1;
    if (!a.stocked && !b.stocked) comparison = -1;
    if (a.stocked && !b.stocked) comparison = 1;
    if (!a.stocked && b.stocked) comparison = -1;
    return comparison;
  }

  // NOTE: This sort function DOES mutate the array
  items = items.sort(compare);

  return (
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
}

const PantryItem = props => {
  const { authUser, item, onStockItem, onRemoveItem } = props;

  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });

  return (
    <animated.li style={fade}>
      {authUser.uid === item.userId && (
        <React.Fragment>
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
          <TiDeleteOutline onClick={() => onRemoveItem(item.uid)} />
        </React.Fragment>
      )}
    </animated.li>
  );
}

const Items = withFirebase(ItemsBase);

export default Items;
