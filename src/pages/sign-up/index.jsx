import React from 'react';
import {EmailSignIn, GoogleSignIn} from '../../components/authComponets';
import {LogoutButton} from '../../components/authComponets';
import { useState } from 'react';
import { UserInfoPopUp } from '../../components/UserPopUp/UserInfoPopUp';
import './index.css';
export const AuthPage = () => {
  const [popupVisible, setPopupVisible] = useState(false);

    const togglePopup = () => {
        setPopupVisible((prev) => !prev);
    };
    return (
      <><div class="navbar">
            <img src="/Arrowhead.png" alt="Logo" className="navbar-logo" />
            <a href="/">Home</a>
            <a href="about-us">About</a>
            <a href="map">Map</a>
            <a class="active" href="#sign-up">Sign Up</a>\
            <img
                    src="/profile.png"
                    alt="Profile"
                    className="navbar-logo"
                    onClick={togglePopup}
                    style={{ cursor: 'pointer' }}
                />

            

        </div><header className="login-page">
      <h2>Sign In</h2>
      <EmailSignIn />
      <GoogleSignIn />
      <LogoutButton />
      <button onClick={() => window.location.href = '/'}>Return to Home</button>
    </header>
    <UserInfoPopUp isVisible={popupVisible} onClose={togglePopup} />
    </>
    );
}
  
  export default AuthPage;