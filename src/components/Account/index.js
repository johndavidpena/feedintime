import React from 'react';
import formStyles from '../../form.module.css';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';
import { useSpring, animated } from 'react-spring';

const AccountPage = () => {
  // A basic spring fade in on window load
  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });

  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <animated.div className={formStyles.account} style={fade}>
          <h1>Account:<br />{authUser.email}</h1>
          <PasswordForgetForm />
          <PasswordChangeForm />
        </animated.div>
      )}
    </AuthUserContext.Consumer>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
