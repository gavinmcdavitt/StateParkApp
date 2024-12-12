import React, { useState } from 'react';
import { ref, set, get, update } from "firebase/database";
import { database } from '../config/firebase-config'; // Adjust the path as needed

export const ensureBooleanField = async () => {
    try {
        const objectsRef = ref(database, 'objects/');
        const snapshot = await get(objectsRef);

        if (snapshot.exists()) {
            const objects = snapshot.val();
            const updates = {};

            Object.keys(objects).forEach((key) => {
                const object = objects[key];

                // Ensure `isOpen` is a boolean
                if (typeof object.isOpen !== "boolean") {
                    updates[`objects/${key}/isOpen`] = false; // Default to false
                }
            });

            if (Object.keys(updates).length > 0) {
                await update(ref(database), updates);
                console.log("Successfully ensured 'isOpen' field is a boolean for all objects.");
            } else {
                console.log("No updates needed. All objects already have a valid 'isOpen' field.");
            }
        } else {
            console.log("No objects found in the database.");
        }
    } catch (error) {
        console.error("Error ensuring 'isOpen' field:", error);
    }
};
export const addCapacityToAllObjects = () => {
    const objectsRef = ref(database, 'objects'); // Reference to the 'objects' node

    get(objectsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const objects = snapshot.val(); // Get all objects from the database

                // Iterate through each object and add the 'capacity' field
                const updates = {};
                Object.keys(objects).forEach((objectKey) => {
                    const object = objects[objectKey];
                    const randomNumber = Math.floor(Math.random() * 25) + 1;
console.log(randomNumber);
                    // If the 'capacity' field doesn't exist, add it with a default value of 0
                    if (object.capacity === 0) {
                        
                        object.capacity = randomNumber; // Default value
                    }
                    if(typeof object.parkingCapcity =="number")
                    {
                        object.parkingCapcity =randomNumber;
                    }
                    if(typeof object.currentCapacity !=="number")
                    {
                        object.currentCapacity =0;
                    }
                    
                    // Prepare update for each object
                    updates[`objects/${objectKey}`] = object;
                });

                // Update the objects in the database
                return update(ref(database), updates);
            } else {
                console.log("No objects found in the database.");
            }
        })
        .then(() => {
            console.log("Capacity field added to all objects successfully!");
        })
        .catch((error) => {
            console.error("Error updating objects: ", error);
        });
};

// Function to add an object
export const addObj = (newObject) => {
    const objectRef = ref(database, 'objects/' + newObject.name); // Use a unique key (like ID)
    return set(objectRef, newObject)
        .then(() => {
            console.log("Object added successfully!");
        })
        .catch((error) => {
            console.error("Error adding object: ", error);
        });
};

export const Homer = () => {
    const initialFormState = {
        id: '',
        name: '',
        county: '',
        size: '',
        yearEstablished: '',
        waterBody: '',
        remarks: '',
        longitude:'',
        latitude:'',
    };

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        county: '',
        size: '',
        yearEstablished: '',
        waterBody: '',
        remarks: '',
        longitude: '',
        latitude:''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        if (
            formData.id && formData.name && formData.size && formData.county &&
            formData.yearEstablished && formData.waterBody && formData.remarks && formData.longitude && formData.latitude
        ) {
            addObj({
                ...formData,
                timestamp: Date.now()
            });
            setFormData(initialFormState);
        } else {
            console.log("Please fill in all fields.");
        }
    };

    return (
        <div>
            <h1>Enter Object Details</h1>
            <div>
                <label>ID:</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} />
            </div>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <label>County:</label>
                <input type="text" name="county" value={formData.county} onChange={handleChange} />
            </div>
            <div>
                <label>Size:</label>
                <input type="text" name="size" value={formData.size} onChange={handleChange} />
            </div>
            <div>
                <label>Year Established:</label>
                <input type="text" name="yearEstablished" value={formData.yearEstablished} onChange={handleChange} />
            </div>
            <div>
                <label>Water Body(s):</label>
                <input type="text" name="waterBody" value={formData.waterBody} onChange={handleChange} />
            </div>
            <div>
                <label>Remarks:</label>
                <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} />
            </div>

            <div>
                <label>longitude:</label>
                <input type="text" name="longitude" value={formData.relongitudemarks} onChange={handleChange} />
            </div>

            <div>
                <label>latitude:</label>
                <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} />
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Homer;