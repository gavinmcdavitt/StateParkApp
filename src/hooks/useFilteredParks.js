import { useState, useEffect } from 'react';
import { getDistance } from 'geolib';

const useFilteredParks = (parks, center, radius) => {
    const [filteredParks, setFilteredParks] = useState([]);

       useEffect(() => {
           setFilteredParks(parks.filter(park => getDistance(
               {latitude: center.lat, longitude: center.lng},
               {latitude: park.latitude, longitude: park.longitude}
           ) <= radius));
       }, [parks, center, radius]);

       return filteredParks;
   };

export default useFilteredParks;