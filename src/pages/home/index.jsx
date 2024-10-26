import React from 'react';
import './index.css';
import Carousel from 'react-bootstrap/Carousel';
import Image1 from './components/Park2.jpg';
import Image2 from './components/Park2.jpg';
import Image3 from './components/Park3.jpg';
import Image4 from './components/Park4.jpg';
import SearchIcon from './search.svg';
import StateParkLogo from './Arrowhead.png';
export const Home = () => {

    return (
        <><div class="topnav">
            <a class="active" href="#home">Home</a>
            <a href="about-us">About</a>
            <a href="map">Map</a>
            <a href="sign-up">Sign Up</a>
        </div><header className="App-header">
                <h1>Welcome to Our Park Finder</h1>
                <img src={StateParkLogo} alt="State Park Logo" className="small-logo" />
                <Carousel fade>
                    <Carousel.Item>
                        <img src={Image1} alt="First slide" />
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={Image2} alt="Second slide" />
                        <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={Image3} alt="Third slide" />
                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={Image4} alt="Fourth slide" />
                        <Carousel.Caption>
                            <h3>Fourth slide label</h3>
                            <p>.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
                <div className="search">
                    <input type="text" placeholder="Search parks..." />
                    <img src={SearchIcon} alt="Search Icon" />
                </div>
            </header></>
    );
};