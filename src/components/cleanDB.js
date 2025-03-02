import React, { useEffect, useCallback } from 'react';
import { ZeroOutCapacityAndClose } from '../components/readDatabase';

const ZeroDBScheduled = () => {
  const scheduleFixDB = useCallback(() => {
    const now = new Date();
    const targetTime = new Date();

    // Set the target time to 8:00 PM
    targetTime.setHours(17, 29, 0, 0); // 17:09:00.000 is 5:09 PM

    // If the target time is in the past, add one day to it
    if (targetTime < now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    // Calculate the delay in milliseconds
    const delay = targetTime - now;

    // Schedule the task
    setTimeout(() => {
      ZeroOutCapacityAndClose(); // Call the function
      scheduleFixDB(); // Reschedule for the next day
    }, delay);
  }, []); // Empty dependency array ensures this function doesn't change

  // Schedule the task when the component mounts
  useEffect(() => {
    scheduleFixDB();
  }, [scheduleFixDB]);

  return (
    <div>
      <h1>Scheduled Task Example</h1>
      <p>Check the console at the scheduled time!</p>
    </div>
  );
};

export default ZeroDBScheduled; // Export the component
