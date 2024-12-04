import React, { useEffect, useState } from 'react';
import { database } from '../config/firebase-config';
import { ref, get } from 'firebase/database';
import { Navigate } from 'react-router-dom';
import { auth } from '../config/firebase-config';

export const AuthedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      setLoading(true);

      try {
        const user = auth.currentUser;

        if (user) {
          // Use user.uid instead of user.email
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setIsAdmin(userData.role === "admin");
          } else {
            console.warn("User data not found in database.");
            setIsAdmin(false);
          }
        } else {
          console.warn("No authenticated user.");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsAdmin(false);
      }

      setLoading(false);
    };

    // Check if a user is already signed in when the component mounts
    if (auth.currentUser) {
      checkAdminRole();
    } else {
      // Listen for auth state changes
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          checkAdminRole();
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      });

      // Cleanup subscription
      return () => unsubscribe();
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAdmin ? children : <Navigate to="/" />;
};

export default AuthedRoute;