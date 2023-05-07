import styled from '@emotion/styled';
import RadioButtonGroup from './RadioButtonGroup';
import Switch from '@mui/material/Switch';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { ReactComponent as OnePerson } from '../images/icon-1person.svg';
import { ReactComponent as TwoPerson } from '../images/icon-2person.svg';
import { ReactComponent as ThreePerson } from '../images/icon-3person.svg';
import { ReactComponent as FourPerson } from '../images/icon-4person.svg';
import Numberfield from './Numberfield';
import { useState, useEffect } from 'react';
import { getHeatProfilData, setHeatProfilProps } from '../store/heatProfilSlices';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

var myChart;

function HeatProfil({ colors }) {
  const debug = 1;
  const dispatch = useAppDispatch();
  var noPerson = useAppSelector((state) => state.heatProfilData.noPerson);
  var livingSpaceArea = useAppSelector((state) => state.heatProfilData.livingSpaceArea);
  var specHeatNeed = useAppSelector((state) => state.heatProfilData.specHeatNeed);
  var heatPowerCosts = useAppSelector((state) => state.heatProfilData.heatPowerCosts);
  var actHeatNeed = useAppSelector((state) => state.heatProfilData.actHeatNeed);
  var heatProfilMonth = useAppSelector((state) => state.heatProfilData.heatProfilMonth);
  let globTimeMonth = useAppSelector((state) => state.heatProfilData.globTimeMonth);
  let typHotWaterNeed = useAppSelector((state) => state.heatProfilData.typHotWaterNeed);
  let typServiceWaterNeed = useAppSelector((state) => state.heatProfilData.typServiceWaterNeed);
  let heatCurrProfilMonth = useAppSelector((state) => state.heatProfilData.heatCurrProfilMonth);

  const [switchState, setSwitchState] = useState(false);

  var radioButtonConfig = [
    { label: OnePerson, value: 1 },
    { label: TwoPerson, value: 2 },
    { label: ThreePerson, value: 3 },
    { label: FourPerson, value: 4 },
  ];

  useEffect(() => {
    if (debug > 0) console.log('HeatProfil/useEffectI');
    dispatch(getHeatProfilData());
  }, [livingSpaceArea, specHeatNeed]);

  useEffect(() => {
    var heatProfil = heatProfilMonth.map((val) => (val * typHotWaterNeed) / 1000);
    var serviceWaterProfil = Array.from({ length: 12 }, () => typServiceWaterNeed / 12);

    const ctx = document.getElementById('myChart').getContext('2d');
    let delayed;

    myChart?.destroy();
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: globTimeMonth,
        datasets: [
          {
            label: 'Wärmebedarf [kWh]',
            data: heatProfil,
            backgroundColor: ['rgba(114,186,151,0.5)'],
            borderColor: ['rgba(114,186,151, 1)'],
            borderWidth: 1,
            stack: 'Stack 0',
            yAxisID: 'y',
          },
          {
            label: 'Brauchwasserbedarf [kWh]',
            data: serviceWaterProfil,
            backgroundColor: ['rgba(114,156,186,0.5)'],
            borderColor: ['rgba(114,156,186,1)'],
            borderWidth: 1,
            stack: 'Stack 0',
            yAxisID: 'y',
          },
          {
            label: 'WP Strombedarf [kWh]',
            data: heatCurrProfilMonth,
            backgroundColor: ['rgba(114,134,186,0.5)'],
            borderColor: ['rgba(114,134,186,1)'],
            borderWidth: 1,
            stack: 'Stack 2',
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
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
            position: 'left',
          },
          y1: {
            beginAtZero: true,
            stacked: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heatProfilMonth, typHotWaterNeed, typServiceWaterNeed]);

  return (
    <HeatProfilMain colors={colors} className="d-flex flex-row flex-wrap">
      <Household className="w-100">
        <h2>Personen im Haushalt</h2>
        <RadioButtonGroup
          entries={radioButtonConfig}
          row={true}
          value={noPerson}
          setValue={(e) => dispatch(setHeatProfilProps({ noPerson: parseInt(e) }))}
        />
      </Household>
      <LivingSpace>
        <h2>Wohnfläche</h2>
        <div className="living-space-input d-flex flex-row align-items-center">
          <h3>Fläche in m²:</h3>
          <NumberfieldCP
            colors={colors}
            value={livingSpaceArea}
            onChange={(e) => {
              console.log(e);
              e === 'up'
                ? dispatch(setHeatProfilProps({ livingSpaceArea: livingSpaceArea + 1 }))
                : e === 'down'
                ? dispatch(setHeatProfilProps({ livingSpaceArea: livingSpaceArea - 1 }))
                : dispatch(setHeatProfilProps({ livingSpaceArea: e }));
            }}
          />
        </div>
      </LivingSpace>
      <ConstructionYear>
        <h2>Baujahr:</h2>
        <div className="living-space-input d-flex flex-row align-items-center">
          <h3>Spez. Wärmebedarf [kWh/m²a]:</h3>
          <NumberfieldCP
            colors={colors}
            value={specHeatNeed}
            onChange={(e) => {
              console.log(e);
              e === 'up'
                ? dispatch(setHeatProfilProps({ specHeatNeed: specHeatNeed + 1 }))
                : e === 'down'
                ? dispatch(setHeatProfilProps({ specHeatNeed: specHeatNeed - 1 }))
                : dispatch(setHeatProfilProps({ specHeatNeed: e }));
            }}
          />
        </div>
      </ConstructionYear>
      <Price>
        <h2>WP Stromtarif</h2>
        <div className="living-space-input d-flex flex-row align-items-center">
          <h3>Stromkosten in ct/kWh:</h3>
          <NumberfieldCP
            colors={colors}
            value={heatPowerCosts}
            onChange={(e) => {
              console.log(e);
              e === 'up'
                ? dispatch(setHeatProfilProps({ heatPowerCosts: heatPowerCosts + 1 }))
                : e === 'down'
                ? dispatch(setHeatProfilProps({ heatPowerCosts: heatPowerCosts - 1 }))
                : dispatch(setHeatProfilProps({ heatPowerCosts: e }));
            }}
          />
        </div>
      </Price>
      <Results colors={colors} className="w-100">
        <div className="results d-flex flex-row align-items-center">
          <div className="sub-result d-flex flex-column">
            <h2>Typischer Wärmebedarf pro Jahr</h2>
            <p className="bg-brown">{Math.round(typHotWaterNeed + typServiceWaterNeed)} kWh/a</p>
          </div>

          <Switch
            checked={switchState}
            onChange={(e) => setSwitchState(e.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
          />

          <div className="sub-result d-flex flex-column">
            <h2>Tatsächlicher Wärmebedarf pro Jahr</h2>
            <NumberfieldCP2
              colors={colors}
              value={actHeatNeed}
              onChange={(e) => {
                console.log(e);
                e === 'up'
                  ? dispatch(setHeatProfilProps({ actHeatNeed: actHeatNeed + 1 }))
                  : e === 'down'
                  ? dispatch(setHeatProfilProps({ actHeatNeed: actHeatNeed - 1 }))
                  : dispatch(setHeatProfilProps({ actHeatNeed: e }));
              }}
            />
          </div>
        </div>
      </Results>
      <ChartMain>
        <div className="chart">
          <canvas id="myChart"></canvas>
        </div>
      </ChartMain>
    </HeatProfilMain>
  );
}

export { HeatProfil };

const ChartMain = styled.div`
  margin: 32px 0px 0px;

  .chart {
    position: relative;
    width: calc(100vw - 550px);
    max-width: 1300px;
    height: 35vh;
  }

  #myChart {
    max-width: 1650px;
  }
`;

const HeatProfilMain = styled.div`
  margin-left: 64px;

  h2 {
    color: ${({ colors }) => colors.PurpleGrey};
    margin: 32px 0px !important;
  }

  h3 {
    width: 180px;
    color: ${({ colors }) => colors.SandyBrown};
    margin-right: 56px;
  }

  .calc-current-profil {
    h2 {
      margin: 0px 0px 0px 32px !important;
    }
  }
`;

const Household = styled.div`
  margin-bottom: 48px;
`;

const LivingSpace = styled.div`
  margin-bottom: 48px;
  margin-right: 32px;
`;

const NumberfieldCP = styled(Numberfield)`
  width: 150px;

  .number-input {
    input {
      width: 150px;
    }
  }
`;

const NumberfieldCP2 = styled(Numberfield)`
  width: 330px;

  .number-input {
    input {
      width: 330px;
    }
  }
`;

const ConstructionYear = styled.div`
  margin-right: 32px;
`;

const Price = styled.div``;

const Results = styled.div`
  margin-bottom: 48px;

  .form-check {
    margin: 0 32px;

    .form-check-input {
      border: 1px solid rgba(186, 170, 114, 1) !important;
    }
  }
  .sub-result,
  .costs {
    width: 345px;
    h2 {
      margin: 24px 0px !important;
      color: ${({ colors }) => colors.DirtyPurple};
    }

    .bg-brown {
      font-size: 18px !important;
      font-weight: 700 !important;
      line-height: 23px !important;
      text-align: center;
      border-radius: 12px 12px 0px 12px;
      margin-bottom: 0px !important;
      color: ${({ colors }) => colors.BrightBlack};
      background-color: ${({ colors }) => colors.SandyBrown};
      padding: 8px;
    }

    .bg-green {
      text-align: center;
      border-radius: 12px 12px 0px 12px;
      margin-bottom: 0px !important;
      color: ${({ colors }) => colors.BrightBlack};
      background-color: ${({ colors }) => colors.DirtyGreen};
      padding: 8px;
    }
  }

  .costs {
    margin-top: 24px;
  }
`;
