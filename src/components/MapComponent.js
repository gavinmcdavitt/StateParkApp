// // src/MapComponent.js
import React, { useEffect, useRef, useState, useCallback} from 'react';
import { getDistance } from 'geolib';
import { filterParksWithinRadius } from '../geoUtils';
import { useSearchParams } from 'react-router-dom';
import L, { circle } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getObjects } from '../components/readDatabase'; // Adjust path as needed
import Slider from '../components/slider/rangeSlider';
import { get } from 'firebase/database';

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

const stateParkIcon = L.icon({
    iconUrl: 'leaf-orange.png', // Replace with the correct path to your custom icon
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

export const MapComponent = () => {
    const [sliderValue, setSliderValue] = useState(50);
    const mapRef = useRef(null); // Ref to store the map instance
    const circleRef = useRef(null); // Ref to store the circle instance
    const [searchParams] = useSearchParams();
    const [userLocation, setUserLocation] = useState(null);
    const lat = parseFloat(searchParams.get('lat')) || null; // Default to 0 if not provided
    const lon = parseFloat(searchParams.get('lon')) || null;
    const [parks, setParks] = useState([]);
    const[filteredParks, setFilteredParks] = useState([]);

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
   // const listOfMarkers= [];

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
    // Function to add a marker to the map with specified icon and popup
const addMarker = (latitude, longitude, popupText = '', icon = customIcon) => {
    console.log('Adding marker at', latitude, longitude); // Log to check coordinates
    if (mapRef.current) {
        const marker = L.marker([latitude, longitude], { icon }).addTo(mapRef.current);
        if (popupText) {
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
};

const addMarkerStatePark = (latitude, longitude, popupText = '', id = '') => {
    
    console.log('Adding state park marker at', latitude, longitude, popupText); // Log to check if this function is called
    if (mapRef.current) {
        const marker = L.marker([latitude, longitude], { icon: stateParkIcon }).addTo(mapRef.current);
        if (popupText) {
            const popupContent = `
                <div>
                    <p>${popupText}</p>
                    <button onclick="window.location.href='/reservation?parkId=${id}';" style="
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
};     // Function to handle slider value change
  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    console.log('Handling slider change, new value: ', newValue); // Log value change
    setSliderValue(newValue);

    if (circleRef.current) {
      circleRef.current.setRadius(newValue * 1609.34); // Convert km to meters
    }
    console.log('Slider value changed:', event.target.value); // Log value change
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
    const initialZoom = lat && lon ? 12 : 13; // Zoom closer if lat/lon is provided

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

    // Add a marker at the specified lat/lon from the URL
    if (lat && lon) {
        addMarker(lat, lon, 'Specified Location');
    }
    else{
        console.log('lat and long: ', lat, lon);
    }

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
    addMarker(e.latlng.lat, e.latlng.lng, 'You are here!', personalIcon);
    });

    
    mapRef.current.on('locationerror', () => {
        alert('Location access denied.');
    });

    mapRef.current.locate({ setView: !lat && !lon, maxZoom: 18 });

    // Fetch and display markers for other objects and parks
    getObjects((objects) => {
        console.log('Fetched objects:', objects); // Check if the data has latitude and longitude
        objects.forEach(obj => {
            console.log('Latitude:', obj.latitude, 'Longitude:', obj.longitude); // Log each lat/long
            if (obj.latitude && obj.longitude) {
                addMarkerStatePark(
                    obj.latitude,
                    obj.longitude,
                    `<strong>${obj.name}</strong><br />County: ${obj.county}<br />Size: ${obj.size}`,
                    obj.id
                );
            }
        });
    });

    fetch(`https://developer.nps.gov/api/v1/parks?stateCode=&limit=100&api_key=${process.env.REACT_APP_NATIONAL_PARK}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            //console.log('Received data:', JSON.stringify(data, null, 2));
            if (data.data && data.data.length > 0) {
                data.data.forEach(park => {
                    const latitude = parseFloat(park.latitude);
                    const longitude = parseFloat(park.longitude);
                    if (latitude && longitude) {
                        console.log(`Park: ${park.fullName}, Latitude: ${latitude}, Longitude: ${longitude}`);
                        addMarker(latitude, longitude, park.fullName);
                    }
                });
            } else {
                console.error('No park data found in the response.');
            }
        })
        .catch(error => console.error('Error:', error));

    // Cleanup on unmount: remove the map instance
    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
    //fetchParksData();
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
    }, [sliderValue]);

    useEffect(() => {
        getObjects(objects => {
            setParks(objects.filter(obj => obj.latitude && obj.longitude)); // Filter to ensure only objects with valid coordinates are used
        });
    }, []);


    /*
    const updateFilteredParks = useCallback(() => {
        if (mapRef.current && circleRef.current) {
            const center = circleRef.current.getLatLng();
            const radius = sliderValue * 1609.34; // Convert km to meters
            const newFilteredParks = parks.filter(park => {
                const distance = getDistance(
                    { latitude: center.lat, longitude: center.lng },
                    { latitude: parseFloat(park.latitude), longitude: parseFloat(park.longitude) }
                );
                return distance <= radius;
            });
            setFilteredParks(newFilteredParks);
        }
    }, [parks, sliderValue]);
    */

    const updateFilteredAndSortedParks = useCallback(() => {
        if (mapRef.current && circleRef.current) {
            const center = circleRef.current.getLatLng();
            const radiusInMeters = sliderValue * 1609.34; // Slider value in miles, converted to meters
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
    }, [parks, sliderValue]);
    
    useEffect(() => {
        updateFilteredAndSortedParks();
        //updateFilteredParks();
    }, [sliderValue, parks, updateFilteredAndSortedParks]);

    return (
        <div style={{ position: 'relative' }}>
                  <div id="map" style={{ height: '100vh', width: '100%' }}></div>
            
                  {/* Slider container with absolute positioning to appear on top of the map */}
          <div style={{
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            zIndex: 1000, 
            backgroundColor: 'white', 
            padding: '10px', 
            borderRadius: '8px'
          }}>
            <h4>Parks within Radius ({sliderValue} miles):</h4>
            <ul>
                {filteredParks.map(park => (
                    <li key={park.id}>{park.name} - {Math.round(park.distance / 1609.34)} miles away</li>
                ))}
            </ul>
            </div>
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '50px',
                zIndex: 1000,
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '8px'
            }}>

            <Slider 
              value={sliderValue} 
              onChange={handleSliderChange} // Add event listener to log changes
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