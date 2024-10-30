import React, { useState } from 'react';
import './index.css';
import Carousel from 'react-bootstrap/Carousel';

function ParkSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [parks, setParks] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`https://api.nps.gov/api/v1/parks?api_key=SZXsJ6bjFFiCX3uhCGG7RueLkdhbA9wUPscascne&q=${searchTerm}`);
            const data = await response.json();
            setParks(data.data); // Assuming API response has a `data` field
        } catch (error) {
            console.error("Error fetching parks data:", error);
        }
    };

    return (
        <div className="search">
            <input 
                type="text" 
                placeholder="Search parks..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <img src="/search.svg" alt="Search Icon" onClick={handleSearch} />
            <div className="parks-list">
                {parks.map(park => (
                    <div key={park.id}>{park.fullName}</div>
                ))}
            </div>
        </div>
    );
}

export const Home = () => {
    return (
        <>
            <div className="navbar">
                <img src="/Arrowhead.png" alt="Logo" className="navbar-logo" />
                <a className="active" href="#home">Home</a>
                <a href="about-us">About</a>
                <a href="map">Map</a>
                <a href="sign-up">Sign Up</a>
            </div>
            <header className="App-header">
                <h1>Welcome to Our Park Finder</h1>
                <img src="/Arrowhead.png" alt="State Park Logo" className="small-logo" />
                <Carousel fade>
                    <Carousel.Item>
                        <img src="/Park1.jpg" alt="First slide" />
                        <Carousel.Caption><p>.</p></Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src="/Park2.jpg" alt="Second slide" />
                        <Carousel.Caption><p>.</p></Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src="/Park3.jpg" alt="Third slide" />
                        <Carousel.Caption><p>.</p></Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src="/Park4.jpg" alt="Fourth slide" />
                        <Carousel.Caption><p>.</p></Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
                <ParkSearch />
            </header>
        </>
    );
};

export default Home;
