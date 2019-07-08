import React from 'react';
import formStyles from '../../form.module.css';
import { TiUserDeleteOutline } from 'react-icons/ti';
import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut}
    className={formStyles.signOutButton}>
    <TiUserDeleteOutline />
  </button>
);

export default withFirebase(SignOutButton);
