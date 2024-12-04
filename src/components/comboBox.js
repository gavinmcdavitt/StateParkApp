import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getObjects } from '../components/readDatabase';
import { Button } from 'react-bootstrap';

const ReservationButton = ({ onClick }) => {
    
    return (
        <Button 
            onClick={onClick} 
            variant="primary" 
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: '10px',
                padding: '5px 10px',
                fontSize: '0.8rem',
            }}
        >
            <img 
                src="reservation.png" 
                alt="Icon" 
                style={{ marginRight: '8px', width: '20px', height: '20px' }} 
            />
            Reserve
        </Button>
    );
};

export const CreatedComboBox = () => {
    const [objects, setObjects] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredObjects, setFilteredObjects] = useState([]);

    useEffect(() => {
        getObjects((objectsArray) => {
            setObjects(objectsArray);
            setFilteredObjects(objectsArray);
        });
    }, []);

    useEffect(() => {
        const results = objects.filter((object) =>
            object.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredObjects(results);
    }, [searchInput, objects]);

    const handleReservation = (object) => {
        console.log('Reservation made for:', object);
        //go to reservation with the id already in put.
        window.location.href = `/reservation?parkId=${object.id}`
    };
    

    return (
        <div style={{ marginTop: '60px' }}>
            <h3>Search for Objects</h3>
            <Autocomplete
                options={filteredObjects}
                getOptionLabel={(option) => option.name || ''}
                style={{ width: 400 }}
                onInputChange={(event, newInputValue) => setSearchInput(newInputValue)}
                onChange ={(event, selectedOption) => 
                    //console.log(selectedOption)
                     window.location.href =`/map?lat=${selectedOption.latitude}&lon=${selectedOption.longitude}`
                 }
                renderOption={(props, option) => (
                    <div 
                        {...props} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            width: '100%' 
                        }}
                    >
                        <span>{option.name}</span>
                        <ReservationButton onClick={() => handleReservation(option)} />
                    </div>
                )}
                renderInput={(params) =>
                    <TextField 
                        {...params} 
                        label="Search Objects" 
                        variant="outlined"
                        sx={{
                            "& .MuiInputBase-root": {
                                backgroundColor: "white",
                                color: "black",
                            },
                            "& .MuiInputLabel-root": {
                                color: "black",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "black",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "black",
                            },
                        }}
                    />
                }
            />
        </div>
    );
};

export default CreatedComboBox;
