import React, { useState, useEffect } from 'react';
import { getReservationsByEmail } from '../../components/readDatabase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase-config';

export const MyReservationPage = () => {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks if the user is logged in

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || ''); // Autofill email for authenticated user
        setIsAuthenticated(true); // Set authenticated flag
        fetchReservations(user.email); // Automatically fetch reservations for logged-in user
      } else {
        setIsAuthenticated(false); // Reset authentication flag for logged-out users
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const fetchReservations = (emailToUse) => {
    const emailToQuery = emailToUse || email;

    if (emailToQuery.trim() === '') {
      alert('Please enter an email address.');
      return;
    }

    getReservationsByEmail(emailToQuery, (reservations) => {
      setReservations(reservations); // Update state with reservations
      console.log('Your reservations', reservations);
    });
  };

  return (
    <>
      <h2>My Reservations</h2>
      {isAuthenticated ? (
        <p>Fetching reservations for {email}...</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Type your email here..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => fetchReservations()}>Submit</button>
        </>
      )}

      {/* Display reservations */}
      <ul>
        {reservations.map((reservation, index) => (
          <li key={index}>
            Reservation at: {reservation.startDateTime || 'No time specified'}
          </li>
        ))}
      </ul>
    </>
  );
};
