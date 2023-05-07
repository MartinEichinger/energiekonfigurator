import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import HomeHeroSection from './HomeHeroSection';
import BlogFilter from './BlogFilter';
import blogHeroSolar from '../images/blog-hero-solar.png';
import image_blog_1 from '../images/image_blog_1.png';
import image_blog_2 from '../images/image_blog_2.png';

const prop = {
  heading: 'Aktuelle Themen und Links rund um Photovoltaik und PV-Speicher',
  body: '',
  image: blogHeroSolar,
};

const blogEntries = [
  {
    image: image_blog_1,
    owner: 'Grafik: FfE, VBWE',
    href: 'https://bayernplan-energie.ffe.de/',
    heading: 'Studie “Bayernplan Energie 2040”',
    tags: '03.05.2023 / FfE, VBWE / Photovoltaik',
    body: 'Die Studie „Bayernplan Energie 2040“ beschreibt anhand vier Szenarien, wie Bayern im Jahr 2040 treibhausgasneutral werden kann.',
  },
  {
    image: image_blog_2,
    owner: 'Foto: Wegatech',
    href: 'https://solar.htw-berlin.de/publikationen/pv-speichersysteme-schneller-effizienter-besser/',
    heading: 'PV-Speichersysteme: Schneller, effizienter und besser geworden',
    tags: '11.2022 / HTW-Berlin / PV-Speicher',
    body: 'Bereits das fünfte Jahr in Folge vergleicht die Stromspeicher-Inspektion die Energieeffizienz von PV-Speichersystemen für Privathaushalte.',
  },
];

export function Blog({ colors }) {
  return (
    <BlogBody className="d-flex flex-column">
      <HeroSection className="sandyBrown" prop={prop} />
      <BlogFilter colors={colors} />
      <BlogEntries className="">
        {blogEntries.map((entry) => {
          return (
            <BlogEntry className="mb-5">
              <a href={entry.href} target="_blank" className="blog-entry d-flex flex-row">
                <Image style={{ backgroundImage: `url(${entry.image})` }}>
                  <p className="small">{entry.owner}</p>
                </Image>
                <div className="text-article d-flex flex-column ms-4">
                  <h3 className="mb-2">{entry.heading}</h3>
                  <p className="text-dirtyPurple small mb-2">{entry.tags}</p>
                  <p>{entry.body}</p>
                </div>
              </a>
            </BlogEntry>
          );
        })}
      </BlogEntries>
    </BlogBody>
  );
}

const BlogBody = styled.div`
  height: calc(100vh - 102px);
  max-width: 1296px;
  margin: 0 auto;
`;

const BlogEntries = styled.div`
  margin: 64px 144px 0;
`;

const Image = styled.div`
  height: 150px;
  width: 150px;
  position: relative;

  p {
    background-color: rgba(0, 0, 0, 0.5) !important;
    padding: 4px;
    position: absolute;
    bottom: 0px;
    width: 100%;
    color: white;
    text-shadow: none !important;
  }
`;

const BlogEntry = styled.div`
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const HeroSection = styled(HomeHeroSection)`
  margin-top: 104px;
  margin-bottom: 64px;
`;
