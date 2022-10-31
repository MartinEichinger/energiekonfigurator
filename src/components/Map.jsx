import { useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import styled from '@emotion/styled';
import OverlayGoogleDraw from './OverlayGoogleDraw';
import Numberfield from './Numberfield';
import MoveTool from './MoveTool';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setZoom } from '../store/mapSlices';
import { setLng, setLat, setSlope } from '../store/objectSlices';

const Map = ({
  colors,
  configStatus,
  setConfigStatus,
  maps,
  setMaps,
  plz,
  setPlz,
  //setPanelArea,
  //panelArea,
  //slope,
  //setSlope,
  //setPanelNo,
  //zoom = 5,
  //setZoom,
  //lat,
  //setLat,
  //lng,
  //setLng,
  deltaX,
  setDeltaX,
  deltaY,
  setDeltaY,
  //cornerPointsLatLng,
  //setCornerPointsLatLng,
  //cornerPoints,
  //setCornerPoints,
  middlePoints,
  setMiddlePoints,
  //centrePoint,
  //setCentrePoint,
  //sideLen,
  //setSideLen,
  ////selectedShape,
  ////setSelectedShape,
  currPoly,
  setCurrPoly,
  //setRoofDirect,
}) => {
  const dispatch = useAppDispatch();

  // global map data
  //let maps = useAppSelector((state) => state.mapData.map);
  let zoom = useAppSelector((state) => state.mapData.zoom);
  // global object data
  let lat = useAppSelector((state) => state.objectData.lat);
  let lng = useAppSelector((state) => state.objectData.lng);
  let slope = useAppSelector((state) => state.objectData.slope);
  const [navSolarStat, setNavSolarStat] = useState(0);
  const center = { lat: lat, lng: lng };
  const debug = 0;

  const onMapLoad = (map) => {
    if (debug > 0) console.log('Map/onMapLoad: ', map);
    // Create the search box and link it to the UI element.
    const input = document.getElementById('search-box');
    const searchBox = new window.google.maps.places.SearchBox(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (debug > 0) console.log('Map/onMapLoad/Places: ', places);

      if (places.length === 0) {
        return;
      }
      // Clear out the old markers.
      //markers.forEach((marker) => {
      //  marker.setMap(null);
      //});
      //markers = [];
      // For each place, get the icon, name and location.
      const bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          if (debug > 0) console.log('Returned place contains no geometry');
          return;
        }
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
      dispatch(setLng(map.center.lng()));
      dispatch(setLat(map.center.lat()));
      setConfigStatus(2);
    });
  };

  if (debug > 0) console.log('Map/render: ', configStatus, navSolarStat);
  var boolOverlayUserControl =
    configStatus === 2 ||
    configStatus === 3 ||
    configStatus === 4 ||
    configStatus === 5 ||
    configStatus === 6;
  var boolOverlayUserCtrlBtn = configStatus === 2 || configStatus === 5;
  var boolOverlayGoogleDraw =
    configStatus === 3 || configStatus === 4 || configStatus === 5 || configStatus === 6;

  return (
    <MapContainer className="map-container d-flex flex-column">
      <GoogleMap
        zoom={zoom}
        tilt={0}
        center={center}
        mapContainerStyle={googleMapStyle}
        options={
          configStatus > 2
            ? {
                disableDefaultUI: true,
                mapTypeId: 'hybrid',
                labels: true,
                gestureHandling: 'none',
                maxZoom: 23,
              }
            : { disableDefaultUI: true, mapTypeId: 'hybrid', labels: true }
        }
        onLoad={(map) => {
          if (debug > 0) console.log('Map/onLoad: ', configStatus, map, lat);
          //if (configStatus < 3) {
          setMaps(map);
          onMapLoad(map);
          //}
        }}
        onDragEnd={() => {
          dispatch(setLng(maps?.center?.lng()));
          dispatch(setLat(maps?.center?.lat()));
        }}
        onZoomChanged={() => {
          if (debug > 2) console.log('onZoomChanged: ', maps);
          maps && dispatch(setZoom(maps?.getZoom()));
          //setLng(maps?.center?.lng());
          //setLat(maps?.center?.lat());
        }}
      ></GoogleMap>
      {configStatus === 1 && (
        <Location className="location d-flex flex-column justify-content-center align-items-center">
          <input
            className="w-75 mb-5"
            colors={colors}
            id="search-box"
            type="text"
            placeholder="Bitte geben Sie den Anlagenstandort (inkl. PLZ) ein."
            onChange={(e) => setPlz(e.target.value)}
          />
        </Location>
      )}
      {boolOverlayGoogleDraw && (
        <OverlayGoogleDraw
          map={maps}
          configStatus={configStatus}
          setConfigStatus={setConfigStatus}
          deltaX={deltaX}
          setDeltaX={setDeltaX}
          deltaY={deltaY}
          setDeltaY={setDeltaY}
          currPoly={currPoly}
          setCurrPoly={setCurrPoly}
          middlePoints={middlePoints}
          setMiddlePoints={setMiddlePoints}
        />
      )}
      {boolOverlayUserControl && (
        <OverlayUserControl className="user-control d-flex flex-column justify-content-between align-items-start">
          <p className="bold">
            {configStatus === 2 &&
              'Bitte wählen Sie die genaue Objektfläche aus (mit Scrollen und Verschieben).'}
            {configStatus === 3 &&
              'Bitte markieren Sie mit dem Cursor die Eckpunkte der relevanten Fläche.'}
            {configStatus === 4 && 'Bitte markieren Sie den Dachfirst'}
            {configStatus === 5 && 'Bitte geben Sie die Dachschräge ein (typ. 30°).'}
            {configStatus === 6 &&
              'Bitte die PV Fläche mit dem Cursortool feinjustieren. Die überflüssigen Module können per Click abgewählt werden.'}
          </p>
          <div className="d-flex flex-row w-100 justify-content-center align-items-center">
            {configStatus === 5 && (
              <Numberfield
                className="mr-2"
                min={0}
                max={60}
                value={slope}
                unit={'°'}
                onChange={(val) => {
                  val === 'up'
                    ? dispatch(setSlope(slope + 1))
                    : val === 'down'
                    ? dispatch(setSlope(slope - 1))
                    : dispatch(setSlope(val));
                }}
                colors={colors}
              />
            )}
            {configStatus === 6 && (
              <MoveTool
                colors={colors}
                setDeltaX={(val) => {
                  setDeltaX(deltaX + val);
                }}
                setDeltaY={(val) => {
                  setDeltaY(deltaY + val);
                }}
              />
            )}
            {boolOverlayUserCtrlBtn && (
              <button
                className="btn smll sandyBrown w-100"
                onClick={() => {
                  setConfigStatus(configStatus + 1);
                  dispatch(setZoom(maps?.getZoom()));
                }}
                disabled={!(plz !== '')}
              >
                Weiter
              </button>
            )}
          </div>
        </OverlayUserControl>
      )}
    </MapContainer>
  );
};

export default Map;

const MapContainer = styled.div`
  width: 500px;
  height: 500px;
  position: relative;
`;

const googleMapStyle = {
  width: 'inherit',
  height: 'inherit',
  borderRadius: '15px 15px 0px 15px',
  position: 'absolute',
};

const Location = styled.div`
  width: inherit;
  height: inherit;
  position: absolute;
`;

const OverlayUserControl = styled.div`
  position: absolute;
  width: inherit;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px 25px;

  p {
    margin-bottom: 8px;
  }

  button {
    margin-left: 16px;
  }
`;
