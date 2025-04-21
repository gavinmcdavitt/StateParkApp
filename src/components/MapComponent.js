import React, { useEffect, useRef, useState, useCallback} from 'react';
import { getDistance } from 'geolib';
import { filterParksWithinRadius } from '../geoUtils';
import { useSearchParams } from 'react-router-dom';
import L, { circle } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getObjects } from '../components/readDatabase'; // Adjust path as needed
import Slider from '../components/slider/rangeSlider';
import { get } from 'firebase/database';
import {closedPark, halwayOpenPark, openPark, Personal} from '../components/icons';
import { green } from '@mui/material/colors';

// Define custom icons
const customIcon = L.icon({
    iconUrl: 'leaf-red.png', // Replace with the correct path to your custom icon
    shadowUrl: 'leaf-shadow.png',
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
});

const personalIcon = L.icon({
    iconUrl: 'leaf-green.png', // Replace with the correct path to your custom icon
    shadowUrl: 'leaf-shadow.png',
    iconSize: [29, 71],
    shadowSize: [38, 48],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
});

const spotlightIcon = L.icon({
    iconUrl: 'spotlight.png', // Replace with appropriate spotlight icon
    shadowUrl: 'leaf-shadow.png',
    iconSize: [45, 95], // Slightly larger to make it stand out
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
});

