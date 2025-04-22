import React, { useEffect, useRef, useState, useCallback} from 'react';
import { getDistance } from 'geolib';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getObjects } from '../components/readDatabase'; // Adjust path as needed
import Slider from '../components/slider/rangeSlider';
import {closedPark, halwayOpenPark, openPark, Personal, customIcon, shadowOnlyFlowerIcon, personalIcon, spotlightIcon} from '../components/icons';
import {ParkToggleButton} from '../components/parkToggleButton';

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
    const spotlightMarkerRef = useRef(null); // Ref for the spotlight marker
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
    };

    const filterParksWithinRadius = (parks, center, radius) => {
        return parks.filter(park => isWithinRadius(park, center, radius));
    };

    // Function to clear all markers from the map
    const clearAllMarkers = () => {
        if (mapRef.current) {
            markersRef.current.forEach(marker => {
                mapRef.current.removeLayer(marker);
            });
            markersRef.current = [];
            
            // Also remove the spotlight marker if it exists
            if (spotlightMarkerRef.current) {
                mapRef.current.removeLayer(spotlightMarkerRef.current);
                spotlightMarkerRef.current = null;
            }
        }
    };
    
    // Function to toggle spotlight mode and set the spotlighted park
    const toggleSpotlight = (park = null) => {
        if (isSpotlightMode && (!park || park === spotlightedPark)) {
            // Turning off spotlight mode
            setIsSpotlightMode(false);
            setSpotlightedPark(null);
            
            // Remove spotlight marker
            if (spotlightMarkerRef.current && mapRef.current) {
                mapRef.current.removeLayer(spotlightMarkerRef.current);
                spotlightMarkerRef.current = null;
            }
            
            // Reinitialize all markers
            clearAllMarkers();
            initializeAllMarkers();
        } else if (park && park !== spotlightedPark) {
            // Turning on spotlight mode with a new park
            setIsSpotlightMode(true);
            setSpotlightedPark(park);
            
            // Clear all existing markers
            clearAllMarkers();
            
            // Add only the spotlight marker
            if (mapRef.current) {
                spotlightMarkerRef.current = L.marker(
                    [park.latitude, park.longitude],
                    { icon: spotlightIcon }
                ).addTo(mapRef.current);
                
                const popupContent = `
                    <div>
                        <p><strong>${park.name}</strong>
                        <br/>County: ${park.county}
                        <br/>Size: ${park.size}
                        <br/>Current Capacity: ${park.currentCapacity}
                        <br/>Capacity: ${park.capacity}
                        <br/>Is Park Open: ${park.isOpen} </p>
                        
                        <button onclick="window.location.href='/reservation?parkId=${park.id}?parkName=${park.name}';" style="
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
                spotlightMarkerRef.current.bindPopup(popupContent);
            }
            
            // Keep the user location marker if available
            if (userLocation) {
                addMarker(userLocation.lat, userLocation.lng, 'You are here!', Personal);
            } else if (lat && lon) {
                addMarker(lat, lon, 'Specified Location');
            }
        }
        
        // Close any open popups
        if (mapRef.current) {
            mapRef.current.closePopup();
        }
    };
    
    const initializeMarkers = () => {
        // Add user location marker if available
        if (userLocation) {
            addMarker(userLocation.lat, userLocation.lng, 'You are here!', Personal);
        } else if (lat && lon) {
            addMarker(lat, lon, 'Specified Location');
        }
    };
    
    // Function to initialize all park markers based on their properties
    const initializeAllMarkers = () => {
        // First add user location or specified location
        initializeMarkers();
        
        // If in spotlight mode, don't add other markers
        if (isSpotlightMode) return;
        
        // Add markers for all parks
        getObjects((objects) => {
            objects.forEach(obj => {
                if (obj.latitude && obj.longitude) {
                    let icon;
                    if (!obj.isOpen) {
                        icon = shadowOnlyFlowerIcon;
                    } else if (obj.capacity <= 15) {
                        icon = openPark;
                    } else if (obj.capacity <= 23) {
                        icon = halwayOpenPark;
                    } else {
                        icon = closedPark;
                    }
                    
                    addMarkerStatePark(
                        obj.latitude,
                        obj.longitude,
                        `<strong>${obj.name}</strong>
                        <br/>County: ${obj.county}
                        <br/>Size: ${obj.size}
                        <br/>Current Capacity: ${obj.currentCapacity}
                        <br/>Capacity: ${obj.capacity}
                        <br/>Is Park Open: ${obj.isOpen}`,
                        obj.id, obj.name, icon
                    );
                }
            });
        });
    };

    // Function to add a marker to the map with specified icon and popup
    const addMarker = (latitude, longitude, popupText = '', icon = customIcon) => {
        console.log('Adding marker at', latitude, longitude); // Log to check coordinates
        if (mapRef.current) {
            const marker = L.marker([latitude, longitude], { icon }).addTo(mapRef.current);
            markersRef.current.push(marker); // Store marker reference
            if (popupText) {
                if(icon === Personal)
                {
                    const popupContent = `
                    <div>
                        <p>${popupText}</p>
                    </div>
                `;
                marker.bindPopup(popupContent);
                }
                else{
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
        window.location.href = `/reservation?parkId=${object.id}?parkName=${object.name}`;
    };

    const addMarkerStatePark = (latitude, longitude, popupText = '', id = '', name ='', icon) => {
        console.log('Adding state park marker at', latitude, longitude, popupText); // Log to check if this function is called
        if (mapRef.current) {
            const marker = L.marker([latitude, longitude], { icon: icon }).addTo(mapRef.current);
            markersRef.current.push(marker); // Store marker reference
            if (popupText) {
                const popupContent = `
                    <div>
                        <p>${popupText}</p>
                        <button onclick="window.location.href='/reservation?parkId=${id}?parkName=${name}';" style="
                            padding: 5px 10px; 
                            background-color: #007bff; 
                            color: white; 
                            border: none; 
                            border-radius: 4px; 
                            cursor: pointer;">
                            Go to Reservation
                        </button>

                        <button 
                            onclick="window.location.href='/report?parkId=${id}&parkName=${name}&parkLat=${latitude}&parkLong=${longitude}';" 
                            style="
                                padding: 5px 10px; 
                                background-color: #28a745;
                                color: white; 
                                border: none; 
                                border-radius: 4px; 
                                cursor: pointer;
                                font-size: 16px;
                            ">
                            Report Parks Open Status
                        </button>
                        
                        <button 
                            onclick="document.dispatchEvent(new CustomEvent('toggleSpotlight', {detail: {id: '${id}', name: '${name}', latitude: ${latitude}, longitude: ${longitude}}}));" 
                            style="
                                padding: 5px 10px; 
                                background-color: #ffc107;
                                color: black; 
                                border: none; 
                                border-radius: 4px; 
                                cursor: pointer;
                                font-size: 16px;
                                margin-top: 5px;
                            ">
                            ${isSpotlightMode && spotlightedPark && spotlightedPark.id === id ? 'Remove Spotlight' : 'Spotlight This Park'}
                        </button>
                    </div>
                `;
                marker.bindPopup(popupContent);
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

    // Handle custom events for spotlight toggle from popup buttons
    useEffect(() => {
        const handleSpotlightEvent = (e) => {
            const park = e.detail;
            toggleSpotlight(park);
        };
        
        document.addEventListener('toggleSpotlight', handleSpotlightEvent);
        
        return () => {
            document.removeEventListener('toggleSpotlight', handleSpotlightEvent);
        };
    }, [isSpotlightMode, spotlightedPark]);

    useEffect(() => {
        if (mapRef.current) {
            // Clear all markers first
            clearAllMarkers();
            
            // If in spotlight mode, only add the spotlight marker
            if (isSpotlightMode && spotlightedPark) {
                spotlightMarkerRef.current = L.marker(
                    [spotlightedPark.latitude, spotlightedPark.longitude],
                    { icon: spotlightIcon }
                ).addTo(mapRef.current);
                
                const popupContent = `
                    <div>
                        <p><strong>${spotlightedPark.name}</strong>
                        <br/>County: ${spotlightedPark.county || ''}
                        <br/>Size: ${spotlightedPark.size || ''}
                        <br/>Current Capacity: ${spotlightedPark.currentCapacity || ''}
                        <br/>Capacity: ${spotlightedPark.capacity || ''}</p>
                        <button onclick="window.location.href='/reservation?parkId=${spotlightedPark.id}?parkName=${spotlightedPark.name}';" style="
                            padding: 5px 10px; 
                            background-color: #007bff; 
                            color: white; 
                            border: none; 
                            border-radius: 4px; 
                            cursor: pointer;">
                            Go to Reservation
                        </button>
                        
                        <button 
                            onclick="document.dispatchEvent(new CustomEvent('toggleSpotlight'));" 
                            style="
                                padding: 5px 10px; 
                                background-color: #dc3545;
                                color: white; 
                                border: none; 
                                border-radius: 4px; 
                                cursor: pointer;
                                font-size: 16px;
                                margin-top: 5px;
                            ">
                            Exit Spotlight Mode
                        </button>
                    </div>
                `;
                spotlightMarkerRef.current.bindPopup(popupContent);
                
                // Add user location
                initializeMarkers();
            } else {
                // Otherwise initialize all markers
                initializeAllMarkers();
            }
        }
    }, [isSpotlightMode, spotlightedPark]);

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
                //circleRef.current.setRadius(sliderValue * 1000);
            }
            setUserLocation(e.latlng);
            addMarker(e.latlng.lat, e.latlng.lng, 'You are here!', Personal);
        });

        mapRef.current.on('locationerror', () => {
            alert('Location access denied.');
        });

        mapRef.current.locate({ setView: !lat && !lon, maxZoom: 18, minZoom: 13 });

        // Initialize all markers
        initializeAllMarkers();

        // Cleanup on unmount: remove the map instance
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []); // Empty dependency array to run only once

    useEffect(() => {
        //update cicle radius when slider value changes
        if (circleRef.current) {
            circleRef.current.setRadius(sliderValue * 1609.34);
            const center = circleRef.current.getLatLng();
            const newFilteredParks = parks.filter(park => getDistance(
                {latitude: center.lat, longitude: center.lng},
                {latitude: park.latitude, longitude: park.longitude}
            ) <= sliderValue * 1609.34);
            setFilteredParks(newFilteredParks);
        }
    }, [sliderValue, parks]);

    useEffect(() => {
        getObjects(objects => {
            setParks(objects.filter(obj => obj.latitude && obj.longitude)); // Filter to ensure only objects with valid coordinates are used
        });
    }, []);

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

            {/* Spotlight Mode Indicator (if active) */}
                    {isSpotlightMode && (
            <div 
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9991,
                    backgroundColor: '#ffc107',
                    color: 'black',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                }}
            >
                Spotlight Mode: {spotlightedPark?.name}
                <button
                    onClick={() => toggleSpotlight()}
                    style={{
                        marginLeft: '10px',
                        padding: '2px 8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                    }}
                >
                    X
                </button>
            </div>
        )}


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
                    <ul>
                        {filteredParks.map(park => (
                            <li key={park.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                <button 
                                    onClick={() => handleReservation(park)} 
                                    style={{
                                        padding: '5px 5px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginRight: '10px'
                                    }}
                                >
                                    <img 
                                        src="reservation.png" 
                                        alt="Icon" 
                                        style={{ width: '20px', height: '20px' }} 
                                    />
                                </button>
                                <span style={{ fontSize: '14px', flex: 1 }}>
                                    {park.name} - {Math.round(park.distance / 1609.34)} mi.
                                </span>
                                <button
                                    onClick={() => toggleSpotlight(park)}
                                    style={{
                                        padding: '3px 8px',
                                        backgroundColor: isSpotlightMode && spotlightedPark?.id === park.id ? '#dc3545' : '#ffc107',
                                        color: isSpotlightMode && spotlightedPark?.id === park.id ? 'white' : 'black',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isSpotlightMode && spotlightedPark?.id === park.id ? 'Exit' : '★'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <ParkToggleButton/>

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
                    onChange={handleSliderChange} // Add event listener to log changes
                    style={{
                        width: '150px', // Adjust width to take less space
                        color: '#007bff', // Modern blue accent color
                        margin: '10px 0', // Compact spacing
                        padding: '0', // Remove extra padding
                    }}
                />
            </div>
            
            {/* Back button container with absolute positioning to appear on top of the map */}
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