import React from 'react';
import {EmailSignIn} from '../../components/authComponets';
import {GoogleSignIn} from '../../components/authComponets';
import {LogoutButton} from '../../components/authComponets';
import './index.css';

export const AuthPage = () => {
    return (
      <div>
        <EmailSignIn />
        <GoogleSignIn />
        <LogoutButton />

        <button onClick={() => window.history.back()}>Back</button>
      </div>
    );
  };
  
  export default AuthPage;