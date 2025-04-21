import React, { useState, useEffect } from 'react';
import { getReservationsByEmail } from '../../components/readDatabase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase-config';

export const MyReservationPage = () => {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailFromQuery, setEmailFromQuery] = useState(null); // Track email from URL

  const formatDate = (datetimeStr) => {
    const date = new Date(datetimeStr);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
  };

  useEffect(() => {
    // Check URL for ?email query param
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');

    if (emailParam) {
      setEmailFromQuery(emailParam);
      setEmail(emailParam);
      fetchReservations(emailParam);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || '');
        setIsAuthenticated(true);
        if (!emailParam) {
          fetchReservations(user.email);
        }
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchReservations = (emailToUse) => {
    const emailToQuery = emailToUse || email;

    if (emailToQuery.trim() === '') {
      alert('Please enter an email address.');
      return;
    }

    getReservationsByEmail(emailToQuery, (reservations) => {
      setReservations(reservations);
      console.log('Your reservations', reservations);
    });
  };

  return (
    <>
      <h2>My Reservations</h2>
      {emailFromQuery || isAuthenticated ? (
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
            <br/>
          <strong>Park:</strong> {reservation.parkName || 'Unknown Park'} <br />
          <strong>Reservation Name:</strong> {reservation.name || 'N/A'} <br />
          <strong>Date & Time:</strong> {formatDate(reservation.startDateTime)}<br />
          <strong>Guests:</strong> {reservation.guests || 1} <br />
          <strong>Phone:</strong> {reservation.phone || 'N/A'}
          
        </li>
        ))}
      </ul>
    </>
  );
};
