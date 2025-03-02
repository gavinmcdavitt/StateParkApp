import { ref, onValue, update, get, } from "firebase/database";
import { database } from '../config/firebase-config'; // Adjust the path as needed

// Function to get objects with longitude and latitude

export const updateCurrentCapacity = async (parkName, numOfGuests) => {
    try {
        if (!parkName) {
            console.error("No park ID provided.");
            return;
        }
        const parkRef = ref(database, `objects/${parkName}`);
        console.log(`Updating park at path: objects/${parkName}`); // Debug
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
            console.error("Park not found with the given Name:", parkName);
        }
    } catch (error) {
        console.error("Error updating currentCapacity:", error);
    }
};

//Reset function that you would need to call every single night.
export const ZeroOutCapacityAndClose = (database, callback) => {
    const objectsRef = ref(database, 'objects');

    onValue(objectsRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
            const updates = {}; // Object to hold the update references
            
            Object.entries(data).forEach(([key, obj]) => {
                const randomNumber = Math.floor(Math.random() * 5) + 1;
                const zero = Math.floor(14);
                // Here, the key is the name of the object, so we use it directly in the path
                updates[`objects/${key}/currentCapacity`] = randomNumber;
                console.log('db is now updated to zero');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
            });

            // Update the database with the transformed objects
            update(ref(database), updates)
                .then(() => {
                    console.log("All objects reset successfully!");
                    if (callback) {
                        callback(Object.values(data)); // Return updated objects if needed
                    }
                })
                .catch((error) => {
                    console.error("Error resetting objects: ", error);
                });
        }
    });
};


export const getObjects = (callback) => {
    
    //ZeroOutCapacityAndClose();
    const objectsRef = ref(database, 'objects');
    onValue(objectsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const objectsArray = Object.values(data).map(obj => ({
                ...obj,
                longitude: obj.longitude || null,
                latitude: obj.latitude || null,
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
