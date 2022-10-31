import * as React from 'react';
import styled from '@emotion/styled';
import { ReactComponent as ArrowDown } from '../images/icon-chevron-down.svg';
import { ReactComponent as ArrowUp } from '../images/icon-chevron-up.svg';
import { ReactComponent as ArrowRight } from '../images/icon-chevron-right.svg';
import { ReactComponent as ArrowLeft } from '../images/icon-chevron-left.svg';

const MoveTool = ({ className, colors, setDeltaX, setDeltaY }) => {
  return (
    <MoveToolMain
      colors={colors}
      className={className + ' move-tool-main d-flex flex-row justify-content-center align-items-center'}
    >
      <div className="move-tool-bg d-flex flex-row flex-wrap">
        <div className="btn-bg left"></div>
        <div className="btn-bg up"></div>
        <div className="btn-bg right"></div>
        <div className="btn-bg down"></div>
      </div>
      <div className="move-tool-fg d-flex flex-row flex-wrap ">
        <div
          className="btn-fg d-flex flex-row justify-content-center align-items-center"
          onClick={() => setDeltaX(-1)}
        >
          <ArrowLeft />
        </div>
        <div
          className="btn-fg d-flex flex-row justify-content-center align-items-center"
          onClick={() => setDeltaY(1)}
        >
          <ArrowUp />
        </div>
        <div
          className="btn-fg d-flex flex-row justify-content-center align-items-center"
          onClick={() => setDeltaY(-1)}
        >
          <ArrowDown />
        </div>
        <div
          className="btn-fg d-flex flex-row justify-content-center align-items-center"
          onClick={() => setDeltaX(1)}
        >
          <ArrowRight />
        </div>
      </div>
    </MoveToolMain>
  );
};

export default MoveTool;

const MoveToolMain = styled.div`
  position: relative;
  width: 48px;
  height: 48px;

  .move-tool-bg {
    height: 30px;
    width: 30px;
    position: absolute;
    transform: rotate(45deg);

    .btn-bg {
      background-color: ${({ colors }) => colors.LightGrey};
      height: 15px;
      width: 15px;
    }
  }

  .move-tool-fg {
    transform: rotate(45deg);
    height: 40px;
    width: 40px;
    position: absolute;

    .btn-fg {
      height: 20px;
      width: 20px;
      transform: rotate(45deg);

      &:hover {
        background-color: ${({ colors }) => colors.PurpleGrey};
      }
    }
  }
`;
