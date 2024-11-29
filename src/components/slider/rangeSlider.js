import React, { useState } from 'react';
import './rangeSlider.css'; 

export const Slider = ({value, onChange}) => {
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
        value={value}
        className="slider"
        id="myRange"
        onChange={onChange}
      />
      <p id="demo">{value}</p> {/* Display the current value */}
    </div>
  );
};

export default Slider;
