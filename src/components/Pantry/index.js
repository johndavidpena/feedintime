import React, { Component } from 'react';
import pantryStyles from './pantry.module.css';
import { TiPlusOutline } from 'react-icons/ti';
import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { useSpring, animated } from 'react-spring';
import Items from './Items';

const PantryPage = () => {
  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });

  return (
    <animated.div className={pantryStyles.pantry} style={fade}>
      <h1>Pantry</h1>
      <PantryAddForm />
      <Items />
    </animated.div>
  );
}

class PantryAddFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: '',
      desc: '',
      error: null
    };
  }

  onAddItem = (event, authUser) => {
    this.props.firebase.pantryItems().push({
      userId: authUser.uid,
      item: this.state.item,
      desc: this.state.desc,
      stocked: false
    });

    this.setState({
      item: '',
      desc: ''
    });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { item, desc, error } = this.state;

    const isInvalid = item === '';

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <form onSubmit={event => this.onAddItem(event, authUser)}
            className={pantryStyles.addItem}>
            <input
              name="item"
              value={item}
              onChange={this.onChange}
              type="text"
              placeholder="New item"
            />
            <input
              name="desc"
              value={desc}
              onChange={this.onChange}
              type="text"
              placeholder="Description"
            />
            <button disabled={isInvalid} type="submit">
              <TiPlusOutline />
            </button>

            {error && <p>{error.message}</p>}
          </form>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => !!authUser;

const PantryAddForm = withFirebase(PantryAddFormBase);

export default withAuthorization(condition)(PantryPage);
