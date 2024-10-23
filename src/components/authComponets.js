import {auth, provider} from '../config/firebase-config';
import {createUserWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import {useState}  from "react";
//This is the name you will need to imprt it as!
export const EmailSignIn= ()=>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 

    //console.log('auth:',auth?.currentUser.email);
    //since firebase uses promises, we must use try catch blocks with our async function.
    const signIn =async()=>{
        try{
        await createUserWithEmailAndPassword(auth, email, password);
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
    const signInWithGoogle = async() =>{
        try{
        const result = await signInWithPopup(auth, provider);
        console.log(result);
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