export const MapComponent = () => {
    const [sliderValue, setSliderValue] = useState(50);
    const mapRef = useRef(null); // Ref to store the map instance
    const circleRef = useRef(null); // Ref to store the circle instance
    const [searchParams] = useSearchParams();
    const [userLocation, setUserLocation] = useState(null);
    const lat = parseFloat(searchParams.get('lat')) || null; // Default to 0 if not provided
    const lon = parseFloat(searchParams.get('lon')) || null;
    const [parks, setParks] = useState([]);
    const [filteredParks, setFilteredParks] = useState([]);
    const [isParkListVisible, setIsParkListVisible] = useState(false);
    const [spotlightedPark, setSpotlightedPark] = useState(null); // Track spotlighted park
    const [isSpotlightMode, setIsSpotlightMode] = useState(false); // Track if spotlight mode is active
    const markersRef = useRef([]); // Store references to markers for easy cleanup

    //log the values of lat and lon to see what is being passed
    console.log('lat and lon:', lat, lon);

    const fetchParksData = useCallback(async() => {
        try{
            const response = await fetch(`https://state-park-app-aa4ee-default-rtdb.firebaseio.com/objects`);
            const data = await response.json();
            setParks(data.data || []);
        } catch(error){
            console.error('Error fetching park data:', error);
        }
        //fetch park data and set it
    }, []);

    const isWithinRadius = (park, center, radius) => {
        const distance = getDistance(
            {latitude: center.lat, longitude: center.lng},
            {latitude: park.latitude, longitude: park.longitude}
        );
        return distance <= radius;
    }

    const filterParksWithinRadius = (parks, center, radius) => {
        return parks.filter(park => isWithinRadius(park, center, radius));
    }

    // Function to toggle spotlight mode and set the spotlighted park
    const toggleSpotlight = (park = null) => {
        // Always exit spotlight mode first
        setIsSpotlightMode(false);
        setSpotlightedPark(null);
    
        // Clear and redraw all markers (show all flowers again)
        clearAllMarkers();
        initializeMarkers();
    
        // Close any open popups
        if (mapRef.current) {
            mapRef.current.closePopup();
        }
    
        // If a park is provided and it's different from the previous one, re-enter spotlight mode
        if (park && park !== spotlightedPark) {
            setIsSpotlightMode(true);
            setSpotlightedPark(park);
        }
    };
    
    

    // Function to clear all markers from the map
    const clearAllMarkers = () => {
        if (mapRef.current) {
            markersRef.current.forEach(marker => {
                mapRef.current.removeLayer(marker);
            });
            markersRef.current = [];
        }
    };

    // Function to add a marker to the map with specified icon and popup
    const addMarker = (latitude, longitude, popupText = '', icon = customIcon) => {
        console.log('Adding marker at', latitude, longitude); // Log to check coordinates
        if (mapRef.current) {
            const marker = L.marker([latitude, longitude], { icon }).addTo(mapRef.current);
            markersRef.current.push(marker); // Store reference to marker
            
            if (popupText) {
                if(icon === Personal) {
                    const popupContent = `
                    <div>
                        <p>${popupText}</p>
                    </div>
                    `;
                    marker.bindPopup(popupContent);
                } else {
                    const popupContent = `
                    <div>
                        <p>${popupText}</p>
                        <button onclick="window.location.href='/reservation';" style="
                            padding: 5px 10px; 
                            background-color: #007bff; 
                            color: white; 
                            border: none; 
                            border-radius: 4px; 
                            cursor: pointer;">
                            Go to Reservation
                        </button>
                        
                    </div>
                    `;
                    marker.bindPopup(popupContent);
                }
            }
            return marker;
        }
        return null;
    };

    const handleReservation = (object) => {
        console.log('Reservation made for:', object);
        //go to reservation with the id already in put.
        window.location.href = `/reservation?parkId=${object.id}?parkName=${object.name}`
    };

    // Create a function to handle spotlight click from marker popup
    const createSpotlightClickHandler = (parkId) => {
        return function() {
            // Find the park by id
            const park = parks.find(p => p.id === parkId);
            if (park) {
                toggleSpotlight(park);
            }
        };
    };

    const addMarkerStatePark = (latitude, longitude, popupText = '', id = '', name ='', icon) => {
        console.log('Adding state park marker at', latitude, longitude, popupText); // Log to check if this function is called
        if (mapRef.current) {
            // In spotlight mode, only add the marker if it's the spotlighted park
            if (isSpotlightMode && (!spotlightedPark || (spotlightedPark.id !== id))) {
                return null; // Don't add marker if not the spotlighted park
            }
            
            // Use spotlight icon if this is the spotlighted park
            const markerIcon = isSpotlightMode && spotlightedPark && spotlightedPark.id === id ? spotlightIcon : icon;
            
            const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(mapRef.current);
            markersRef.current.push(marker); // Store reference to marker
            
            if (popupText) {
                // Add a spotlight button to the popup
                const spotlightButtonStyle = `
                    padding: 5px 10px; 
                    background-color: #ff7700; 
                    color: white; 
                    border: none; 
                    border-radius: 4px; 
                    cursor: pointer;
                    margin-left: 5px;
                `;
                
                const spotlightButtonText = isSpotlightMode && spotlightedPark && spotlightedPark.id === id ? 
                    'Turn Off Spotlight' : 'Spotlight This Park';
                
                const popupContent = `
                    <div>
                        <p>${popupText}</p>
                        <div style="display: flex; margin-top: 10px;">
                        
                            <button onclick="window.location.href='/reservation?parkId=${id}?parkName=${name}';" style="
                                padding: 5px 10px; 
                                background-color: #007bff; 
                                color: white; 
                                border: none; 
                                border-radius: 4px; 
                                cursor: pointer;">
                                Go to Reservation
                            </button>
                           
                        </div>
                    </div>
                `;
                marker.bindPopup(popupContent);
                
                // Add event listener to the spotlight button after popup is opened
                marker.on('popupopen', function() {
                    setTimeout(() => {
                        const spotlightButton = document.getElementById(`spotlight-${id}`);
                        if (spotlightButton) {
                            spotlightButton.addEventListener('click', () => {
                                const park = parks.find(p => p.id === id);
                                if (park) {
                                    toggleSpotlight(park);
                                }
                            });
                        }
                    }, 0);
                });
            }
            return marker;
        }
        return null;
    };

    // Function to handle slider value change
    const handleSliderChange = (event) => {
        const newValue = parseInt(event.target.value, 10);
        console.log('Handling slider change, new value: ', newValue); // Log value change
        setSliderValue(newValue);

        if (circleRef.current) {
            circleRef.current.setRadius(newValue * 1609.34); // Convert miles to meters
        }
        console.log('Slider value changed:', event.target.value); // Log value change
    };

    // Initialize all markers based on current state
    const initializeMarkers = () => {
        // Clear any existing markers
        clearAllMarkers();
        
        // Add user location marker if available
        if (userLocation) {
            addMarker(userLocation.lat, userLocation.lng, 'You are here!', Personal);
        } else if (lat && lon) {
            addMarker(lat, lon, 'Specified Location');
        }
        
        // Add park markers based on spotlight mode
        getObjects((objects) => {
            objects.forEach(obj => {
                if (obj.latitude && obj.longitude) {
                    // Skip if in spotlight mode and this isn't the spotlighted park
                    if (isSpotlightMode && (!spotlightedPark || obj.id !== spotlightedPark.id)) {
                        return;
                    }
                    
                    const ratio = parseFloat((obj.currentCapacity / obj.capacity).toFixed(2));
                    let icon;
                    
                    if(obj.capacity <= 15) {
                        icon = openPark;
                    } else if(15 < obj.capacity && obj.capacity <= 23) {
                        icon = halwayOpenPark;
                    } else {
                        icon = closedPark;
                    }
                    
                    // Use spotlight icon if this is the spotlighted park
                    if (isSpotlightMode && spotlightedPark && obj.id === spotlightedPark.id) {
                        icon = spotlightIcon;
                    }
                    
                    addMarkerStatePark(
                        obj.latitude,
                        obj.longitude,
                        `<strong>${obj.name}</strong>
                        <br/>County: ${obj.county}
                        <br />Size: ${obj.size}
                        <br/> Current Capacity ${obj.currentCapacity}
                        <br/>Capacity: ${obj.capacity}`,
                        obj.id, obj.name, icon
                    );
                }
            });
        });
        
    };

    useEffect(() => {
        fetchParksData();
    }, [fetchParksData]);
  
    useEffect(() => {
        //initialize the map
        if (mapRef.current) return; // Prevent map reinitialization

        // Initialize the map and set the ref to the map instance
        const initialLat = lat || 30.43; // Default latitude
        const initialLon = lon || -84.28; // Default longitude
        const initialZoom = lat && lon ? 13 : 14; // Zoom closer if lat/lon is provided

        mapRef.current = L.map('map').setView([initialLat, initialLon], initialZoom);

        // Add OpenStreetMap tiles
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        //Create and add a circle to the map
        circleRef.current = L.circle([initialLat, initialLon], {
            color: 'white',
            fillOpacity: 0.2,
            radius: sliderValue * 1609.34 //initial radius
        }).addTo(mapRef.current);

        // Handle location events
        //create a circle or update it
        mapRef.current.on('locationfound', (e) => {
            if(!circleRef.current){
                circleRef.current = L.circle(e.latlng, {
                    color: 'white',
                    fillOpacity: 0.2,
                    radius: sliderValue * 1609.34
                }).addTo(mapRef.current);
            }
            else{
                circleRef.current.setLatLng(e.latlng);
            }
            setUserLocation(e.latlng);
            addMarker(e.latlng.lat, e.latlng.lng, 'You are here!', Personal);
        });

        mapRef.current.on('locationerror', () => {
            alert('Location access denied.');
        });

        mapRef.current.locate({ setView: lat && lon, maxZoom: 18, minZoom: 13 });
        
        // Initialize markers
        initializeMarkers();

        // Cleanup on unmount: remove the map instance
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []); // Empty dependency array to run only once

    useEffect(() => {
        //update circle radius when slider value changes
        if (circleRef.current) {
            circleRef.current.setRadius(sliderValue * 1609.34);
            const center = circleRef.current.getLatLng();
            const newFilteredParks = parks.filter(park => getDistance(
                {latitude: center.lat, longitude: center.lng},
                {latitude: park.latitude, longitude: park.longitude}
            ) <= sliderValue * 1609.34);
            setFilteredParks(newFilteredParks);
        }
    }, [sliderValue]);

    useEffect(() => {
        getObjects(objects => {
            setParks(objects.filter(obj => obj.latitude && obj.longitude)); // Filter to ensure only objects with valid coordinates are used
        });
    }, []);

    // Update markers when spotlight mode or spotlighted park changes
    useEffect(() => {
        if (mapRef.current) {
            initializeMarkers();
        }
    }, [isSpotlightMode, spotlightedPark]);

    const updateFilteredAndSortedParks = useCallback(() => {
        if (mapRef.current && circleRef.current) {
            const center = circleRef.current.getLatLng();
            const radiusInMeters = sliderValue * 1609.34; // Slider value in miles, converted to meters
            
            // If in spotlight mode and there's a spotlighted park, only show that park
            if (isSpotlightMode && spotlightedPark) {
                setFilteredParks([spotlightedPark]);
                return;
            }
            
            const parksWithDistance = parks.map(park => ({
                ...park,
                distance: getDistance(
                    { latitude: center.lat, longitude: center.lng },
                    { latitude: parseFloat(park.latitude), longitude: parseFloat(park.longitude) }
                )
            })).filter(park => park.distance <= radiusInMeters);
    
            // Sort parks by distance
            parksWithDistance.sort((a, b) => a.distance - b.distance);
    
            setFilteredParks(parksWithDistance);
        }
    }, [parks, sliderValue, isSpotlightMode, spotlightedPark]);
    
    useEffect(() => {
        updateFilteredAndSortedParks();
    }, [sliderValue, parks, updateFilteredAndSortedParks, isSpotlightMode, spotlightedPark]);

    return (
        <div style={{ position: 'relative' }}>
            <div id="map" style={{ height: '100vh', width: '100%' }}></div>
            
            {/* Toggle Button */}
            <button 
                onClick={() => setIsParkListVisible(!isParkListVisible)} 
                style={{
                    position: 'absolute',
                    bottom: '20px', // Fixed position at the bottom of the screen
                    right: '20px', // Align to the right of the screen
                    zIndex: 9990, // Ensure it's above other elements
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)', // Optional shadow for visibility
                }}
            >
                {isParkListVisible ? 'Hide Parks' : 'Show Parks'}
            </button>


            <div 
                style={{
                    position: 'absolute',
                    top: '0', 
                    right: isParkListVisible ? '0' : '-300px', // Hide off-screen and slide in
                    width: '300px', // Set the width of the sliding panel
                    height: '100%', // Full height
                    zIndex: 1000,
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '8px 0 0 8px', // Rounded edge on the left
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', // Optional shadow for better visibility
                    transition: 'right 0.3s ease-in-out' // Smooth slide effect
                }}
            >
                <div style={{
                    maxHeight: 'calc(100% - 50px)', // Adjustable height cap
                    overflowY: 'auto', // Adds vertical scrolling
                    paddingRight: '10px', // Optional padding for scrollbar clearance
                }}>
                    <h4>Parks within Radius ({sliderValue} miles):</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {/* Show only spotlighted park if in spotlight mode */}
                        {isSpotlightMode && spotlightedPark ? (
                            <li key={spotlightedPark.id} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                marginBottom: '10px',
                                padding: '8px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ display: 'flex', marginRight: '8px' }}>
                                    <button 
                                        onClick={() => handleReservation(spotlightedPark)} 
                                        style={{
                                            padding: '5px 5px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '5px'
                                        }}
                                    >
                                        <img 
                                            src="reservation.png" 
                                            alt="Icon" 
                                            style={{ width: '20px', height: '20px' }} 
                                        />
                                    </button>
                                    <button 
                                        onClick={() => toggleSpotlight(null)} 
                                        style={{
                                            padding: '5px 5px',
                                            backgroundColor: '#ff7700', // Orange color for spotlight
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <img 
                                            src="spotlight.png" 
                                            alt="Spotlight" 
                                            style={{ width: '20px', height: '20px' }} 
                                        />
                                    </button>
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                    {spotlightedPark.name} - Spotlighted
                                </span>
                            </li>
                        ) : (
                            // Show all filtered parks if not in spotlight mode
                            filteredParks.map(park => (
                                <li key={park.id} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    marginBottom: '10px',
                                    padding: '8px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '4px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ display: 'flex', marginRight: '8px' }}>
                                        <button 
                                            onClick={() => handleReservation(park)} 
                                            style={{
                                                padding: '5px 5px',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginRight: '5px'
                                            }}
                                        >
                                            <img 
                                                src="reservation.png" 
                                                alt="Icon" 
                                                style={{ width: '20px', height: '20px' }} 
                                            />
                                        </button>
                                        <button 
                                            onClick={() => toggleSpotlight(park)} 
                                            style={{
                                                padding: '5px 5px',
                                                backgroundColor: '#ff7700', // Orange color for spotlight
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <img 
                                                src="spotlight.png" 
                                                alt="Spotlight" 
                                                style={{ width: '20px', height: '20px' }} 
                                            />
                                        </button>
                                    </div>
                                    <span style={{ fontSize: '14px' }}>
                                        {park.name} - {Math.round(park.distance / 1609.34)} mi.
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                top: '10px',
                left: '50px',
                zIndex: 1000,
                backgroundColor: 'white',
                padding: '0px',
                borderRadius: '8px'
            }}>
                <Slider 
                    value={sliderValue} 
                    onChange={handleSliderChange}
                    style={{
                        width: '150px',
                        color: '#007bff',
                        margin: '10px 0',
                        padding: '0',
                    }}
                />
            </div>
            
            {/* Back button container */}
            <div style={{
                position: 'absolute', 
                bottom: '20px', 
                left: '20px', 
                zIndex: 1000, 
                backgroundColor: 'white', 
                padding: '10px', 
                borderRadius: '8px'
            }}>
                <button onClick={() => window.history.back()} style={{
                    padding: '5px 10px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer'
                }}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default MapComponent;