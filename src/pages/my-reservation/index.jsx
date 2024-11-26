import React, { useState } from 'react';
import { getReservationsByEmail } from '../../components/readDatabase';

export const MyReservationPage = () => {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);

  const fetchReservations = () => {
    if (email.trim() === '') {
      alert("Please enter an email address.");
      return;
    }

    getReservationsByEmail(email, (reservations) => {
      setReservations(reservations); // Update state with reservations
      console.log("Your reservations", reservations);
    });
  };
/*
When we get consistency of logged in users, we can simply change value of input
and make it read only. Have the component load as soon as page renders. boom 21 century website.
*/
  return (
    <>
      <h2>My Reservations</h2>
      <input 
        type="text" 
        placeholder="Type your email here..." 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <button onClick={fetchReservations}>Submit</button>
      
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
