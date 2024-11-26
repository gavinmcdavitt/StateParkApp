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
    iconSize:     [29, 71],
    shadowSize:   [38, 48],
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
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        // //This looks like apple maps.
        // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        //     attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        //     maxZoom: 18,
        // }).addTo(mapRef.current);

        L.tileLayer('https://earthdata.nasa.gov/earthdata/datasets/black-marble', {
            attribution: '&copy; <a href="https://earthobservatory.nasa.gov/global-maps/VIIRS_DNB_TrueColor">NASA</a>',
            maxZoom: 8, // Adjust this based on the available zoom levels for the layer
        }).addTo(mapRef.current);

        // Locate the user
        mapRef.current.locate({ setView: true, maxZoom: 18 });

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
    }, []);

    return <div id="map" style={{ height: '600px', width: '100%' }}></div>;
};


export default MapComponent;
