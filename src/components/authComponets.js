import React, { useState } from "react";
import { auth, provider } from '../config/firebase-config';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    setPersistence, 
    browserLocalPersistence, 
    signOut 
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom'; 
import { database } from '../config/firebase-config';

const ErrorPopup = ({ message, onClose }) => (
    <div style={{ 
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        background: 'white', 
        padding: '20px', 
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', 
        zIndex: 1000 
    }}>
        <p>{message}</p>
        <button onClick={onClose} style={{ marginTop: '10px' }}>Close</button>
    </div>
);

export const EmailSignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [isSignUp, setIsSignUp] = useState(true);  // Toggle between sign-up and sign-in
    const [error, setError] = useState(""); // Error message state
    const navigate = useNavigate();

    const handleSignInOrSignUp = async () => {
        if (!email || !password) {
            setError("Email and password cannot be empty.");
            return;
        }

        try {
            await setPersistence(auth, browserLocalPersistence);
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        set(ref(database, 'users/' + user.uid), {
                            email: user.email,
                            uid: user.uid,
                            role: 'user',
                            registerAt: new Date().toISOString(),
                        }).then(() => {
                            navigate('/Home');
                        }).catch(() => setError("Failed to save user data to the database."));
                    })
                    .catch((error) => {
                        if (error.code === 'auth/email-already-in-use') {
                            setError("This email is already in use.");
                        } else if (error.code === 'auth/weak-password') {
                            setError("Password is too weak.");
                        } else {
                            setError(error.message);
                        }
                    });
            } else {
                await signInWithEmailAndPassword(auth, email, password)
                    .then(() => navigate('/Home'))
                    .catch((error) => {
                        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                            setError("Invalid email or password.");
                        } else {
                            setError(error.message);
                        }
                    });
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div>
            {error && <ErrorPopup message={error} onClose={() => setError("")} />}
            <p>{isSignUp ? "Sign up" : "Sign in"} with email.</p>
            <input placeholder="email..." onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="password..." onChange={(e) => setPassword(e.target.value)} />
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

export const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch {
            console.error("Error logging out.");
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export const GoogleSignIn = () => {
    const [error, setError] = useState(""); // Error state for Google sign-in
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            set(ref(database, 'users/' + user.uid), {
                email: user.email,
                uid: user.uid,
                role: 'user',
                createdAt: new Date().toISOString(),
            }).then(() => {
                navigate('/Home');
            }).catch(() => setError("Failed to save Google user data to the database."));
        } catch (err) {
            setError("Google sign-in failed. Please try again.");
        }
    };

    return (
        <div>
            {error && <ErrorPopup message={error} onClose={() => setError("")} />}
            <button onClick={signInWithGoogle}>
                Sign in with Google
            </button>
        </div>
    );
};
