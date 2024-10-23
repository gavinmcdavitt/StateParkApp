import {auth, provider} from '../config/firebase-config';
import {createUserWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import {useState}  from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
//This is the name you will need to imprt it as!
export const EmailSignIn= ()=>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const navigate = useNavigate();
    //console.log('auth:',auth?.currentUser.email);
    //since firebase uses promises, we must use try catch blocks with our async function.
    const signIn =async()=>{
        try{
        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Success - user created
            const user = userCredential.user;
            console.log("User created successfully:", user);
            navigate('/Home');
          })
          .catch((error) => {
            // Error - something went wrong
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error creating user:", errorCode, errorMessage);
          });
        
        }
        catch(err){
            console.log(err);
        }
    };
    return(
        <div> <p>Inside component email.</p>
            <input placeholder ="email...." onChange={(e)=> setEmail(e.target.value)}/>
            <input placeholder="password ..." onChange ={(e)=> setPassword(e.target.value)}/>
            <button  onClick ={signIn}> Sign in</button>
         </div>
    )
}
export const GoogleSignIn = () =>{
    const navigate = useNavigate();
    const signInWithGoogle = async() =>{
        try{
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        navigate('/Home');
        }
        catch(err){
            console.log(err);
        }
    };
    return ( 
        <div className="login-page">
            <p>Inside component google</p>
            <button className="login-with-google-btn" onClick = {signInWithGoogle}>
                  {" "} Sign in with Google
             </button>
        </div>
    );
};