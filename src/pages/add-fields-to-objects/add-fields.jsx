import React from 'react';
import { addCapacityToAllObjects } from './../../components/addObject'; // Import the function from the existing file

export const AddCapacityButton = () => {
    const handleAddCapacity = () => {
        // Call the function to add capacity to all objects
        addCapacityToAllObjects();
    };

    return (
        <div>
            <h1>Add Capacity to All Objects</h1>
            <button onClick={handleAddCapacity}>Add Capacity</button>
        </div>
    );
};

export default AddCapacityButton;
