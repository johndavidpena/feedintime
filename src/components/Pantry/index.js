import React, { Component } from 'react';
import pantryStyles from './pantry.module.css';
import { TiPlusOutline } from 'react-icons/ti';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { useSpring, animated } from 'react-spring';

const PantryPage = () => {
  // A basic spring fade in on window load
  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });

  return (
    <animated.div className={pantryStyles.pantry} style={fade}>
      <h1>Pantry</h1>
      <PantryAddForm />
    </animated.div>
  );
}

const INITIAL_STATE = {
  newItem: '',
  newItemDesc: '',
  error: null
};

class PantryAddForm extends Component {
  constructor(props) {
    super(props);

    this.state = { INITIAL_STATE };
  }

  onSubmit = event => {
    console.log('onSubmit clicked');

    event.preventDefault();
  }

  render() {
    const { newItem, newItemDesc, error } = this.state;

    const isInvalid = newItem === '';

    return (
      <form onSubmit={this.onSubmit}
        className={pantryStyles.addItem}>
        <input
          name="newItem"
          value={newItem}
          onChange={this.onChange}
          type="text"
          placeholder="New item"
        />
        <input
          name="newItemDesc"
          value={newItemDesc}
          onChange={this.onChange}
          type="text"
          placeholder="Description"
        />
        <button disabled={isInvalid} type="submit">
          <TiPlusOutline />
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PantryPage);
