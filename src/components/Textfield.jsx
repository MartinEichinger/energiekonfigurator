import * as React from 'react';
import styled from '@emotion/styled';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Textfield = ({ className, colors, title, placeholder, onChange, value }) => {
  return (
    <TextfieldMain colors={colors} className={className}>
      <label htmlFor="textfield">{title}</label>

      <input
        type="text"
        id="textfield"
        name="textfield"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></input>
    </TextfieldMain>
  );
};

export default Textfield;

const TextfieldMain = styled.div`
  width: 100%;

  label {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    color: ${({ colors }) => colors.medium_grey};
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 8px 16px;
    border-radius: 4px;

    font-size: 13px;
    font-weight: 500;
    line-height: 23px;

    cursor: auto;

    border: 1px solid ${({ colors }) => colors.medium_grey25};

    &:focus-visible {
      outline: none;
      //border: 1px solid ${({ colors }) => colors.medium_grey25};
    }
  }
`;
