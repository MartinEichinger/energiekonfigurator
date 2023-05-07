import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import pointer from '../images/pointer.png';
import { ReactComponent as SunIcon } from '../images/icon-sun.svg';
import { ReactComponent as HideIcon } from '../images/icon-hide-sidebar.svg';

const Sidebar = ({ className, colors, sidebarCollapse, setSidebarCollapse }) => {
  return (
    <SidebarMain
      className={
        sidebarCollapse
          ? `${className} sidebar collapsed d-flex flex-column justify-content-between`
          : `${className} sidebar d-flex flex-column justify-content-between`
      }
      colors={colors}
      pointer={pointer}
    >
      {!sidebarCollapse && (
        <div className={'upper d-flex flex-column'}>
          <h3 className="sidebar-heading">ALL BOARDS </h3>
          <NavLink
            to="/energiekonfigurator/modul-auswahl"
            className={'d-flex flex-row align-items-center'}
          >
            <SunIcon />
            <h3>Solarmodule</h3>
          </NavLink>
          <NavLink to="/energiekonfigurator" className={'d-flex flex-row align-items-center'} end>
            <SunIcon />
            <h3>PV Anlage</h3>
          </NavLink>
          {/* <NavLink
            to="/energiekonfigurator/stromprofil"
            className={'d-flex flex-row align-items-center'}
          >
            <SunIcon />
            <h3>Stromverbrauch</h3>
          </NavLink> */}
          {/* <NavLink
            to="/energiekonfigurator/waermeverbrauch"
            className={'d-flex flex-row align-items-center'}
          >
            <SunIcon />
            <h3>Wärmeverbrauch</h3>
          </NavLink> */}
          {/* <NavLink
            to="/energiekonfigurator/stromspeicher"
            className={'d-flex flex-row align-items-center'}
          >
            <SunIcon />
            <h3>Stromspeicher</h3>
          </NavLink> */}
          <NavLink to="/energiekonfigurator/ergebnisse" className={'d-flex flex-row align-items-center'}>
            <SunIcon />
            <h3>Ergebnisse</h3>
          </NavLink>
          {/* <NavLink to="/energiekonfigurator/kosten" className={'d-flex flex-row align-items-center'}>
            <SunIcon />
            <h3>Kosten</h3>
          </NavLink> */}
        </div>
      )}

      <div className="lower d-none d-sm-flex flex-column">
        <div
          className={
            sidebarCollapse
              ? 'marker collapsed d-flex flex-row align-items-center'
              : 'marker d-flex flex-row align-items-center'
          }
          onClick={() => setSidebarCollapse(!sidebarCollapse)}
        >
          <HideIcon />
          {!sidebarCollapse && <h3>HideSidebar</h3>}
        </div>
      </div>
    </SidebarMain>
  );
};

export default Sidebar;

const SidebarMain = styled.div`
  width: 300px;
  height: calc(100vh - 102px);
  box-shadow: 0px 5px 5px 1px ${({ colors }) => colors.PurpleGrey};

  &.collapsed {
    width: 0px;
  }

  .sidebar-heading {
    padding: 14px 93px 15px 32px;
  }

  a {
    padding: 14px 0px 15px 32px;
    margin-right: 24px;
    margin-bottom: 2px;
    border-radius: 0px 100px 100px 0px;
    color: ${({ colors }) => colors.PurpleGrey};
    cursor: url('${({ pointer }) => pointer}'), pointer;
    text-decoration: none;

    &:hover {
      background-color: ${({ colors }) => colors.DirtyPurple};
      color: ${({ colors }) => colors.LightGrey};

      svg path,
      svg circle {
        stroke: ${({ colors }) => colors.LightGrey};
      }
    }

    &.active {
      background-color: ${({ colors }) => colors.DirtyPurple};
      color: white;

      svg path,
      svg circle {
        stroke: white;
      }
    }

    h3 {
      margin-bottom: 0px;
      margin-left: 16px;
    }
  }

  .marker {
    position: fixed;
    bottom: 0px;
    width: 275px;
    margin-bottom: 32px;
    padding: 14px 0px 15px 32px;
    margin-right: 24px;
    border-radius: 0px 100px 100px 0px;
    cursor: url('${({ pointer }) => pointer}'), pointer;

    &.collapsed {
      width: 58px;
      padding: 16px 22px 16px 18px;
      background-color: ${({ colors }) => colors.DirtyPurple};

      &:hover {
        background-color: ${({ colors }) => colors.PurpleGrey};
      }

      svg path {
        fill: white;
      }
    }

    h3 {
      margin-bottom: 0px;
      margin-left: 16px;
      color: ${({ colors }) => colors.PurpleGrey};
    }

    svg {
      path {
        fill: ${({ colors }) => colors.PurpleGrey};
      }
    }
  }

  .marker.collapsed {
    padding: 14px 0px 15px 32px;
    border-radius: 0px 20px 20px 0px;
    cursor: url('${({ pointer }) => pointer}'), pointer;
    color: white;

    &:hover {
    }

    h3 {
      margin-bottom: 0px;
      margin-left: 16px;
      color: white;
    }

    svg {
      path {
        fill: white;
      }
    }
  }
`;
