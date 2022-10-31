import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setRoofType } from '../store/objectSlices';
import { ReactComponent as Schraegdach } from '../images/schraegdach.svg';
import { ReactComponent as Flachdach } from '../images/flachdach.svg';
import { ReactComponent as Freiflaeche } from '../images/freiflaeche.svg';

const Objects = ({ colors, setConfigStatus }) => {
  const dispatch = useAppDispatch();

  // global objectData
  let roofType = useAppSelector((state) => state.objectData.roofType);

  return (
    <ObjectsBody colors={colors}>
      <div className="innerbox d-flex flex-column justify-content-around align-items-center">
        <div className="d-flex flex-row flex-wrap align-items-end justify-content-center">
          <div
            className={
              roofType === 'Schrägdach'
                ? 'frame active d-flex flex-column justify-content-end align-items-center'
                : 'frame d-flex flex-column justify-content-end align-items-center'
            }
            onClick={() => {
              setConfigStatus(1);
              dispatch(setRoofType('Schrägdach'));
            }}
          >
            <Schraegdach />
            <p>Schrägdach</p>
          </div>
          <div
            className={
              roofType === 'Flachdach'
                ? 'frame active d-flex flex-column justify-content-end align-items-center'
                : 'frame d-flex flex-column justify-content-end align-items-center'
            }
            onClick={() => {
              setConfigStatus(1);
              dispatch(setRoofType('Flachdach'));
            }}
          >
            <Flachdach />
            <p>Flachdach</p>
          </div>
          <div
            className={
              roofType === 'Freifläche'
                ? 'frame active d-flex flex-column justify-content-end align-items-center'
                : 'frame d-flex flex-column justify-content-end align-items-center'
            }
            onClick={() => {
              setConfigStatus(1);
              dispatch(setRoofType('Freifläche'));
            }}
          >
            <Freiflaeche />
            <p>Freifläche</p>
          </div>
        </div>
      </div>
    </ObjectsBody>
  );
};

export default Objects;

const ObjectsBody = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 15px 15px 0px 15px;

  border: 2px solid ${({ colors }) => colors.DirtyPurple};

  .innerbox {
    height: inherit;

    .frame {
      margin: 50px 50px 25px;
      padding: 10px;
      width: 125px;
      height: 125px;
      border: 2px solid ${({ colors }) => colors.DirtyPurple};
      border-radius: 8px;
      cursor: pointer;

      &:hover,
      &.active {
        background-color: ${({ colors }) => colors.DirtyPurple50};
      }

      p {
        margin: 0px;
      }
    }
  }
`;
