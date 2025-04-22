import React, { useEffect, useState } from 'react';
import { database } from '../../config/firebase-config';
import { useLocation } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import { updateCurrentCapacity, updateParkStatus } from '../../components/readDatabase';

import './index.css';

export const ParkStatusReportForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        startDateTime: '',
        openOrClosed: true, // Default to 'open' (true)
        parkId: '',
        parkName: '',
        formattedDateTime: '', // For storing formatted current date time
    });

    const location = useLocation();

    useEffect(() => {
        const queryString = location.search.substring(1); // Remove the leading '?'
        const params = queryString.split('&'); // Split by '&' to get each parameter
    
        let parkId = null;
        let parkName = null;
    
        // Extract `parkId` and `parkName` manually (exclude parkLat and parkLong)
        params.forEach(param => {
            const [key, value] = param.split('='); // Split each param into key-value pairs
            if (key === 'parkId') {
                parkId = value;
            } else if (key === 'parkName') {
                parkName = decodeURIComponent(value); // Decode the parameter value
            }
        });

        // Get current date and time in the required format for datetime-local
        const currentDateTime = new Date();
        const formattedDateTime = currentDateTime.toLocaleString(); // Formatted for display
        const dateTimeForInput = currentDateTime.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
        
        // Update formData with the extracted values
        setFormData((prevFormData) => ({
            ...prevFormData,
            ...(parkId && { parkId }),
            ...(parkName && { parkName }),
            startDateTime: dateTimeForInput, // Set the start date and time automatically
            formattedDateTime, // Store the formatted date-time for display
        }));
    
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    email: user.email || '', // Use email from authenticated user
                }));
            }
        });
    
        // Cleanup subscription when component unmounts
        return () => unsubscribe();
    }, [location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dateKey = formData.startDateTime.split('T')[0]; // Extract the date part of the startDateTime (e.g., '2024-11-25')
            const currentDateTime = new Date();

            // Check if the reservation date is in the past
            if (new Date(formData.startDateTime) < currentDateTime) {
                throw new Error('The reservation date has already passed.');
            }

            // Create a new object excluding the latitude and longitude
            const { parkLat, parkLong, ...dataToSubmit } = formData;

            const reservationRef = ref(database, `reports/${dateKey}`);

            // Save the report under the date
            await set(reservationRef, dataToSubmit);

            alert('Report saved successfully!');
            console.log('Saved report:', dataToSubmit);
            await updateParkStatus(formData.parkName, formData.openOrClosed);
            window.location.href = `/map`;

        } catch (error) {
            console.error('Error saving report:', error);
            alert('Failed to save report.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <div>
                <label>Park name:</label>
                <input
                    type="text"
                    name="parkName"
                    value={formData.parkName}
                    readOnly
                />
            </div>
           
            <div>
                <label>Full Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Date and Time:</label>
                <input
                    type="datetime-local"
                    name="startDateTime"
                    value={formData.startDateTime}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Is the Park Open?</label>
                <input
                    type="checkbox"
                    name="openOrClosed"
                    checked={formData.openOrClosed}
                    onChange={(e) => setFormData({ ...formData, openOrClosed: e.target.checked })}
                />
                <label>{formData.openOrClosed ? "Open" : "Closed"}</label>
            </div>

            <button type="submit" style={{ marginBottom: '10px' }}>Submit Report</button>
            
            <button type="button" onClick={() => window.location.href = '/Home'}>Cancel</button>

        </form>
    );
};

export default ParkStatusReportForm;
