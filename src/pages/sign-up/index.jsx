import React from 'react';
import {EmailSignIn, GoogleSignIn} from '../../components/authComponets';
import './index.css';
export const AuthPage = () => {
    return (
      <><div class="navbar">
            <img src="/Arrowhead.png" alt="Logo" className="navbar-logo" />
            <a href="/">Home</a>
            <a href="about-us">About</a>
            <a href="map">Map</a>
            <a class="active" href="#sign-up">Sign Up</a>
        </div><header className="login-page">
      <h2>Sign In</h2>
      <EmailSignIn />
      <GoogleSignIn />
      <button onClick={() => window.location.href = '/'}>Return to Home</button>
    </header></>
    );
}
  
  export default AuthPage;