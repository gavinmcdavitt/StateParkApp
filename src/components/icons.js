import L from 'leaflet';
// Define custom icons

export const closedPark = L.icon({
    iconUrl: 'leaf-red.png', // Replace with the correct path to your custom icon
    
    iconSize: [38, 95],
    
    iconAnchor: [22, 94],
    
    popupAnchor: [-3, -76]
});

export const halwayOpenPark = L.icon({
    iconUrl: 'leaf-orange.png', // Replace with the correct path to your custom icon
    
    iconSize: [38, 95],
    
    iconAnchor: [22, 94],
   
    popupAnchor: [-3, -76]
});

export const openPark = L.icon({
    iconUrl: 'leaf-green.png', // Replace with the correct path to your custom icon
    
    iconSize: [29, 71],
    
    iconAnchor: [22, 94],
    
    popupAnchor: [-3, -76]
});


export const Personal = L.icon({
    iconUrl: 'profile.png', // Replace with the correct path to your custom icon
    iconSize: [45, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});
export const customIcon = L.icon({
    iconUrl: 'leaf-red.png', // Replace with the correct path to your custom icon
    
    iconSize: [38, 95],
    
    iconAnchor: [22, 94],
    
    popupAnchor: [-3, -76]
});

export const shadowOnlyFlowerIcon =L.icon({
    iconUrl: 'leaf-shadow.png', // Replace with the correct path to your custom icon
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

export const personalIcon = L.icon({
    iconUrl: 'leaf-green.png', // Replace with the correct path to your custom icon
    
    iconSize: [29, 71],
    
    iconAnchor: [22, 94],
    
    popupAnchor: [-3, -76]
});
export const spotlightIcon = L.icon({
    iconUrl: 'spotlight.png', // Replace with appropriate spotlight icon
    
    iconSize: [45, 95], // Slightly larger to make it stand out
    
    iconAnchor: [22, 94],
    
    popupAnchor: [-3, -76]
});