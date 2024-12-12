import React, { useEffect, useState } from 'react';
import { database } from '../../config/firebase-config';
import { useLocation } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import { updateCurrentCapacity } from '../../components/readDatabase';
import './index.css';

export const ReservationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        startDateTime: '',
        guests: 1,
        parkId: '',
        parkName:'',
    });

    const location = useLocation();

    useEffect(() => {
        const queryString = location.search.substring(1); // Remove the leading '?'
        const params = queryString.split('?'); // Split at the first '?'
    
        let parkId = null;
        let parkName = null;
    
        // Extract `parkId` and `parkName` manually
        params.forEach(param => {
            if (param.startsWith('parkId=')) {
                parkId = param.split('=')[1];
            } else if (param.startsWith('parkName=')) {
                parkName = decodeURIComponent(param.split('=')[1]);
            }
        });
    
        // Update formData with the extracted values
        setFormData((prevFormData) => ({
            ...prevFormData,
            ...(parkId && { parkId }),
            ...(parkName && { parkName }),
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
        if (dateKey < currentDateTime) {
            throw new Error('The reservation date has already passed.');
        } 
            const reservationRef = ref(database, `reservations/${dateKey}`);

            // Save the reservation under the date
            await set(reservationRef, formData);

            alert('Reservation saved successfully!');
            console.log('Saved reservation:', formData);
            console.log(formData.parkId);
            
            updateCurrentCapacity(formData.parkName, formData.guests);
           // window.location.href = '/map';

        } catch (error) {
            console.error('Error saving reservation:', error);
            alert('Failed to save reservation.');
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
                <label>Phone:</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Start Date and Time:</label>
                <input
                    type="datetime-local"
                    name="startDateTime"
                    value={formData.startDateTime}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Number of Guests:</label>
                <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    min="1"
                    required
                />
            </div>

            <button type="submit" style={{ marginBottom: '10px' }}>Submit Reservation</button>
            
            <button type="submit" onClick={() => window.location.href = '/Home'}>Cancel</button>
          
        </form>
        
    );
};

export default ReservationForm;

