import React, { useEffect, useState } from 'react';
import { database } from '../config/firebase-config'; // Adjust the path as needed
import { ref, get } from 'firebase/database';
import { Navigate } from 'react-router-dom';  // Use Navigate instead of Redirect

export const AuthedRoute = ({ adminRoute = false, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);  // This will hold the current user data

  useEffect(() => {
    const userId = "email";
    const userRef = ref(database, 'users/' + userId);

    get(userRef).then(snapshot => {
      const userData = snapshot.val();

      if (userData) {
        setIsAuthenticated(true);
        setIsAdmin(userData.role == 'admin'); // Assuming the role is stored under "role" in Firebase
        setUser(userData);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching user data:", error);
      setLoading(false);
      setIsAuthenticated(false);
    });
  }, []);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if the user is not authenticated or doesn't have the required role for adminRoute
  if (!isAuthenticated || (adminRoute && !isAdmin)) {
    return <Navigate to="/Home" />; // Use Navigate for redirect
  }

  return <>{children}</>;
};

export default AuthedRoute;
