import React from 'react';
import navStyles from './nav.module.css';
import { TiHomeOutline, TiUserOutline, TiUserAddOutline, TiPlaneOutline } from 'react-icons/ti';
import SignOutButton from '../SignOut';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
// import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';

const Navigation = () => (
  <React.Fragment>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <NavigationAuth authUser={authUser} />
        ) : (
            <NavigationNonAuth />
          )
      }
    </AuthUserContext.Consumer>
  </React.Fragment>
);

const NavigationAuth = ({ authUser }) => (
  <ul className={navStyles.ul}>
    <li>
      <Link to={ROUTES.LANDING}><TiPlaneOutline /></Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}><TiHomeOutline /></Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}><TiUserOutline /></Link>
    </li>
    {/* {!!authUser.roles[ROLES.ADMIN] && (
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
    )} */}
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul className={navStyles.ul}>
    <li>
      <Link to={ROUTES.LANDING}><TiPlaneOutline /></Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}><TiUserAddOutline /></Link>
    </li>
  </ul>
);

export default Navigation;
