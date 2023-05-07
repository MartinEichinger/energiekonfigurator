import { Routes, Route, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

import PVKonfigurator from './PVKonfigurator';
import Sidebar from './Sidebar';
//import SolarCalculation from './SolarCalculation';
import { ModulSelection } from './ModulSelection';
import { Ergebnisse } from './Ergebnisse';
import { CurrentProfil } from './CurrentProfil';
import { HeatProfil } from './HeatProfil';
import { PowerStorage } from './PowerStorage';
import { Kosten } from './Kosten';

//import pointer from './images/pointer.png';

export default function Energiekonfigurator({ colors }) {
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const [configStatus, setConfigStatus] = useState(0);
  // Map
  const [maps, setMaps] = useState();
  const [plz, setPlz] = useState('');
  const [panelNo, setPanelNo] = useState(40);
  // OverlayGoogleDraw
  const [deltaX, setDeltaX] = useState(0);
  const [deltaY, setDeltaY] = useState(0);
  const [cornerPoints, setCornerPoints] = useState([]);
  const [middlePoints, setMiddlePoints] = useState([]);
  const [centrePoint, setCentrePoint] = useState();
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
          <Route path="modul-auswahl" element={<ModulSelection colors={colors} />} />
          <Route
            index
            element={
              <PVKonfigurator
                colors={colors}
                configStatus={configStatus}
                setConfigStatus={setConfigStatus}
                maps={maps}
                setMaps={setMaps}
                plz={plz}
                setPlz={setPlz}
                deltaX={deltaX}
                setDeltaX={setDeltaX}
                deltaY={deltaY}
                setDeltaY={setDeltaY}
                middlePoints={middlePoints}
                setMiddlePoints={setMiddlePoints}
                currPoly={currPoly}
                setCurrPoly={setCurrPoly}
              />
            }
          />
          {/* <Route path="stromprofil" element={<CurrentProfil colors={colors} />} /> */}
          {/* <Route path="waermeverbrauch" element={<HeatProfil colors={colors} />} /> */}
          {/* <Route path="stromspeicher" element={<PowerStorage colors={colors} />} /> */}
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
          <Route path="kosten" element={<Kosten colors={colors} />} />
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
