import { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}°C`;
}

const NormalSlider = ({ stop, start = 0, step, value, onChange }) => {
  //const [value, setValue] = useState([20, 37]);
  console.log('NormalSlider: ', start, stop);
  const debug = 1;

  const marks = Array.from({ length: (stop - start) / step + 1 }, (_, i) => {
    return { value: start + (i * step * 100) / stop, label: start + i * step };
  });

  const handleChange = (event) => {
    if (debug > 0) console.log('Slider/handleChange: ', event);
    onChange(event.target.value);
  };

  const valueLabelFormat = (value) => {
    console.log('valueLabelFormat: ', value);
    return (stop / 100) * value;
  };

  console.log('NormalSlider: ', marks);
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label="Custom marks"
        value={(value * 100) / stop}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        step={100 / stop}
        valueLabelDisplay="auto"
        marks={marks}
        onChange={handleChange}
      />
    </Box>
  );
};

export default NormalSlider;
