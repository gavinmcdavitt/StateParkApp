import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import './UserPopUp.css';

export const UserInfoPopUp = ({ isVisible, onClose }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (!isVisible) return; // Don't fetch data if the popup is not visible

        const auth = getAuth();
        const database = getDatabase();

        // Fetch logged-in user data
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const userRef = ref(database, `users/${currentUser.uid}`);
                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        setUserInfo(snapshot.val());
                    } else {
                        console.error('User data not found');
                    }
                });
            } else {
                setUserInfo(null);
            }
        });

        return () => unsubscribe();
    }, [isVisible]);

    if (!isVisible || !userInfo) return null;

    return (
        <div className="popup">
            <div className="popup-content">
                <h3>User Information</h3>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Role:</strong> {userInfo.role}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default UserInfoPopUp;
