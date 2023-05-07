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
import {
  getCurrentProfilData,
  setCurrentProfilProps,
  calcAllocConsumpFeed,
} from '../store/currentProfilSlices';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

var myChart;

function CurrentProfil({ colors }) {
  const debug = 1;
  const dispatch = useAppDispatch();
  var noPerson = useAppSelector((state) => state.currentProfilData.noPerson);
  var livingSpaceArea = useAppSelector((state) => state.currentProfilData.livingSpaceArea);
  var noAppliances = useAppSelector((state) => state.currentProfilData.noAppliances);
  var powerCosts = useAppSelector((state) => state.currentProfilData.powerCosts);
  const [typPowerConsump, setTypPowerConsump] = useState(0);
  var actPowerConsump = useAppSelector((state) => state.currentProfilData.actPowerConsump);
  const [switchState, setSwitchState] = useState(false);
  var currProfilMonth = useAppSelector((state) => state.currentProfilData.currProfilMonth);
  let globTimeMonth = useAppSelector((state) => state.currentProfilData.globTimeMonth);

  var radioButtonConfig = [
    { label: OnePerson, value: 1 },
    { label: TwoPerson, value: 2 },
    { label: ThreePerson, value: 3 },
    { label: FourPerson, value: 4 },
  ];

  useEffect(() => {
    if (debug > 0) console.log('HeatProfil/useEffectI');
    dispatch(getCurrentProfilData());
  }, []);

  useEffect(() => {
    setTypPowerConsump(noPerson * 200 + livingSpaceArea * 9 + noAppliances * 200);
  }, [noPerson, livingSpaceArea, noAppliances, powerCosts]);

  useEffect(() => {
    var currProfil = currProfilMonth.map((val) => (val * typPowerConsump) / 1000);

    const ctx = document.getElementById('myChart').getContext('2d');
    let delayed;

    myChart?.destroy();
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: globTimeMonth,
        datasets: [
          {
            label: 'Strombedarf [kWh]',
            data: currProfil,
            backgroundColor: ['rgba(114,186,151,0.5)'],
            borderColor: ['rgba(114,186,151, 1)'],
            borderWidth: 1,
            stack: 'Stack 0',
            yAxisID: 'y',
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
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currProfilMonth, typPowerConsump]);

  return (
    <CurrentProfilMain colors={colors} className="d-flex flex-row flex-wrap">
      <Household className="w-100">
        <h2>Personen im Haushalt</h2>
        <RadioButtonGroup
          entries={radioButtonConfig}
          row={true}
          value={noPerson}
          setValue={(e) => dispatch(setCurrentProfilProps({ noPerson: parseInt(e) }))}
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
                ? dispatch(setCurrentProfilProps({ livingSpaceArea: livingSpaceArea + 1 }))
                : e === 'down'
                ? dispatch(setCurrentProfilProps({ livingSpaceArea: livingSpaceArea - 1 }))
                : dispatch(setCurrentProfilProps({ livingSpaceArea: e }));
            }}
          />
        </div>
      </LivingSpace>
      <Applicances>
        <h2>Haushaltsgeräte:</h2>
        <div className="living-space-input d-flex flex-row align-items-center">
          <h3>Anzahl Geräte:</h3>
          <NumberfieldCP
            colors={colors}
            value={noAppliances}
            onChange={(e) => {
              console.log(e);
              e === 'up'
                ? dispatch(setCurrentProfilProps({ noAppliances: noAppliances + 1 }))
                : e === 'down'
                ? dispatch(setCurrentProfilProps({ noAppliances: noAppliances - 1 }))
                : dispatch(setCurrentProfilProps({ noAppliances: e }));
            }}
          />
        </div>
      </Applicances>
      <Price>
        <h2>Stromtarif</h2>
        <div className="living-space-input d-flex flex-row align-items-center">
          <h3>Stromkosten in ct/kWh:</h3>
          <NumberfieldCP
            colors={colors}
            value={powerCosts}
            onChange={(e) => {
              console.log(e);
              e === 'up'
                ? dispatch(setCurrentProfilProps({ powerCosts: powerCosts + 1 }))
                : e === 'down'
                ? dispatch(setCurrentProfilProps({ powerCosts: powerCosts - 1 }))
                : dispatch(setCurrentProfilProps({ powerCosts: e }));
            }}
          />
        </div>
      </Price>
      <Results colors={colors} className="d-flex flex-row flex-wrap">
        <div className="results d-flex flex-row align-items-center">
          <div className="sub-result d-flex flex-column">
            <h2>Typischer Stromverbrauch pro Jahr</h2>
            <p className="bg-brown">{noPerson * 200 + livingSpaceArea * 9 + noAppliances * 200} kWh/a</p>
          </div>

          <Switch
            checked={switchState}
            onChange={(e) => setSwitchState(e.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
          />

          <div className="sub-result d-flex flex-column">
            <h2>Tatsächlicher Stromverbrauch pro Jahr</h2>
            <NumberfieldCP2
              colors={colors}
              value={actPowerConsump}
              onChange={(e) => {
                console.log(e);
                e === 'up'
                  ? dispatch(setCurrentProfilProps({ actPowerConsump: actPowerConsump + 1 }))
                  : e === 'down'
                  ? dispatch(setCurrentProfilProps({ actPowerConsump: actPowerConsump - 1 }))
                  : dispatch(setCurrentProfilProps({ actPowerConsump: e }));
              }}
            />
          </div>
        </div>
        <div className="costs d-flex flex-column">
          <h2>Stromkosten pro Jahr</h2>
          <p className="bg-green">
            {switchState === false
              ? ((noPerson * 200 + livingSpaceArea * 9 + noAppliances * 200) * powerCosts) / 100
              : (actPowerConsump * powerCosts) / 100}
            €/a
          </p>
        </div>
      </Results>
      <div className="calc-current-profil d-flex flex-row align-items-center mt-5">
        <button
          className="btn large dirtyGreen"
          onClick={() => {
            switchState === false
              ? dispatch(setCurrentProfilProps({ currProfilYear: typPowerConsump }))
              : dispatch(setCurrentProfilProps({ currProfilYear: actPowerConsump }));
            dispatch(calcAllocConsumpFeed());
          }}
          disabled={
            !(
              (typPowerConsump !== 0 && switchState === false) ||
              (actPowerConsump !== 0 && switchState === true)
            )
          }
        >
          Stromprofil berechnen
        </button>
        <h2>
          {switchState === false
            ? '... mit typischem Stromverbrauch'
            : '... mit tatsächlichem Stromverbrauch'}
        </h2>
      </div>
      <ChartMain>
        <div className="chart">
          <canvas id="myChart"></canvas>
        </div>
      </ChartMain>
    </CurrentProfilMain>
  );
}

export { CurrentProfil };

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

const CurrentProfilMain = styled.div`
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
  margin-right: 32px;
  margin-bottom: 48px;
`;

const LivingSpace = styled.div`
  margin-right: 32px;
  margin-bottom: 48px;
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

const Applicances = styled.div`
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
      font-size: 18px !important;
      font-weight: 700 !important;
      line-height: 23px !important;
      text-align: center;
      border-radius: 12px 12px 0px 12px;
      margin-bottom: 0px !important;
      color: ${({ colors }) => colors.BrightBlack};
      background-color: ${({ colors }) => colors.DirtyGreen};
      padding: 8px;
    }
  }

  .costs {
    margin-left: 32px;
  }
`;
