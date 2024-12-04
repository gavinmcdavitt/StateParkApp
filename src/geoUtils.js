// src/utils/geoUtils.js
import { getDistance } from 'geolib';

export const isWithinRadius = (park, center, radius) => {
    return getDistance(
        { latitude: center.lat, longitude: center.lng },
        { latitude: park.latitude, longitude: park.longitude }
    ) <= radius;
};

export const filterParksWithinRadius = (parks, center, radius) => {
    return parks.filter(park => isWithinRadius(park, center, radius));
};
