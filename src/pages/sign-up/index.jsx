import React from 'react';
import {EmailSignIn} from '../../components/authComponets';
import {GoogleSignIn} from '../../components/authComponets';
export const AuthPage = () => {
    return (
      <div>
        <EmailSignIn />
        <GoogleSignIn />
      </div>
    );
  };
  
  export default AuthPage;