// // src/MapComponent.js
import React, { useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getObjects } from '../components/readDatabase'; // Adjust path as needed
import {Slider} from '../components/slider/rangeSlider';

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
   // const listOfMarkers= [];

    const addMarkerStatePark = (latitude, longitude, popupText = '') => {
        console.log('Adding state park marker at', latitude, longitude);  // Log to check if this function is called
        if (mapRef.current) {
            const marker = L.marker([latitude,longitude ], { icon: stateParkIcon }).addTo(mapRef.current);
            if (popupText) {
                marker.bindPopup(popupText);
            }
        //istOfMarkers.add(marker);
        }
    };
    // Function to add a marker to the map with specified icon and popup
    const addMarker = (latitude, longitude, popupText = '', icon = customIcon) => {
        console.log('Adding marker at', latitude, longitude);  // Log to check coordinates
        if (mapRef.current) {
            const marker = L.marker([latitude, longitude], { icon }).addTo(mapRef.current);
            if (popupText) {
                marker.bindPopup(popupText);
            }
        }
    };
     // Function to handle slider value change
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
    console.log('Slider value changed:', event.target.value); // Log value change'
  };

    useEffect(() => {
        if (mapRef.current) return; // Prevent map reinitialization

        // Initialize the map and set the ref to the map instance
        mapRef.current = L.map('map').setView([51.505, -0.09], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        // Locate the user
        mapRef.current.locate({ setView: true, maxZoom: 18 });

        // When location is found, add a marker
        mapRef.current.on('locationfound', (e) => {
            addMarker(e.latlng.lat, e.latlng.lng, 'You are here!', personalIcon);
        });

        // Handle location errors
        mapRef.current.on('locationerror', () => {
            alert('Location access denied.');
        });

        // Fetch objects with latitude and longitude
        getObjects((objects) => {
            console.log('Fetched objects:', objects);  // Check if the data has latitude and longitude
            objects.forEach(obj => {
                console.log('Latitude:', obj.latitude, 'Longitude:', obj.longitude);  // Log each lat/long
                if (obj.latitude && obj.longitude) {

                    addMarkerStatePark(obj.latitude, obj.longitude, `<strong>${obj.name}</strong><br />County: ${obj.county}<br />Size: ${obj.size}`);
                }
            });
        });
        


        


            //first let's make a call to grab the data.
    fetch('https://developer.nps.gov/api/v1/parks?stateCode=&limit=100&api_key=SZXsJ6bjFFiCX3uhCGG7RueLkdhbA9wUPscascne',{
        method : 'GET',
        headers:{
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())  // Convert the response to JSON
    .then(data => {
        console.log('Received data:', JSON.stringify(data, null, 2));
        
        // Access the first item in the 'data' array
        if (data.data && data.data.length > 0) {
            data.data.forEach(park => {
                const latitude = park.latitude; // Get latitude
                const longitude = park.longitude; // Get longitude

                // Log the latitude and longitude for each park
                console.log(`Park: ${park.fullName}, Latitude: ${latitude}, Longitude: ${longitude}`);
                addMarker(latitude, longitude, park.fullName);

                //
            });
        } else {
            console.error('No park data found in the response.');
        }
    })
    .catch(error => console.error('Error:', error));  // Handle errors



        // Cleanup on unmount: remove the map instance
        return () => {
            if (mapRef.current !== null) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative' }}>
          {/* Map container */}
          <div id="map" style={{ height: '600px', width: '100%' }}></div>
    
          {/* Slider container with absolute positioning to appear on top of the map */}
          <div style={{
            position: 'absolute', 
            top: '20px', 
            left: '20px', 
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
        </div>
      );
    
    };
export default MapComponent;