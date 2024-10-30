// src/MapComponent.js
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import './MapComponent.css'; // Optional for styling

const customIcon = L.icon({
    iconUrl: 'leaf-red.png', // Replace with the path to your custom icon
    shadowUrl: 'leaf-shadow.png',
    iconSize:     [38, 95],
    shadowSize:   [50, 64],
    iconAnchor:   [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor:  [-3, -76]
});
const PersonalIcon = L.icon({
    iconUrl: 'leaf-green.png', // Replace with the path to your custom icon
    shadowUrl: 'leaf-shadow.png',
    iconSize:     [38, 95],
    shadowSize:   [50, 64],
    iconAnchor:   [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor:  [-3, -76]
});
export const MapComponent = () => {
    const mapRef = useRef(null); // Create a ref to store the map instance
     // Function to add a marker to the map
     const addMarker = (latitude, longitude, popupText = '') => {
        if (mapRef.current) {
            const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapRef.current);
            if (popupText) {
                marker.bindPopup(popupText).openPopup();
            }
        }
    };

    

    useEffect(() => {
        if (mapRef.current !== null) {
            // If map instance already exists, don't initialize again
            return;
        }
        // Initialize the map and set the ref to the map instance
        mapRef.current = L.map('map').setView([51.505, -0.09], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        // Locate the user
        mapRef.current.locate({ setView: true, maxZoom: 16 });

        // When location is found, add a marker
        mapRef.current.on('locationfound', (e) => {
            const userLocation = e.latlng;
            L.marker(userLocation, { icon: PersonalIcon } ).addTo(mapRef.current)
              .bindPopup('You are here!').openPopup();
        });

        // Handle location errors
        mapRef.current.on('locationerror', () => {
            alert('Location access denied.');
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

    return <div id="map" style={{ height: '800px', width: '100%' }}></div>;
    
    

    
};


export default MapComponent;
