import { auth, provider } from '../config/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import { database } from '../config/firebase-config';

export const EmailSignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [isSignUp, setIsSignUp] = useState(true);  // To toggle between sign-up and sign-in mode
    const navigate = useNavigate();

    const handleSignInOrSignUp = async () => {
        try {
            // Set persistence to local so that the user stays logged in across pages
            await setPersistence(auth, browserLocalPersistence);

            if (isSignUp) {
                // Sign up new user
                await createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log("User created successfully:", user);

                        // Add user to Realtime Database under the 'users' node
                        set(ref(database, 'users/' + user.uid), {
                            email: user.email,
                            password: password,
                            role: 'user',
                        }).then(() => {
                            console.log("User data saved to the database!");
                            navigate('/Home'); // Redirect after saving to database
                        }).catch((error) => {
                            console.error("Error saving user data to database:", error);
                        });
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error("Error creating user:", errorCode, errorMessage);
                    });
            } else {
                // Log in existing user
                await signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log("User signed in successfully:", user);

                        // Optionally, check if the user exists in the Realtime Database and redirect
                        navigate('/Home'); // Redirect after successful login
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error("Error logging in user:", errorCode, errorMessage);
                    });
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <p>{isSignUp ? "Sign up" : "Sign in"} with email.</p>
            <input placeholder="email...." onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="password ..." onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignInOrSignUp}>
                {isSignUp ? "Sign up" : "Sign in"}
            </button>
            <p>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <span onClick={() => setIsSignUp(!isSignUp)} style={{ color: 'blue', cursor: 'pointer' }}>
                    {isSignUp ? "Log in" : "Sign up"}
                </span>
            </p>
        </div>
    );
};

export const GoogleSignIn = () => {
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            // Set persistence to local so that the user stays logged in across pages
            await setPersistence(auth, browserLocalPersistence);

            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Google user signed in:", user);

            // Add user to Realtime Database under the 'users' node
            set(ref(database, 'users/' + user.uid), {
                email: user.email,
                uid: user.uid,
                createdAt: new Date().toISOString(),
            }).then(() => {
                console.log("Google user data saved to the database!");
                navigate('/Home'); // Redirect after saving to database
            }).catch((error) => {
                console.error("Error saving user data to database:", error);
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="login-page">
            <p>Inside component google</p>
            <button className="login-with-google-btn" onClick={signInWithGoogle}>
                Sign in with Google
            </button>
        </div>
    );
};
