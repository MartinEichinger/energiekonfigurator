import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import Checkbox from './Checkbox';
import Slider from './NormalSlider';
import Numberfield from './Numberfield';
import { setPowerStorageSize, setUsePowerStorage } from '../store/powerStorageSlices';
import { calcAllocConsumpFeed } from '../store/currentProfilSlices';

function PowerStorage({ colors }) {
  const dispatch = useAppDispatch();
  var valPowerStorage = useAppSelector((state) => state.powerStorageData.sizePowerStorage);
  var usePowerStorage = useAppSelector((state) => state.powerStorageData.usePowerStorage);

  useEffect(() => {}, []);

  return (
    <PowerStorageMain colors={colors}>
      <PowerStorageSelect colors={colors}>
        <h2>Stromspeicher</h2>
        <div className="d-flex flex-row align-items-center">
          <h3>Mit Stromspeicher</h3>
          <Checkbox
            colors={colors}
            checked={usePowerStorage}
            onChange={(e) => dispatch(setUsePowerStorage(e))}
          />
        </div>
      </PowerStorageSelect>
      <StorageSize colors={colors}>
        <h2>Speichergröße</h2>
        <div className="storage-size d-flex flex-row align-items-center">
          <NumberfieldPS
            colors={colors}
            onChange={(e) =>
              e === 'up'
                ? dispatch(setPowerStorageSize({ sizePowerStorage: valPowerStorage + 1 }))
                : e === 'down'
                ? dispatch(setPowerStorageSize({ sizePowerStorage: valPowerStorage - 1 }))
                : dispatch(setPowerStorageSize({ sizePowerStorage: e }))
            }
            value={valPowerStorage}
            min={0}
            max={50}
            unit={'kWh'}
          />
          <Slider
            stop={50}
            step={5}
            onChange={(e) =>
              e === 'up'
                ? dispatch(setPowerStorageSize({ sizePowerStorage: valPowerStorage + 1 }))
                : e === 'down'
                ? dispatch(setPowerStorageSize({ sizePowerStorage: valPowerStorage - 1 }))
                : dispatch(setPowerStorageSize({ sizePowerStorage: e }))
            }
            value={valPowerStorage}
          />
        </div>
      </StorageSize>
      <div className="calc-current-profil d-flex flex-row align-items-center mt-5">
        <button
          className="btn large dirtyGreen"
          onClick={() => {
            dispatch(calcAllocConsumpFeed());
          }}
          disabled={!usePowerStorage}
        >
          Stromprofil berechnen
        </button>
      </div>
    </PowerStorageMain>
  );
}

export { PowerStorage };

const PowerStorageMain = styled.div`
  margin-top: 56px;
  margin-left: 96px;
`;

const PowerStorageSelect = styled.div`
  h2 {
    color: ${({ colors }) => colors.PurpleGrey};
    margin-bottom: 24px !important;
  }
  h3 {
    color: ${({ colors }) => colors.SandyBrown};
  }
`;

const StorageSize = styled.div`
  margin-top: 56px;

  h2 {
    color: ${({ colors }) => colors.PurpleGrey};
    margin-bottom: 24px !important;
  }
`;

const NumberfieldPS = styled(Numberfield)`
  width: 175px;
  margin-right: 32px;
`;
