import React from 'react';
import './index.css';
import Carousel from 'react-bootstrap/Carousel';
import { CreatedComboBox} from '../../components/comboBox' 
import { useState } from 'react';
import { UserInfoPopUp } from '../../components/UserPopUp/UserInfoPopUp';


export const Home = () => {
    const [popupVisible, setPopupVisible] = useState(false);

    const togglePopup = () => {
        setPopupVisible((prev) => !prev);
    };

    return (
        <>
            <div className="navbar">
                <img src="/Arrowhead.png" alt="Logo" className="navbar-logo" />
                <a className="active" href="#home">Home</a>
                <a href="about-us">About</a>
                <a href="map">Map</a>
                <a href="sign-up">Sign Up</a>
                <a href="reservation">Reservation</a>

                <img
                    src="/profile.png"
                    alt="Profile"
                    className="navbar-logo"
                    onClick={togglePopup}
                    style={{ cursor: 'pointer' }}
                />
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
                <CreatedComboBox />
            </header>
            <UserInfoPopUp isVisible={popupVisible} onClose={togglePopup} />

        </>
    );
};

export default Home;
