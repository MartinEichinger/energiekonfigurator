import { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}°C`;
}

//const minDistance = 10;

const MinimumDistanceSlider = ({ minMaxValSlider, setMinMaxValSlider, maxValue, minDistance }) => {
  //const [value, setValue] = useState([20, 37]);

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], maxValue - minDistance);
        setMinMaxValSlider([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setMinMaxValSlider([clamped - minDistance, clamped]);
      }
    } else {
      setMinMaxValSlider(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Slider
        getAriaLabel={() => 'Minimum distance shift'}
        value={minMaxValSlider}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        max={maxValue}
        disableSwap
      />
    </Box>
  );
};

export default MinimumDistanceSlider;
