import React from 'react';
import recipesStyles from './recipes.module.css';
import { withAuthorization } from '../Session';
import { useSpring, animated } from 'react-spring';

const Recipes = () => {
  // A basic spring fade in on window load
  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });

  return (
    <animated.div className={recipesStyles.recipes} style={fade}>
      <h1>Recipes</h1>
    </animated.div>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Recipes);
