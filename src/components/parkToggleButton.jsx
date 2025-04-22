import React, { useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { database } from '../config/firebase-config'; // adjust this to your Firebase import

export const ParkToggleButton = () => {
  const [allOpen, setAllOpen] = useState(false);

  const toggleAllParksOpen = async () => {
    const objectsRef = ref(database, 'objects');
    try {
      const snapshot = await get(objectsRef);
      if (snapshot.exists()) {
        const updates = {};
        snapshot.forEach(child => {
          const parkKey = child.key;
          updates[`${parkKey}/isOpen`] = !allOpen;
        });
        await update(objectsRef, updates);
        console.log(`All parks set to ${!allOpen ? 'open' : 'closed'}.`);
        setAllOpen(!allOpen);
      } else {
        console.log('No parks found in the database.');
      }
    } catch (error) {
      console.error('Error toggling parks open state:', error);
    }
  };

  return (
    <button
      onClick={toggleAllParksOpen}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        padding: '10px 15px',
        backgroundColor: allOpen ? '#dc3545' : '#28a745', // red for "close", green for "open"
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      {allOpen ? 'Close All Parks' : 'Open All Parks'}
    </button>
  );
};

export default ParkToggleButton;
