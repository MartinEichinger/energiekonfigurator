import { Routes, Route, Outlet, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { NoMatch } from './components/NoMatch';
import { Home } from './components/Home';
import { Blog } from './components/Blog';
import { Impressum } from './components/Impressum';
import Energiekonfigurator from './components/Energiekonfigurator';

import { ReactComponent as BrandLogo } from './images/brand-logo.svg';
import { ReactComponent as BrandName } from './images/brand-name.svg';
import pointer from './images/pointer.png';

const colors = {
  DirtyPurple: 'rgba(114,134,186,1)',
  DirtyPurple50: 'rgba(114,134,186,0.5)',
  DirtyGreen: 'rgba(114,186,151,1)',
  DirtyBlue: 'rgba(114,156,186,1)',
  SandyBrown: 'rgba(186,170,114,1)',
  SandyBrown50: 'hsl(47,34,79%,1)',
  BrightBlack: 'rgba(32,33,44,1)',
  PurpleGrey: 'rgba(130,143,163,1)', // typo
  LightGrey: 'rgba(208, 213, 220,1)',
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home colors={colors} />} />
        <Route path="energiekonfigurator/*" element={<Energiekonfigurator colors={colors} />} />
        <Route path="blog" element={<Blog colors={colors} />} />
        <Route path="impressum" element={<Impressum />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  const debug = 0;

  if (debug > 0) console.log('App: ', process.env);

  return (
    <div className="App" colors={colors}>
      <div className="frame d-flex flex-column">
        <Nav className="nav d-flex flex-row flex-nowrap" colors={colors} pointer={pointer}>
          <Link to="/" className="logo d-flex align-items-start">
            <BrandLogo />
            <BrandNameApp />
          </Link>
          <nav className="d-flex flex-row justify-content-around align-items-center">
            <Link to="/">Home</Link>
            <Link to="/energiekonfigurator">Energiekonfigurator</Link>
            <Link to="/blog">Blog</Link>
          </nav>
        </Nav>
        <div className="main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const BrandNameApp = styled(BrandName)`
  margin-left: 16px;
`;

const Nav = styled.div`
  box-shadow: 0px 0px 5px 1px ${({ colors }) => colors.PurpleGrey};

  .logo {
    padding: 35px 24px;
    border-top: 0px;
    width: 300px;
    cursor: url('${({ pointer }) => pointer}'), pointer;
  }

  nav {
    padding: 29px 32px 37px;
    border-top: 0px;
    width: calc(100vw - 300px);

    a {
      cursor: url('${({ pointer }) => pointer}'), pointer;
      text-decoration: none;
      color: ${({ colors }) => colors.PurpleGrey};

      &:hover {
        color: ${({ colors }) => colors.DirtyPurple};
      }
    }
  }
`;
