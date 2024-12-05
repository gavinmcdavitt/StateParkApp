import { ref, onValue, update, get } from "firebase/database";
import { database } from '../config/firebase-config'; // Adjust the path as needed

// Function to get objects with longitude and latitude

export const updateCurrentCapacity = async (parkId, numOfGuests) => {
    try {
        if (!parkId) {
            console.error("No park ID provided.");
            return;
        }

        const parkRef = ref(database, `objects/${parkId}`);
        console.log(`Updating park at path: objects/${parkId}`); // Debug

        // Fetch the park by its ID
        const snapshot = await get(parkRef);

        if (snapshot.exists()) {
            const parkData = snapshot.val();
            console.log("Park data:", parkData); // Debug

            const currentCapacity = parkData.currentCapacity || 0; // Default to 0 if undefined
            const updatedCapacity = currentCapacity + numOfGuests;

            // Update the park's capacity
            await update(parkRef, { currentCapacity: updatedCapacity });

            console.log(`Successfully updated currentCapacity to ${updatedCapacity}`);
        } else {
            console.error("Park not found with the given ID:", parkId);
        }
    } catch (error) {
        console.error("Error updating currentCapacity:", error);
    }
};

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
