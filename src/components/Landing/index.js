import React from 'react';
import landingStyles from './landing.module.css';
import { useSpring, animated } from 'react-spring';

const Landing = () => {
  // A basic spring fade in on window load
  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });

  return (
    <animated.div className={landingStyles.landing} style={fade}>
      <h1>Welcome to<br />Feedin'Time</h1>
      <p>A simple app to manage your grocery list and recipes.</p>
    </animated.div>
  );
}

export default Landing;
