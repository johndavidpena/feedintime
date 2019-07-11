import React, { Component } from 'react';
// import pantryStyles from './pantry.module.css';
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

  onRemoveItem = uid => {
    this.props.firebase.pantry(uid).remove();
  }

  render() {
    const { items, loading, error } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {error && <p>{error.message}</p>}

            {loading && <div>Loading...</div>}

            {items ? (
              <ItemsList
                items={items}
                onRemoveItem={this.onRemoveItem}
                authUser={authUser} />
            ) : (<div>There are no pantry items...</div>
              )}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const ItemsList = ({ authUser, items, onRemoveItem }) => (
  <ul>
    {items.map(item => (
      <PantryItem
        authUser={authUser}
        key={item.uid}
        item={item}
        onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const PantryItem = props => {
  const { authUser, item, onRemoveItem } = props;

  return (
    <li>
      {authUser.uid === item.userId && (
        <React.Fragment>
          <p>{item.item} - {item.desc} Stocked: {item.stocked.toString()}</p>

          <button
            type="button"
            onClick={() => onRemoveItem(item.uid)}>
            Delete
        </button>
        </React.Fragment>
      )}
    </li>
  );
}

const Items = withFirebase(ItemsBase);

export default Items;
