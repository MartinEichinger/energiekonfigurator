import styled from '@emotion/styled';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setPVModuleData } from '../store/pvModuleSlices';
import { ReactComponent as SelectedModule } from '../images/selected-module.svg';
import solarmodule1 from '../images/solar-modul-1.jpg';
import solarmodule2 from '../images/solar-modul-2.jpg';
import solarmodule3 from '../images/solar-modul-3.jpg';
import solarmodule4 from '../images/solar-modul-4.jpg';
import solarmodule5 from '../images/solar-modul-5.jpg';
import solarmodule6 from '../images/solar-modul-6.jpg';

function ModulSelection({ colors }) {
  const dispatch = useAppDispatch();
  const modulCatalog = [
    {
      link: solarmodule1,
      title: 'Panel Classic',
      detail:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.',
      power: 375,
      height: 1.65,
      width: 1.0,
    },
    {
      link: solarmodule2,
      title: 'Meyer Burger Black',
      detail:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.',
      power: 380,
      height: 1.7,
      width: 1.0,
    },
    {
      link: solarmodule3,
      title: 'Trina Solar Vertex S',
      detail:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.',
      power: 420,
      height: 1.7,
      width: 1.0,
    },
    {
      link: solarmodule4,
      title: 'Meyer Burger White',
      detail:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.',
      power: 385,
      height: 1.7,
      width: 1.0,
    },
    {
      link: solarmodule5,
      title: 'LG Solar LG405N3K-V6',
      detail:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.',
      power: 405,
      height: 1.88,
      width: 1.05,
    },
    {
      link: solarmodule6,
      title: 'Suntech Power STP405S-C54',
      detail:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.',
      power: 400,
      height: 1.72,
      width: 1.13,
    },
  ];

  let moduleName = useAppSelector((state) => state.pvModuleData.moduleName);
  let modulePower = useAppSelector((state) => state.pvModuleData.modulePower);
  let moduleHeight = useAppSelector((state) => state.pvModuleData.moduleHeight);
  let moduleWidth = useAppSelector((state) => state.pvModuleData.moduleWidth);

  return (
    <ModulSelectMain>
      <ModulSelected className="d-flex flex-row align-items-center" colors={colors}>
        <SelectedModule />
        <h3>
          {moduleName} - {modulePower} Wp - {moduleHeight}m x {moduleWidth}m
        </h3>
      </ModulSelected>
      <ModulList className={'d-flex flex-row flex-wrap'} colors={colors}>
        {modulCatalog.map((modul, i) => {
          return (
            <div className="pv-card d-flex flex-row" key={i}>
              <img src={modul.link} alt="Solar Modul" />
              <div className="descr d-flex flex-column">
                <h3>{modul.title}</h3>
                <p>{modul.detail}</p>
                <p>
                  Max. Nennleistung: {modul.power} Wp <br />
                  Abmessungen: {modul.height} x {modul.width} m
                </p>
                <button
                  className="btn xsmll"
                  onClick={() =>
                    dispatch(
                      setPVModuleData({
                        name: modul.title,
                        power: modul.power,
                        height: modul.height,
                        width: modul.width,
                      })
                    )
                  }
                >
                  Auswahl
                </button>
                <button className="btn xsmll">Datenblatt ansehen</button>
              </div>
            </div>
          );
        })}
      </ModulList>
    </ModulSelectMain>
  );
}

export { ModulSelection };

const ModulSelected = styled.div`
  background-image: linear-gradient(to bottom right, ${({ colors }) => colors.SandyBrown}, white);
  padding: 12px 18px;
  border-radius: 12px 12px 0px 12px;
  //width: 100%;

  h3 {
    margin-left: 32px;
  }
`;

const ModulSelectMain = styled.div``;

const ModulList = styled.div`
  .pv-card {
    margin-top: 32px;
    width: 405px;
    //height: 280px;
    padding: 15px;
    border-radius: 12px 12px 0px 12px;
    box-shadow: 0px 0px 4px 1px ${({ colors }) => colors.PurpleGrey};
    margin-right: 64px;

    img {
      height: 250px;
    }

    .descr {
      padding: 0px 15px;

      p {
        margin-bottom: 8px;
      }
    }

    button {
      background-color: ${({ colors }) => colors.DirtyPurple};
      --bs-btn-hover-bg: ${({ colors }) => colors.DirtyPurple};
      margin-bottom: 8px;

      &:active {
        color: ${({ colors }) => colors.PurpleGrey} !important;
      }
    }
  }
`;
