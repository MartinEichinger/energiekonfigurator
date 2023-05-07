import * as React from 'react';
import styled from '@emotion/styled';
import { useState } from 'react';
//import pointer from './images/pointer.png';

const Checkbox = ({ className, colors, text, checked, onChange }) => {
  const debug = 1;

  const handleChange = (event) => {
    if (debug > 0) console.log('Checkbox/handleChange: ', event);
    onChange(event);
  };

  return (
    <CheckboxMain
      colors={colors}
      className={'d-flex flex-row justify-content-start align-items-center ' + className}
      onClick={() => {
        checked ? handleChange(false) : handleChange(true);
      }}
    >
      <input
        className="checkbox"
        type="checkbox"
        checked={checked}
        aria-label="Checkbox for following text"
        onChange={() => {
          checked ? handleChange(false) : handleChange(true);
        }}
      />
      <p className={checked ? 'bold checked' : 'bold'}>{text}</p>
    </CheckboxMain>
  );
};

export default Checkbox;

const CheckboxMain = styled.div`
  //background-color: ${({ colors }) => colors.DirtyPurple};
  border-radius: 4px;
  padding: 13px 16px;

  &:hover {
    background-color: ${({ colors }) => colors.DirtyPurple50};
  }

  input[type='checkbox'] {
    height: 16px;
    width: 16px;

    accent-color: ${({ colors }) => colors.PurpleGrey};
  }

  p {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    color: ${({ colors }) => colors.LightBlack};
    margin: 0px 0px 0px 16px;

    &.checked {
      color: ${({ colors }) => colors.PurpleGrey};
      text-decoration: line-through;
    }
  }
`;
