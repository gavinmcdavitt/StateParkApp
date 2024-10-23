import React from 'react';
import {EmailSignIn, GoogleSignIn} from '../../components/authComponets';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
export const AuthPage = () => {
    return (
      <div>
        <EmailSignIn />
        <GoogleSignIn />
      </div>
    );
  };
  
  export default AuthPage;