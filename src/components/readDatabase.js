import { ref, onValue } from "firebase/database";
import { database } from '../config/firebase-config'; // Adjust the path as needed

// Function to get objects with longitude and latitude
export const getObjects = (callback) => {
    const objectsRef = ref(database, 'objects');
    onValue(objectsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const objectsArray = Object.values(data).map(obj => ({
                ...obj,
                longitude: obj.longitude || null,
                latitude: obj.latitude || null
            }));
            callback(objectsArray);
        }
    });
};

export const getReservationsByEmail = (email, callback) =>{
    const objectsRef = ref(database, 'reservations');
    onValue(objectsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Convert data to an array and filter by email
            const filteredObjects = Object.values(data)
                .filter(obj => obj.email === email) // Filter by email
                .map(obj => ({
                    ...obj,
                    longitude: obj.longitude || null,
                    latitude: obj.latitude || null
                }));
            callback(filteredObjects);
        } else {
            callback([]); // Return an empty array if no data
        }
    });  
};
