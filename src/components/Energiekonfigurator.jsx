import { Routes, Route, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

import PVKonfigurator from './PVKonfigurator';
import Sidebar from './Sidebar';
//import SolarCalculation from './SolarCalculation';
import { ModulSelection } from './ModulSelection';
import { Ergebnisse } from './Ergebnisse';

//import pointer from './images/pointer.png';

export default function Energiekonfigurator({ colors }) {
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const [configStatus, setConfigStatus] = useState(0);
  // Map
  //const [roofType, setRoofType] = useState('-');
  const [maps, setMaps] = useState();
  const [zoom, setZoom] = useState(5);
  //const [lat, setLat] = useState(48.13);
  //const [lng, setLng] = useState(11.58);
  const [plz, setPlz] = useState('');
  //const [objectType, setObjectType] = useState(0);
  const [panelArea, setPanelArea] = useState('-');
  const [roofDirect, setRoofDirect] = useState('-');
  //const [roofSlope, setRoofSlope] = useState(30);
  const [panelNo, setPanelNo] = useState(40);
  // OverlayGoogleDraw
  const [deltaX, setDeltaX] = useState(0);
  const [deltaY, setDeltaY] = useState(0);
  const [cornerPointsLatLng, setCornerPointsLatLng] = useState([]);
  const [cornerPoints, setCornerPoints] = useState([]);
  const [middlePoints, setMiddlePoints] = useState([]);
  const [centrePoint, setCentrePoint] = useState();
  const [sideLen, setSideLen] = useState([]);
  const [selectedShape, setSelectedShape] = useState();
  const [currPoly, setCurrPoly] = useState();
  //ModulSelection
  const [globalRadiation, setGlobalRadiation] = useState([]);
  const [pvYield, setPVYield] = useState([
    0, 0, 0, 0, 0, 0, 0, 34, 216, 279, 319, 415, 455, 348, 200, 48,
  ]);
  const [arrYear, setArrYear] = useState([]);

  useEffect(() => {
    console.log('useEffect');
    // Fetch Time data
    fetch('./time.json')
      .then((response) => response.json())
      .then((json) => {
        setArrYear(json);
        console.log('Energiekonf/useEffect/TimeData');
        return json;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelNo]);

  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            <Layout
              colors={colors}
              sidebarCollapse={sidebarCollapse}
              setSidebarCollapse={setSidebarCollapse}
            />
          }
        >
          <Route
            index
            element={
              <PVKonfigurator
                colors={colors}
                //roofType={roofType}
                //setRoofType={setRoofType}
                configStatus={configStatus}
                setConfigStatus={setConfigStatus}
                maps={maps}
                setMaps={setMaps}
                //zoom={zoom}
                //setZoom={setZoom}
                plz={plz}
                setPlz={setPlz}
                //objectType={objectType}
                //setObjectType={setObjectType}
                //panelArea={panelArea}
                //setPanelArea={setPanelArea}
                //roofDirect={roofDirect}
                //setRoofDirect={setRoofDirect}
                //roofSlope={roofSlope}
                //setRoofSlope={setRoofSlope}
                //panelNo={panelNo}
                //setPanelNo={setPanelNo}
                deltaX={deltaX}
                setDeltaX={setDeltaX}
                deltaY={deltaY}
                setDeltaY={setDeltaY}
                //cornerPointsLatLng={cornerPointsLatLng}
                //setCornerPointsLatLng={setCornerPointsLatLng}
                //cornerPoints={cornerPoints}
                //setCornerPoints={setCornerPoints}
                middlePoints={middlePoints}
                setMiddlePoints={setMiddlePoints}
                //centrePoint={centrePoint}
                //setCentrePoint={setCentrePoint}
                //sideLen={sideLen}
                //setSideLen={setSideLen}
                //selectedShape={selectedShape}
                //setSelectedShape={setSelectedShape}
                currPoly={currPoly}
                setCurrPoly={setCurrPoly}
                //setGlobalRadiation={setGlobalRadiation}
                //setPVYield={setPVYield}
                //arrYear={arrYear}
                //solarCalc={solarCalc}
              />
            }
          />
          <Route path="modul-auswahl" element={<ModulSelection colors={colors} />} />
          <Route
            path="ergebnisse"
            element={
              <Ergebnisse
                colors={colors}
                globalRadiation={globalRadiation}
                pvYield={pvYield}
                arrYear={arrYear}
                panelNo={panelNo}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

function Layout({ colors, sidebarCollapse, setSidebarCollapse }) {
  return (
    <div className="energiekonfigurator d-flex flex-row" colors={colors}>
      <Sidebar
        className="sidebar"
        colors={colors}
        sidebarCollapse={sidebarCollapse}
        setSidebarCollapse={setSidebarCollapse}
      />
      <Content className="content flex-fill">
        <Outlet />
      </Content>
    </div>
  );
}

const Content = styled.div`
  padding: 32px;
  width: calc(100% - 300px);
`;
