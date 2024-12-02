import React, { useState } from 'react';
import { ref, set } from "firebase/database";
import { database } from '../config/firebase-config'; // Adjust the path as needed

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
            <button onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default Homer;



// import React, { useEffect } from 'react';
// import { ref, set } from "firebase/database";
// import { database }from '../config/firebase-config'; // Adjust the path as needed

// export const newObject = {
//     id: 1,
//     name: "Example Object",
//     description: "This is a sample object.",
//     timestamp: Date.now()
// };

// // Function to add an object
// export const addObj = (newObject) => {
//     const objectRef = ref(database, 'objects/' + newObject.id); // Use a unique key (like ID)
//     return set(objectRef, newObject)
//         .then(() => {
//             console.log("Object added successfully!");
//         })
//         .catch((error) => {
//             console.error("Error adding object: ", error);
//         });
// };

// export const Homer = () => {
//     useEffect(() => {
//         // Call the function when the component mounts
//         addObj(newObject);
//     }, []); // Empty dependency array means this runs once when the component mounts

//     return (
//         <div>
//             <h1>Welcome to the Home Page</h1>
//             <button onclick ={addObj}></button>
//             {/* Additional content here */}
//         </div>
//     );
// };

// export default Homer;
