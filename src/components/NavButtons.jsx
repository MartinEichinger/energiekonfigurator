import styled from '@emotion/styled';
import { ReactComponent as ArrowDownGrey } from '../images/arrow-down-grey.svg';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const NavButtons = ({ setConfigStatus, configStatus, startCalc }) => {
  // global weatherData
  let loadingWeatherData = useAppSelector((state) => state.weatherData.loadingWeatherData);

  return (
    <ButtonsMain className="d-flex flex-column align-items-center">
      <button className="btn large mb-2 sandyBrown" onClick={() => setConfigStatus(0)}>
        Objektart auswählen
      </button>
      <ArrowDownGrey />
      <button
        className="btn large mb-2 mt-2 dirtyPurple"
        onClick={() => setConfigStatus(1)}
        disabled={!(configStatus === 1)}
      >
        Anlagestandort auswählen
      </button>
      <ArrowDownGrey />
      <button
        className="btn large mb-2 mt-2 dirtyPurple"
        onClick={() => setConfigStatus(2)}
        disabled={!(configStatus === 2)}
      >
        Karte ausrichten
      </button>
      <ArrowDownGrey />
      <button
        className="btn large mb-2 mt-2 dirtyPurple"
        onClick={() => setConfigStatus(3)}
        disabled={
          !(configStatus === 3 || configStatus === 4 || configStatus === 5 || configStatus === 6)
        }
      >
        Solarfläche festlegen
      </button>
      <ArrowDownGrey />
      <button
        className="btn large mb-2 mt-2 dirtyPurple"
        onClick={() => setConfigStatus(6)}
        disabled={!(configStatus === 6)}
      >
        Sperrflächen festlegen
      </button>
      <ArrowDownGrey />
      <button
        className="btn large mb-2 mt-2 dirtyGreen"
        onClick={() => startCalc()}
        disabled={!(configStatus === 6) || loadingWeatherData === true}
      >
        PV Ertrag berechnen
      </button>
    </ButtonsMain>
  );
};

export default NavButtons;

const ButtonsMain = styled.div`
  margin-right: 32px;
`;
