import React from 'react';
import {EmailSignIn, GoogleSignIn} from '../../components/authComponets';
export const AuthPage = () => {
    return (
      <div>
        <EmailSignIn />
        <GoogleSignIn />
      </div>
    );
  };
  
  export default AuthPage;