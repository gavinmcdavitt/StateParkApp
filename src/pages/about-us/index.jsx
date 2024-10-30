import './index.css';

export const AboutUs = () => {
    return (
        <><div class="navbar">
            <img src="/Arrowhead.png" alt="Logo" className="navbar-logo" />
            <a href="/">Home</a>
            <a class="active" href="#about-us">About</a>
            <a href="map">Map</a>
            <a href="sign-up">Sign Up</a>
        </div><header className="app-header">
        <div className="about-us-container">
            <h1>About Us</h1>
            <div className="names">
                <h2>Gavin McDavitt, Marshall Brady, Conner Murphy</h2>
            </div>
            <p>
                The purpose of this app is to address a challenge I often face while enjoying my favorite state parks.
                Imagine driving hours to reach a beautiful spring in a Florida state park, only to be greeted by a long line of cars.
                Wouldn’t it be nice to know ahead of time if the park was overcrowded or closed? This app lets you RSVP and receive
                real-time updates, so you can make informed choices and explore other nearby spots if needed. If this sounds like 
                a solution you’d find helpful, then this app is made for you!
            </p>
        </div>
        <button onClick={() => window.location.href = '/'}>Return to Home</button>
    </header></>);
};
