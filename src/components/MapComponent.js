// src/MapComponent.js
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import './MapComponent.css'; // Optional for styling

export const MapComponent = () => {
    const mapRef = useRef(null); // Create a ref to store the map instance

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
            L.marker(userLocation).addTo(mapRef.current)
              .bindPopup('You are here!').openPopup();
        });

        // Handle location errors
        mapRef.current.on('locationerror', () => {
            alert('Location access denied.');
        });

        // Cleanup on unmount: remove the map instance
        return () => {
            if (mapRef.current !== null) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return <div id="map" style={{ height: '600px', width: '100%' }}></div>;
};


export default MapComponent;
