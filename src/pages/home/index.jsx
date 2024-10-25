import React from 'react';
import './index.css';
import SearchIcon from './search.svg';
import StateParkLogo from './Arrowhead.png';



export const Home = () => {
    return (
        <header className="App-header">
        
            <h1>Welcome to Our Park Finder</h1>
            <img src={StateParkLogo} alt="logo" />

            <div className="search">
                <input type="text" placeholder="Search parks..." />
                <img src="SearchIcon" alt="Search Icon" />
            </div>
        </header>
    );
};
