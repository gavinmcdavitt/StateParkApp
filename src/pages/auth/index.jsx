import {auth, provider} from "../../config/firebase-config" 
import {signInWithPopup} from "firebase/auth"
import "./index.css"
export const Auth = () =>{
    const signInWithGoogle = async() =>{
        const result = await signInWithPopup(auth, provider);
        console.log(result);
    };
    return ( 
        <div className="login-page">
            <p>Sign in with Google to continue</p>
            <button className="login-with-google-btn" onClick = {signInWithGoogle}>
                  {" "} Sign in with Google
             </button>
        </div>
    );
};