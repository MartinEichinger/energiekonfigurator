import * as React from 'react';
import styled from '@emotion/styled';
import { useState } from 'react';
//import pointer from './images/pointer.png';

const Dropdown = ({ className, colors, title, text, entries, changeDropdown }) => {
  const [boxChecked, setBoxChecked] = useState(false);
  const debug = 1;

  const selectDropdown = (option) => {
    if (debug > 0) console.log('Dropdown: ', option);
    changeDropdown(option);
  };

  return (
    <DropdownMain
      colors={colors}
      className={className + ' d-flex flex-column justify-content-start align-items-start'}
    >
      <label htmlFor="dropdown">{title}</label>

      <select
        id="dropdown"
        name="Dropdown"
        value={text}
        onChange={(e) => selectDropdown(e.target.value)}
      >
        {entries?.map((entry, i) => {
          return (
            <option value={entry.name} key={i}>
              {entry.name}
            </option>
          );
        })}
      </select>
    </DropdownMain>
  );
};

export default Dropdown;

const DropdownMain = styled.div`
  label {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    color: ${({ colors }) => colors?.medium_grey};
    margin-bottom: 8px;
  }

  select {
    width: 100%;
    padding: 8px 16px;
    border-radius: 4px;

    font-size: 13px;
    font-weight: 500;
    line-height: 23px;

    &:active,
    &:hover,
    &:focus-visible {
      border: 1px solid ${({ colors }) => colors?.main_purple};
      outline: none;
    }
  }
`;

/* 
selected={entry.name === text} 
*/
