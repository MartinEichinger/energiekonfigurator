import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ReactComponent as NoPanelsIcon } from '../images/icon-no-panels.svg';
import { ReactComponent as GlobRadIcon } from '../images/einstrahlung.svg';
import { ReactComponent as PowerIcon } from '../images/icon-power.svg';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function Ergebnisse({ colors }) {
  // global weatherData
  let globTime = useAppSelector((state) => state.weatherData.globTimeMonth);
  let pvYield = useAppSelector((state) => state.weatherData.pvYieldMonth);
  let globIrradYear = useAppSelector((state) => state.weatherData.globIrradYear);
  let pvYieldYear = useAppSelector((state) => state.weatherData.pvYieldYear);
  // global objectData
  let panelNo = useAppSelector((state) => state.objectData.panelNo);

  // global pvModuleData
  let modulePower = useAppSelector((state) => state.pvModuleData.modulePower);

  useEffect(() => {
    console.log('Ergebnisse/useEffekt', pvYield);

    //var pvYieldMo = calcMonthlyData();
    const ctx = document.getElementById('myChart').getContext('2d');

    //const myChart =
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: globTime,
        datasets: [
          {
            label: 'PV Ertrag [kWh]',
            data: pvYield,
            backgroundColor: ['rgba(114,186,151,0.5)'],
            borderColor: ['rgba(114,186,151, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pvYield]);

  return (
    <div>
      <ResultsMain className="d-flex flex-row flex-wrap">
        <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
          <NoPanelsIcon />
          <h1>{panelNo}</h1>
        </ResultCard>
        <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
          <PowerIcon />
          <h1>{Math.round((modulePower * panelNo) / 100) / 10} kWp</h1>
        </ResultCard>
        <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
          <GlobRadIcon />
          <h1>{Math.round(globIrradYear) + ' kWh/m²'}</h1>
        </ResultCard>
        <ResultCard className="d-flex flex-row align-items-center" colors={colors}>
          <GlobRadIcon />
          <h1>{Math.round(pvYieldYear) + ' kWh/a'}</h1>
        </ResultCard>
      </ResultsMain>
      <div className="chart" width="400" height="400">
        <canvas id="myChart"></canvas>
      </div>
    </div>
  );
}

export { Ergebnisse };

const ResultsMain = styled.div`
  margin: 64px 0px;
`;

const ResultCard = styled.div`
  padding: 32px 16px;
  width: 300px;
  margin-right: 16px;

  svg {
    max-width: 75px;
  }

  h1 {
    color: ${({ colors }) => colors.DirtyPurple};
    margin-left: 16px;
  }
`;

/* {Math.round(
  globalRadiation.reduce((pv, cv) => {
    return pv + cv;
  }, 0) / 1000
) + ' kW/m²'} */
