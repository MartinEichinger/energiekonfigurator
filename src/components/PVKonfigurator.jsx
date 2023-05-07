import { useEffect } from 'react';
import styled from '@emotion/styled';
import NavButtons from './NavButtons';
import Map from './Map';
import Objects from './Objects';
import Numberfield from './Numberfield';
import { useLoadScript } from '@react-google-maps/api';
import { ReactComponent as TypeIcon } from '../images/icon-type.svg';
import { ReactComponent as SlopeIcon } from '../images/icon-slope.svg';
import { ReactComponent as AreaIcon } from '../images/icon-area.svg';
import { ReactComponent as NoPanelsIcon } from '../images/icon-no-panels.svg';
import { ReactComponent as DirectionIcon } from '../images/icon-direction.svg';
import { ReactComponent as PowerIcon } from '../images/icon-power.svg';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getWeatherData } from '../store/weatherSlices';
import { getCurrentProfilData } from '../store/currentProfilSlices';
import { setPanelNo } from '../store/objectSlices';

const libraries = ['places', 'drawing'];

const PVKonfigurator = ({
  colors,
  configStatus,
  setConfigStatus,
  maps,
  setMaps,
  plz,
  setPlz,
  deltaX,
  setDeltaX,
  deltaY,
  setDeltaY,
  currPoly,
  setCurrPoly,
  middlePoints,
  setMiddlePoints,
}) => {
  const debug = 5;
  const dispatch = useAppDispatch();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // global pvModuleData
  let modulePower = useAppSelector((state) => state.pvModuleData.modulePower);
  let moduleHeight = useAppSelector((state) => state.pvModuleData.moduleHeight);
  let moduleWidth = useAppSelector((state) => state.pvModuleData.moduleWidth);
  // global objectData
  let roofType = useAppSelector((state) => state.objectData.roofType);
  let slope = useAppSelector((state) => state.objectData.slope);
  let panelNo = useAppSelector((state) => state.objectData.panelNo);
  let roofDirect = useAppSelector((state) => state.objectData.azimuth);
  let compass = useAppSelector((state) => state.objectData.compass);
  let lat = useAppSelector((state) => state.objectData.lat);
  let lng = useAppSelector((state) => state.objectData.lng);

  let panelArea = Math.round(moduleHeight * moduleWidth * panelNo);

  useEffect(() => {
    if (debug > 3) console.log('PV Konfigurator/ useEffect');
    if (configStatus === 4 || configStatus === 5) setConfigStatus(3);
  }, []);

  const startCalc = () => {
    console.log('Start Calculation', roofDirect, slope, lat, lng);
    var formData = {
      peakpower: (modulePower * panelNo) / 1000,
      aspect: roofDirect,
      angle: slope,
      lat: lat,
      lng: lng,
    };
    dispatch(getWeatherData(formData));
    dispatch(getCurrentProfilData());
  };

  if (debug > 3) console.log('PV Konfigurator: ', configStatus, lat);
  var boolShowMap =
    configStatus === 1 ||
    configStatus === 2 ||
    configStatus === 3 ||
    configStatus === 4 ||
    configStatus === 5 ||
    configStatus === 6;

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <PVKonfiguratorMain className="pv-konfigurator" id="pv-konfigurator">
      <div className="input">
        <div className="d-flex flex-row">
          <NavButtons
            setConfigStatus={setConfigStatus}
            configStatus={configStatus}
            startCalc={startCalc}
          />
          {configStatus === 0 && <Objects colors={colors} setConfigStatus={setConfigStatus} />}
          {boolShowMap && (
            <Map
              configStatus={configStatus}
              setConfigStatus={setConfigStatus}
              plz={plz}
              setPlz={setPlz}
              colors={colors}
              maps={maps}
              setMaps={setMaps}
              deltaX={deltaX}
              setDeltaX={setDeltaX}
              deltaY={deltaY}
              setDeltaY={setDeltaY}
              currPoly={currPoly}
              setCurrPoly={setCurrPoly}
              middlePoints={middlePoints}
              setMiddlePoints={setMiddlePoints}
            />
          )}
        </div>
      </div>

      <div className="output">
        <ResultsMain className="d-flex flex-row flex-wrap">
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <TypeIcon />
            <h1>{roofType}</h1>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <AreaIcon />
            <h1>{panelArea} m²</h1>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <DirectionIcon />
            <h1>
              {roofDirect}° ({compass})
            </h1>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <SlopeIcon />
            <h1>{slope}°</h1>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <NoPanelsIcon />
            <NumberfieldCP
              colors={colors}
              value={panelNo}
              onChange={(e) => {
                console.log(e);
                e === 'up'
                  ? dispatch(setPanelNo(panelNo + 1))
                  : e === 'down'
                  ? dispatch(setPanelNo(panelNo - 1))
                  : dispatch(setPanelNo(e));
              }}
            />
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <PowerIcon />
            <h1>{Math.round((modulePower * panelNo) / 100) / 10} kWp</h1>
          </ResultCard>
        </ResultsMain>
      </div>
    </PVKonfiguratorMain>
  );
};

export default PVKonfigurator;

const NumberfieldCP = styled(Numberfield)`
  width: 150px;

  .number-input {
    input {
      width: 100px;
      font-size: 24px !important;
      font-weight: 700 !important;
      line-height: 30px !important;
      color: ${({ colors }) => colors.DirtyPurple} !important;
    }
  }
`;

const PVKonfiguratorMain = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;
const ResultsMain = styled.div`
  margin-top: 64px;
`;

const ResultCard = styled.div`
  padding: 32px;
  width: 275px;
  margin-right: 32px;

  svg {
    max-width: 75px;
  }

  h1 {
    color: ${({ colors }) => colors.DirtyPurple};
    margin-left: 16px;
  }
`;
