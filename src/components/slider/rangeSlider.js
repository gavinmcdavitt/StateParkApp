import React, { useState, useEffect } from 'react';
import './rangeSlider.css'; 

export const Slider = ({ value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value || 50); // Initialize with the default value or prop value

  useEffect(() => {
    // Update sliderValue when value prop changes
    setSliderValue(value);
  }, [value]);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value); // Update local state
    onChange(event.target.value); // Update the parent component with new value
  };

  return (
    <div className="slidecontainer">
      <input
        type="range"
        min="1"
        max="1000"
        value={sliderValue} // Use sliderValue for the input value
        className="slider"
        id="myRange"
        onChange={handleSliderChange} // Update state on change
      />
      <p id="demo">{sliderValue}</p> {/* Display the current value */}
    </div>
  );
};

export default Slider;
