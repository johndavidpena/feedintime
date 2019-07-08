import React from 'react';
import homeStyles from './home.module.css';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

const Home = () => {
  // A basic spring fade in on window load
  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });

  return (
    <animated.div className={homeStyles.home} style={fade}>
      <div className={homeStyles.pantry}>
        <Link to={ROUTES.PANTRY}>
          <h1>Pantry</h1>
        </Link>
      </div>

      <div className={homeStyles.recipes}>
        <Link to={ROUTES.RECIPES}>
          <h1>Recipes</h1>
        </Link>
      </div>
    </animated.div>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
