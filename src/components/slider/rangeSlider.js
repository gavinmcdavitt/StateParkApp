import React, { useState } from 'react';
import './rangeSlider.css'; 

export const Slider = () => {
  const [sliderValue, setSliderValue] = useState(50); // Initialize with the default value

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value); // Update slider value on change
  };

  return (
    <div className="slidecontainer">
      <input
        type="range"
        min="10"
        max="1000"
        value={sliderValue}
        className="slider"
        id="myRange"
        onChange={handleSliderChange}
      />
      <p id="demo">{sliderValue}</p> {/* Display the current value */}
    </div>
  );
};

export default Slider;
