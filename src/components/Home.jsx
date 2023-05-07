import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import HomeHeroSection from './HomeHeroSection';
import homeHeroEarth from '../images/home-hero-earth.png';

const prop = {
  heading: 'ONLINE RECHNER',
  body: 'Online Rechner zur einfachen Berechnung von PV Fläche und PV Ertrag Ihres Gebäudes oder Freifläche',
  image: homeHeroEarth,
};

function Home({ colors }) {
  return (
    <HomeBody className="d-flex flex-column" colors={colors}>
      <HeroSection className="dirtyGreen" prop={prop} />
      <TextSection className="mb-auto">
        <h1 className="mb-4 text-dirtyPurple">PV Ertrag online berechnen</h1>
        <p className="mb-5 text-justify">
          Der Photovoltaik-Rechner ermittelt die Solarstrom-Erträge für PV-Anlagen aller Leistungsklassen
          an beliebigen Standorten in Europa und weltweit – sei Gebäude mit Schrägdach oder Flachdach
          oder Freiflächen. Grundlage für den Solarrechner sind dabei hochauflösende meteorologische
          Sonnenstrahlungsdaten, die für eine realistische Prognose sorgen.
        </p>
        <h2 className="mb-4 text-dirtyPurple">Exakt und schnell</h2>
        <p className="mb-5 text-justify">
          Welchen Ertrag liefert Ihre neue PV-Anlage? Mit dem EnrgyKon Online Rechner berechnen sie den
          PV Ertrag mit hochauflösenden meteorologischen Sonnenstrahlungsdaten zu Ihrer Adresse. Dabei
          kann die Dachfläche oder Freifläche mit wenigen Eingaben exakt konfiguriert werden und Sie
          erhalten schnell einen genauen Überblick Ihres realistischen PV Ertrags.
        </p>
        <Link to="/energiekonfigurator">
          <button className="large dirtyGreen">Berechnung starten...</button>
        </Link>
      </TextSection>

      <div>
        <hr />
        <div className="d-flex flex-row justify-content-between align-items-center mb-2">
          <p className="mb-0">
            HINWEIS: EnrgyKon übernimmt bei diesem PV Rechner keinerlei Gewährleistung für den
            Solarertrag und für die Richtigkeit des Rechenergebnisses.
          </p>
          <Link to="/impressum" className="link">
            Impressum
          </Link>
        </div>
      </div>
    </HomeBody>
  );
}

export { Home };

const HomeBody = styled.div`
  height: calc(100vh - 102px);
  max-width: 1296px;
  margin: 0 auto;

  .link {
    margin: 0;
    padding: 8px 16px;
    border: 2px solid ${({ colors }) => colors.DirtyPurple};
    cursor: url('${({ pointer }) => pointer}'), pointer;
    text-decoration: none;
    color: ${({ colors }) => colors.PurpleGrey};

    &:hover {
      color: white;
      background-color: ${({ colors }) => colors.PurpleGrey};
    }
  }
`;

const TextSection = styled.div`
  margin: 0 144px;
`;

const HeroSection = styled(HomeHeroSection)`
  margin-top: 104px;
  margin-bottom: 64px;
`;
