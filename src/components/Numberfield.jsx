import * as React from 'react';
import styled from '@emotion/styled';
import { ReactComponent as ArrowDown } from '../images/icon-chevron-down.svg';
import { ReactComponent as ArrowUp } from '../images/icon-chevron-up.svg';

const Numberfield = ({ className, colors, title, placeholder, onChange, value, min, max }) => {
  return (
    <NumberfieldMain colors={colors} className={className}>
      {title !== undefined && <label htmlFor="textfield">{title}</label>}

      <div className="number-input d-flex flex-column align-items-end">
        <input
          type="number"
          id="numberfield"
          name="numberfield"
          placeholder={placeholder}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
        />
        <div className="arrows d-flex flex-column">
          <div
            className="arrow-bg up d-flex flex-column justify-content-center"
            onClick={() => value !== max && onChange('up')}
          >
            <ArrowUp />
          </div>
          <div
            className="arrow-bg down d-flex flex-column justify-content-center"
            onClick={() => value !== min && onChange('down')}
          >
            <ArrowDown />
          </div>
        </div>
      </div>
    </NumberfieldMain>
  );
};

export default Numberfield;

const NumberfieldMain = styled.div`
  width: 100%;

  input[type='number'] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  label {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    color: ${({ colors }) => colors.PurpleGrey};
    margin-bottom: 8px;
  }

  .number-input {
    position: relative;

    .arrows {
      position: absolute;
      height: 100%;

      .arrow-bg {
        cursor: pointer;
        height: 50%;
        padding: 0px 15px;

        &.up {
          border-radius: 0px 12px 0px 0px;
        }

        &:hover {
          background-color: ${({ colors }) => colors.LightGrey};
        }
      }
    }

    input {
      width: 100%;
      padding: 8px 16px;
      border-radius: 12px 12px 0px 12px;

      font-size: 13px;
      font-weight: 500;
      line-height: 23px;

      cursor: auto;

      border: 1px solid ${({ colors }) => colors.PurpleGrey};

      &:focus-visible {
        outline: none;
        //border: 1px solid ${({ colors }) => colors.PurpleGrey};
      }
    }
  }
`;
