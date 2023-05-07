import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import MinimumDistanceSlider from './MinimumDistanceSlider';
import Dropdown from './Dropdown';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ReactComponent as NoPanelsIcon } from '../images/icon-no-panels.svg';
import { ReactComponent as GlobRadIcon } from '../images/einstrahlung.svg';
import { ReactComponent as PowerIcon } from '../images/icon-power.svg';
import { ReactComponent as PowerSQMIcon } from '../images/pv-ertrag-m2.svg';
import { ReactComponent as PowerYearIcon } from '../images/pv-ertrag-a.svg';
import { ReactComponent as ConsumpYearIcon } from '../images/sv-bedarf-a.svg';
import { ReactComponent as ConsumpEuroIcon } from '../images/sv-bedarf-a-euro.svg';
import { ReactComponent as SumFeedIcon } from '../images/sum-einspeisung.svg';
import { ReactComponent as SumConsumpIcon } from '../images/sum-eigenbedarf.svg';
import { ReactComponent as SumPurchaseIcon } from '../images/sum-fremdbezug.svg';
import { ReactComponent as AutarkieIcon } from '../images/autarkie.svg';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

var myChart;

function Ergebnisse({ colors }) {
  // global weatherData
  let globTimeMonth = useAppSelector((state) => state.weatherData.globTimeMonth);
  let pvYieldMonth = useAppSelector((state) => state.weatherData.pvYieldMonth);
  let globTimeWeek = useAppSelector((state) => state.weatherData.globTimeWeek);
  let pvYieldWeek = useAppSelector((state) => state.weatherData.pvYieldWeek);
  let globTimeDay = useAppSelector((state) => state.weatherData.globTimeDay);
  let pvYieldDay = useAppSelector((state) => state.weatherData.pvYieldDay);
  let globTimeHour = useAppSelector((state) => state.weatherData.globTimeHour);
  let pvYieldHour = useAppSelector((state) => state.weatherData.pvYieldHour);
  let globIrradYear = useAppSelector((state) => state.weatherData.globIrradYear);
  let pvYieldYear = useAppSelector((state) => state.weatherData.pvYieldYear);

  // global currentProfilData
  let currProfilMonth = useAppSelector((state) => state.currentProfilData.currProfilMonth);
  let currProfilWeek = useAppSelector((state) => state.currentProfilData.currProfilWeek);
  let currentProfilDay = useAppSelector((state) => state.currentProfilData.currProfilDay);
  let currProfilHour = useAppSelector((state) => state.currentProfilData.currProfilHour);
  let currConsumpHour = useAppSelector((state) => state.currentProfilData.currConsumpHour);
  let currConsumpDay = useAppSelector((state) => state.currentProfilData.currConsumpDay);
  let currConsumpMonth = useAppSelector((state) => state.currentProfilData.currConsumpMonth);
  let currBattProvHour = useAppSelector((state) => state.currentProfilData.currBattProvHour);
  let currBattProvDay = useAppSelector((state) => state.currentProfilData.currBattProvDay);
  let currBattProvMonth = useAppSelector((state) => state.currentProfilData.currBattProvMonth);
  let currFeedHour = useAppSelector((state) => state.currentProfilData.currFeedHour);
  let currFeedDay = useAppSelector((state) => state.currentProfilData.currFeedDay);
  let currFeedMonth = useAppSelector((state) => state.currentProfilData.currFeedMonth);
  let currPurchaseHour = useAppSelector((state) => state.currentProfilData.currPurchaseHour);
  let currPurchaseDay = useAppSelector((state) => state.currentProfilData.currPurchaseDay);
  let currPurchaseMonth = useAppSelector((state) => state.currentProfilData.currPurchaseMonth);
  let currProfilYear = useAppSelector((state) => state.currentProfilData.currProfilYear);
  let powerCosts = useAppSelector((state) => state.currentProfilData.powerCosts);

  // global objectData
  let panelNo = useAppSelector((state) => state.objectData.panelNo);

  // global pvModuleData
  let modulePower = useAppSelector((state) => state.pvModuleData.modulePower);

  // global heatProfilData
  /* let heatCurrProfilMonth = useAppSelector((state) => state.heatProfilData.heatCurrProfilMonth);
  let heatCurrProfil = heatCurrProfilMonth?.reduce((acc, val) => acc + val); */

  // local states
  // Auswahl der Datenauflösung
  const [resolution, setResolution] = useState([{ name: 'Stunde' }, { name: 'Tag' }, { name: 'Monat' }]);
  // Ausgewählte Datenauflösung
  const [actResolution, setActResolution] = useState('Monat');
  // Auswahl der minimalen Ansicht
  const [minView, setMinView] = useState([
    { name: 'Stunde' },
    { name: 'Tag' },
    { name: 'Woche' },
    { name: 'Monat' },
  ]);
  // Ausgewählte minimale Ansicht
  const [actMinView, setActMinView] = useState('Monat');
  const [actMinViewVal, setActMinViewVal] = useState(30);
  const [minMaxValSlider, setMinMaxValSlider] = useState([0, 12]);
  const [baseCurrentProfil, setBaseCurrentProfil] = useState(currProfilMonth);
  const [pvYield, setPVYield] = useState(pvYieldMonth);
  const [currBattConsump, setCurrBattConsump] = useState(currBattProvDay);
  const [currConsump, setCurrConsump] = useState(currConsumpDay);
  const [currFeed, setCurrFeed] = useState(currFeedDay);
  const [currPurchase, setCurrPurchase] = useState(currPurchaseDay);
  const [globTime, setGlobTime] = useState(globTimeMonth);

  var currentProfil = baseCurrentProfil.map((entry) => {
    return (entry * currProfilYear) / 1000;
  });
  var currConsumpYear = 0;
  var currBattConsumpYear = 0;
  var currFeedYear = 0;
  var currPurchaseYear = 0;
  if (currConsumpMonth.length > 0) {
    currConsumpYear = currConsumpMonth?.reduce((acc, val) => acc + val);
    currBattConsumpYear = currBattProvMonth?.reduce((acc, val) => acc + val);
    currFeedYear = currFeedMonth?.reduce((acc, val) => acc + val);
    currPurchaseYear = currPurchaseMonth?.reduce((acc, val) => acc + val);
  }
  var currProfilYearEuro = (currProfilYear * powerCosts) / 100;

  useEffect(() => {
    // Update data set for display
    if (actResolution === 'Stunde') {
      setBaseCurrentProfil(currProfilHour);
      setPVYield(pvYieldHour);
      setGlobTime(globTimeHour);
      setCurrConsump(currConsumpHour);
      setCurrBattConsump(currBattProvHour);
      setCurrFeed(currFeedHour);
      setCurrPurchase(currPurchaseHour);
      setMinView([{ name: 'Stunde' }, { name: 'Tag' }, { name: 'Woche' }, { name: 'Monat' }]);
      setMinMaxValSlider([0, 8760]);
    } else if (actResolution === 'Tag') {
      setBaseCurrentProfil(currentProfilDay);
      setPVYield(pvYieldDay);
      setGlobTime(globTimeDay);
      setCurrConsump(currConsumpDay);
      setCurrBattConsump(currBattProvDay);
      setCurrFeed(currFeedDay);
      setCurrPurchase(currPurchaseDay);
      setMinView([{ name: 'Tag' }, { name: 'Woche' }, { name: 'Monat' }]);
      setMinMaxValSlider([0, 365]);
    } else if (actResolution === 'Woche') {
      setBaseCurrentProfil(currProfilWeek);
      setPVYield(pvYieldWeek);
      setGlobTime(globTimeWeek);
      setMinView([{ name: 'Woche' }, { name: 'Monat' }]);
      setMinMaxValSlider([0, 52]);
    } else if (actResolution === 'Monat') {
      setBaseCurrentProfil(currProfilMonth);
      setPVYield(pvYieldMonth);
      setGlobTime(globTimeMonth);
      setCurrConsump(currConsumpMonth);
      setCurrBattConsump(currBattProvMonth);
      setCurrFeed(currFeedMonth);
      setCurrPurchase(currPurchaseMonth);
      setMinView([{ name: 'Monat' }]);
      setMinMaxValSlider([0, 12]);
    }
  }, [actResolution]);

  useEffect(() => {
    console.log('Ergebnisse / useEffect / actMinView: ', actMinView);
    // Update data set for display
    if (actResolution === 'Monat') {
      setActMinViewVal(1);
    } else if (actResolution === 'Woche') {
      if (actMinView === 'Woche') {
        setActMinViewVal(1);
      } else if (actMinView === 'Monat') {
        setActMinViewVal(4);
      }
    } else if (actResolution === 'Tag') {
      if (actMinView === 'Tag') {
        setActMinViewVal(1);
      } else if (actMinView === 'Woche') {
        setActMinViewVal(7);
      } else if (actMinView === 'Monat') {
        setActMinViewVal(30);
      }
    } else if (actResolution === 'Stunde') {
      if (actMinView === 'Stunde') {
        setActMinViewVal(1);
      } else if (actMinView === 'Tag') {
        setActMinViewVal(24);
      } else if (actMinView === 'Woche') {
        setActMinViewVal(168);
      } else if (actMinView === 'Monat') {
        setActMinViewVal(672);
      }
    }
  }, [actMinView, actResolution]);

  useEffect(() => {
    //console.log('Ergebnisse/useEffekt', pvYield);

    //var pvYieldMo = calcMonthlyData();
    const ctx = document.getElementById('myChart').getContext('2d');
    let delayed;

    //const myChart =
    myChart?.destroy();
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: globTime.slice(minMaxValSlider[0], minMaxValSlider[1]),
        datasets: [
          {
            label: 'PV Ertrag [kWh]',
            data: pvYield.slice(minMaxValSlider[0], minMaxValSlider[1]),
            backgroundColor: ['rgba(114,186,151,0.5)'],
            borderColor: ['rgba(114,186,151, 1)'],
            borderWidth: 1,
            stack: 'Stack 0',
          },
          {
            label: 'Eigenverbrauch [kWh]',
            data: currConsump.slice(minMaxValSlider[0], minMaxValSlider[1]),
            backgroundColor: ['rgba(114,156,186,0.5)'],
            borderColor: ['rgba(114,156,186,1)'],
            borderWidth: 1,
            stack: 'Stack 1',
          },
          {
            label: 'Einspeisung [kWh]',
            data: currFeed.slice(minMaxValSlider[0], minMaxValSlider[1]),
            backgroundColor: ['rgba(136,186,114,0.5)'],
            borderColor: ['rgba(136,186,114,1)'],
            borderWidth: 1,
            stack: 'Stack 1',
          },
          {
            label: 'Batteriebezug [kWh]',
            data: currBattConsump.slice(minMaxValSlider[0], minMaxValSlider[1]),
            backgroundColor: ['rgba(114,186,151,0.5)'],
            borderColor: ['rgba(114,186,151,1)'],
            borderWidth: 1,
            stack: 'Stack 1',
          },
          {
            label: 'Fremdbezug [kWh]',
            data: currPurchase.slice(minMaxValSlider[0], minMaxValSlider[1]),
            backgroundColor: ['rgba(132,153,168,0.5)'],
            borderColor: ['rgba(132,153,168,1)'],
            borderWidth: 1,
            stack: 'Stack 1',
          },
        ],
      },
      options: {
        animation: {
          duration: 0,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            beginAtZero: true,
            stacked: true,
          },
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pvYield, minMaxValSlider]);

  return (
    <div className="d-flex flex-column">
      <ResultsMain className="d-flex flex-column flex-wrap" colors={colors}>
        <div className="results-pv d-flex flex-row align-items-center">
          <h2>Ergebnisse PV:</h2>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <NoPanelsIcon />
            <h2>{panelNo}</h2>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <PowerIcon />
            <h2>{Math.round((modulePower * panelNo) / 100) / 10} kWp</h2>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <PowerSQMIcon />
            <h2>{Math.round(globIrradYear) + ' kWh/m²'}</h2>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <PowerYearIcon />
            <h2>{Math.round(pvYieldYear) + ' kWh/a'}</h2>
          </ResultCard>
        </div>
        <div className="results-sv d-flex flex-row align-items-center">
          <h2>Ergebnisse SV:</h2>
          {/* <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <ConsumpYearIcon />
            <h2>{Math.round(heatCurrProfil)} kWh/a</h2>
          </ResultCard> */}
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <ConsumpYearIcon />
            <h2>{currProfilYear} kWh/a</h2>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <ConsumpEuroIcon />
            <h2>{currProfilYearEuro} €/a</h2>
          </ResultCard>
        </div>
        <div className="summary-cur d-flex flex-row align-items-center">
          <h2>Zusammenfassung:</h2>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <SumFeedIcon />
            <h2>{Math.round(currFeedYear)} kWh/a</h2>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <SumConsumpIcon />
            <h2>{Math.round(currConsumpYear + currBattConsumpYear)} kWh/a</h2>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <SumPurchaseIcon />
            <h2>{Math.round(currPurchaseYear)} kWh/a</h2>
          </ResultCard>
          <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
            <AutarkieIcon />
            <h2>
              {Math.round((1 - currPurchaseYear / (currPurchaseYear + currConsumpYear)) * 100)} %
              (Autarkie)
            </h2>
          </ResultCard>
        </div>
      </ResultsMain>
      <ChartMain>
        <div className="chart">
          <canvas id="myChart"></canvas>
        </div>
        <div className="rangeSlider d-flex flex-column">
          <div className="dropDownFields d-flex flex-row justify-content-start ">
            <div className="dropDown d-flex flex-row align-items-center">
              <h2>Datenauflösung:</h2>
              <Dropdown entries={resolution} text={actResolution} changeDropdown={setActResolution} />
            </div>
            <div className="dropDown d-flex flex-row align-items-center">
              <h2>Min. Ansicht:</h2>
              <Dropdown entries={minView} text={actMinView} changeDropdown={setActMinView} />
            </div>
          </div>
          <MinimumDistanceSlider
            minMaxValSlider={minMaxValSlider}
            setMinMaxValSlider={setMinMaxValSlider}
            maxValue={pvYield.length}
            minDistance={actMinViewVal}
          />
        </div>
      </ChartMain>
    </div>
  );
}

export { Ergebnisse };

const ChartMain = styled.div`
  margin: 32px 0px 0px;

  .chart {
    position: relative;
    width: calc(100vw - 350px);
    max-width: 1300px;
    height: 50vh;
  }

  #myChart {
    max-width: 1650px;
  }

  .dropDownFields {
    margin: 32px 0px;

    .dropDown {
      margin-right: 64px;
      h2 {
        margin-right: 32px;
      }
    }
  }
`;

const ResultsMain = styled.div`
  margin: 0px;
  h2 {
    color: ${({ colors }) => colors.DirtyPurple};
    margin-right: 16px;
  }
`;

const ResultCard = styled.div`
  padding: 24px 16px;
  //width: 100%;
  margin-right: 16px;

  svg {
    max-width: 75px;
  }

  h2 {
    color: ${({ colors }) => colors.DirtyPurple};
    margin-left: 16px;
  }
`;

/* {Math.round(
  globalRadiation.reduce((pv, cv) => {
    return pv + cv;
  }, 0) / 1000
) + ' kW/m²'} */
