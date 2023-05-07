import * as React from 'react';
import styled from '@emotion/styled';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { ReactComponent as OnePerson } from '../images/icon-1person.svg';

/* 
    value="value or name of option"
    label="displayed name of option"
*/
const RadioButtonGroup = ({ title, entries, row, setValue, value }) => {
  //const [value, setValue] = React.useState('female');
  const debug = 1;

  const handleChange = (event) => {
    if (debug > 0) console.log('RadioButtonGroup/handleChange: ', event);
    setValue(event.target.value);
  };

  const CustLabel = () => {
    return;
  };

  if (debug > 0) console.log('RadioButtonGroup: ', title, entries);

  return (
    <FormControl>
      <FormLabel id="controlled-radio-button-group">{title}</FormLabel>
      <RadioGroup
        row={row}
        aria-labelledby="controlled-radio-button-group"
        name="controlled-radio-button-group"
        value={value}
        onChange={handleChange}
      >
        {entries?.map((entry, i) => {
          return (
            <FormControlLabel
              sx={{ marginRight: '64px' }}
              value={entry.value}
              control={<Radio />}
              label={React.createElement(entry.label)}
              key={i}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;

const FormControlLabelRBG = styled(FormControlLabel)`
  margin-right: 64px;
`;
