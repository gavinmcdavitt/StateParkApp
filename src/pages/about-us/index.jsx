import './index.css';

export const AboutUs = () => {
    return (
        <header className="app-header">

        <div className="about-us-container">
            <h1>About Us</h1>
            <div className="names">
                <h2>Gavin McDavitt</h2>
                <h2>Marshall Brady</h2>
                <h2>Conner Murphy</h2>
            </div>
            <p>
                The purpose of this app is to address a challenge I often face while enjoying my favorite state parks.
                Imagine driving hours to reach a beautiful spring in a Florida state park, only to be greeted by a long line of cars.
                Wouldn’t it be nice to know ahead of time if the park was overcrowded or closed? This app lets you RSVP and receive
                real-time updates, so you can make informed choices and explore other nearby spots if needed. If this sounds like 
                a solution you’d find helpful, then this app is made for you!
            </p>
        </div>
        </header>
    );
};
