import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setCornerPointsLatLng,
  setSideLen,
  //setCurrPoly,
  //setSelectedShape,
  setArea,
  //setCornerPoints,
  //setMiddlePoints,
  setCentrePoint,
} from '../store/mapSlices';
import { setRoofDirect, setPanelNo } from '../store/objectSlices';
import { useLocation } from 'react-router-dom';

//var drawingManager;
//var overlay;
var selectedShape;
var lineArr = [];

const OverlayGoogleDraw = ({
  map,
  configStatus,
  setConfigStatus,
  deltaX,
  setDeltaX,
  deltaY,
  setDeltaY,
  currPoly,
  setCurrPoly /* slope */,
  middlePoints,
  setMiddlePoints,
}) => {
  const dispatch = useAppDispatch();
  let location = useLocation();
  const [locDeltaX, setLocDeltaX] = useState(deltaX);
  const [locDeltaY, setLocDeltaY] = useState(deltaY);
  //const [selectedShape, setSelectedShape] = useState();
  //const [middlePoints, setMiddlePoints] = useState();
  const [cornerPoints, setCornerPoints] = useState();
  const [drawingManager, setDrawingManager] = useState();
  const [overlay, setOverlay] = useState();

  // global pvModuleData
  let moduleHeight = useAppSelector((state) => state.pvModuleData.moduleHeight);
  let moduleWidth = useAppSelector((state) => state.pvModuleData.moduleWidth);
  // global mapData
  let sideLen = useAppSelector((state) => state.mapData.sideLen);
  let cornerPointsLatLng = useAppSelector((state) => state.mapData.cornerPointsLatLng);
  //let currPoly = useAppSelector((state) => state.mapData.currPoly);
  let area = useAppSelector((state) => state.mapData.area);
  //let cornerPoints = useAppSelector((state) => state.mapData.cornerPoints);
  //let middlePoints = useAppSelector((state) => state.mapData.middlePoints);
  let centrePoint = useAppSelector((state) => state.mapData.centrePoint);
  // global objectData
  let slope = useAppSelector((state) => state.objectData.slope);

  const pvHeight = moduleHeight * Math.cos((slope * Math.PI) / 180);
  const pvWidth = moduleWidth;
  const debug = 1;

  useEffect(() => {
    if (debug > 3) console.log('OGD/useEffect/location: ', location);
    // on page change --> drawModules before render
    setLocDeltaX(locDeltaX + 0.1);
  }, [location]);

  useEffect(() => {
    var __overlay;
    if (debug > 3) console.log('OGD/useEffect/configStatus: ', configStatus);
    if (configStatus === 1) {
      setCurrPoly();
      setDeltaX(0);
      setDeltaY(0);
      setLocDeltaX(0);
      setLocDeltaY(0);
    } else if (configStatus === 3) {
      if (debug > 0) console.log('OGD/useEffect/configStat=3: ', drawingManager, map, currPoly);
      // Reset Modul Placement
      setCurrPoly();
      setDeltaX(0);
      setDeltaY(0);
      setLocDeltaX(0);
      setLocDeltaY(0);
      // Reset drawn shapes and drawing manager
      deleteDrawingManager(drawingManager);
      clearSelectedShape();
      deleteLines();
      deleteModules(currPoly);

      var __drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
        drawingControl: false,
        //map: map,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.BOTTOM_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
        },

        polygonOptions: {
          strokeColor: '#008840',
          strokeWeight: 2,
          fillColor: '#00ff80',
          fillOpacity: 0.3,
          editable: false,
        },
      });

      __drawingManager.setMap(map);
      setDrawingManager(__drawingManager);

      __overlay = new window.google.maps.OverlayView();
      __overlay.draw = function () {};
      __overlay.setMap(map);

      window.google.maps.event.addListener(__drawingManager, 'overlaycomplete', (event) => {
        if (debug > 0)
          console.log('OGD/useEffect/onCompleteListener: ', event, __drawingManager, __overlay);
        // Switch back to non-drawing mode after drawing a shape.
        __drawingManager.setDrawingMode(null);
        //__drawManag.setOptions();
        // Add an event listener that selects the newly-drawn shape when the user
        // mouses down on it.
        var __newShape = event.overlay;
        __newShape.type = event.type;
        selectedShape = __newShape;
        //window.google.maps.event.addListener(elem, 'load', function () {
        //  console.log('addEvList/load PV Konfig', elem);
        //  setSelection(newShape);
        //});
        onOverlayComplete(event, map, __overlay);
        //setSelection(event, newShape);
        setConfigStatus(configStatus + 1);
      });
    } else if (configStatus === 6) {
      if (debug > 0) console.log('OGD/useEffect/configStat=6: ', currPoly);
      if (debug > 3) console.log('OGD/useEffect/configStat=6: ', sideLen, pvHeight, pvWidth);
      // Reset drawn shapes and drawing manager
      deleteDrawingManager(drawingManager);
      __overlay = overlay;
      __overlay = null;
      setOverlay(__overlay);
      clearSelectedShape();
      deleteLines();
      deleteModules(currPoly);

      // draw modules
      drawModules(sideLen, pvHeight, pvWidth, cornerPointsLatLng, deltaX, deltaY, map);
    }

    return () => {
      if (debug > 0) console.log('OGD/useEffect/exit');
      //deleteModules();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configStatus]);

  // METHODS
  const reDrawModules = (__currPoly, __map) => {
    if (debug > 0) console.log('OGD/reDrawModules: ', __currPoly);
    for (let i = 0; i < __currPoly.length; i++) {
      for (let j = 0; j < __currPoly[0].length; j++) {
        __currPoly[i][j].setMap(null);
        __currPoly[i][j].setMap(__map);
      }
    }
  };

  const drawModules = (
    __sideLen,
    __pvHeight,
    __pvWidth,
    __cornerPtLatLng,
    __deltaX,
    __deltaY,
    __map
  ) => {
    if (debug > 3) {
      console.log(
        'OGD/drawModules/sideLen: ',
        __sideLen,
        __pvWidth,
        __pvHeight,
        __cornerPtLatLng,
        __deltaX,
        __deltaY,
        __map
      );
    }

    // Module auf Längsseite / Querseite
    var __countX = Math.round(__sideLen[0] / __pvWidth, 0);
    var __countY = Math.round(__sideLen[3] / __pvHeight, 0);
    // Anzahl an Module speichern
    dispatch(setPanelNo(__countX * __countY));

    // Direction in °
    // PVGIS: 90°: W; 0°: S; -90°: O
    // Maps: 0°/-0°: N; 90°: O; 180°/-180°: S; -90°: W
    var __dirRidgeMaps = window.google.maps.geometry.spherical.computeHeading(
      __cornerPtLatLng[0],
      __cornerPtLatLng[1]
    );
    var __dirModMaps = window.google.maps.geometry.spherical.computeHeading(
      __cornerPtLatLng[1],
      __cornerPtLatLng[2]
    );
    var __dirPVGIS = calcDirPVGIS(__dirRidgeMaps, __dirModMaps);

    // save roof direction
    dispatch(setRoofDirect(Math.round(__dirPVGIS)));

    // recalc to Maps
    var __dirMaps = PVGIS2Maps(__dirPVGIS);
    //var __dirRidgeMaps = PVGIS2Maps(__dirRidgePVGIS);

    if (debug > 0)
      console.log(
        'OGD/drawModules/2: ',
        __countX,
        __countY,
        __dirRidgeMaps,
        __dirModMaps,
        __dirPVGIS,
        __dirMaps
      );

    // delta zum pt0 bestimmen
    var __pt0 = __cornerPtLatLng[0];
    // In case of deltaX/deltaY --> recalculate pt0
    if (__deltaX !== 0 || __deltaY !== 0) {
      var __pt_x = window.google.maps.geometry.spherical.computeOffset(__pt0, __deltaX * 0.5, 180);
      var __pt_y = window.google.maps.geometry.spherical.computeOffset(__pt0, __deltaY * 0.5, 90);
      __pt0 = { lat: __pt_x.lat(), lng: __pt_y.lng() };
    }
    if (debug > 3) console.log('OGD/drawModules/3: ', __cornerPtLatLng[0], __pt0);
    // Module zeichnen
    var __pt_next_row;
    var __pv = Array(__countY)
      .fill()
      .map(() => Array(__countX));

    for (let i = 0; i < __countY; i++) {
      for (let j = 0; j < __countX; j++) {
        var __pt1 = window.google.maps.geometry.spherical.computeOffset(
          __pt0,
          __pvWidth,
          __dirRidgeMaps
        );
        __pt1 = { lat: __pt1.lat(), lng: __pt1.lng() };
        var __pt2 = window.google.maps.geometry.spherical.computeOffset(__pt1, __pvHeight, __dirMaps);
        __pt2 = { lat: __pt2.lat(), lng: __pt2.lng() };
        var __pt3 = window.google.maps.geometry.spherical.computeOffset(__pt0, __pvHeight, __dirMaps);
        __pt3 = { lat: __pt3.lat(), lng: __pt3.lng() };

        if (debug > 3) console.log('OGD/drawModules/pts: ', __pt0, __pt1, __pt2, __pt3);

        __pv[i][j] = new window.google.maps.Polygon({
          paths: [__pt0, __pt1, __pt2, __pt3],
          strokeColor: '#20212C',
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: '#20212C',
          fillOpacity: 0.75,
        });
        __pv[i][j].setMap(null);
        __pv[i][j].setMap(__map);
        addListenersOnPolygon(__pv, __map, i, j);
        __pt0 = __pt1;
        if (j === 0) __pt_next_row = __pt3;

        if (debug > 3) console.log('OGD/drawModules/pv: ', __pv[i][j]);
      }
      __pt0 = __pt_next_row;
    }
    setCurrPoly(__pv);
  };

  const PVGIS2Maps = (__dirPVGIS) => {
    // Direction in °
    // PVGIS: 90°: W; 0°: S; -90°: O
    // Maps: 0°/-0°: N; 90°: O; 180°/-180°: S; -90°: W
    if (__dirPVGIS < 0) {
      return 180 + __dirPVGIS;
    } else {
      return -180 + __dirPVGIS;
    }
  };

  const maps2PVGIS = (__dirMaps) => {
    // Direction in °
    // PVGIS: 90°: W; 0°: S; -90°: O
    // Maps: 0°/-0°: N; 90°: O; 180°/-180°: S; -90°: W
    if (__dirMaps < 0) {
      return 180 + __dirMaps;
    } else {
      return -180 + __dirMaps;
    }
  };

  const calcDirPVGIS = (__dirRidge, __dirMod) => {
    // Calculate direction of roof / recalulate from google to PVGIS
    // Direction in °
    // PVGIS: 90°: W; 0°: S; -90°: O
    // Maps: 0°/-0°: N; 90°: O; 180°/-180°: S; -90°: W
    var __dir;

    if (__dirRidge <= -90) {
      if (__dirMod >= 0) {
        __dir = 90 + __dirRidge;
      } else {
        __dir = 270 + __dirRidge;
      }
    } else if (__dirRidge > -90 && __dirRidge <= 0) {
      if (__dirMod >= 0) {
        __dir = -90 + __dirRidge;
      } else {
        __dir = 90 + __dirRidge;
      }
    } else if (__dirRidge <= 90 && __dirRidge > 0) {
      if (__dirMod >= 0) {
        __dir = __dirRidge - 90;
      } else {
        __dir = __dirRidge + 90;
      }
    } else if (__dirRidge > 90) {
      if (__dirMod >= 0) {
        __dir = -270 + __dirRidge;
      } else {
        __dir = __dirRidge - 90;
      }
    }

    return __dir;
  };
  const addListenersOnPolygon = (p, map, i, j) => {
    window.google.maps.event.addListener(p[i][j], 'click', (event) => {
      if (debug > 2) console.log('OGD/addListenersOnPolygon: ', p, p[i][j].strokeOpacity, i, j);
      //var visible;
      if (p[i][j].strokeOpacity !== 0) {
        p[i][j].setOptions({
          visible: true,
          strokeOpacity: 0,
          fillOpacity: 0,
        });
        p[i][j].setMap(map);
        if (debug > 2) console.log('OGD/addListenersOnPolygon/hide: ', p[i][j].strokeOpacity);
      } else {
        p[i][j].setOptions({
          visible: true,
          strokeOpacity: 1,
          fillOpacity: 1,
        });
        p[i][j].setMap(map);
        if (debug > 3) console.log('OGD/addListenersOnPolygon/show: ', p[i][j].strokeOpacity);
      }
      if (debug > 2) console.log('OGD/addListenersOnPolygon/pv: ', p);
      var count = 0;
      for (let i = 0; i < p.length; i++) {
        for (let j = 0; j < p[0].length; j++) {
          if (p[i][j].strokeOpacity === 1) count++;
        }
      }
      dispatch(setPanelNo(count));
    });
  };

  /*   const setSelection = (e, shape) => {
    if (debug > 3) console.log('OGD/setSelection');
    //setSelectedShape(shape);
    shape.setEditable(true);
    //selectColor(shape.get('fillColor') || shape.get('strokeColor'));
    window.google.maps.event.addListener(shape.getPath(), 'set_at', () => onOverlayComplete(e, map));
    window.google.maps.event.addListener(shape.getPath(), 'insert_at', () => onOverlayComplete(e, map));
  }; */

  const clearSelectedShape = () => {
    if (selectedShape) {
      selectedShape.setEditable(false);
      selectedShape.setMap(null);
      selectedShape = null;
    }
  };

  const deleteModules = (__currPoly) => {
    if (debug > 3) console.log('OGD/deleteModules: ', __currPoly);
    if (__currPoly) {
      for (let i = 0; i < __currPoly.length; i++) {
        for (let j = 0; j < __currPoly[0].length; j++) {
          __currPoly[i][j].setMap(null);
        }
      }
      //setCurrPoly(__currPoly);
    }
  };

  const deleteDrawingManager = (__drawingManager) => {
    if (debug > 3) console.log('OGD/deleteDrawingManager');
    if (__drawingManager) {
      __drawingManager.setMap(null);
      setDrawingManager(__drawingManager);
    }
  };

  const deleteLines = () => {
    for (let __i = 0; __i < lineArr.length; __i++) {
      lineArr[__i].setMap(null);
    }
  };

  const drawLines = (__map, __arr) => {
    if (debug > 0) console.log('OGD/draw lines');
    // __arr corresponds with cornerPointsLatLng
    // Identify number of lines
    lineArr = [];
    for (let __i = 0; __i < __arr.length; __i++) {
      var __j;
      // Go through all points, last one is '0' again
      if (__i === __arr.length - 1) {
        __j = 0;
      } else {
        __j = __i + 1;
      }
      // set line coordinates and line configuration
      const __points = [
        { lat: __arr[__i].lat, lng: __arr[__i].lng },
        { lat: __arr[__j].lat, lng: __arr[__j].lng },
      ];
      const __line = new window.google.maps.Polyline({
        path: __points,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 4,
        editable: false,
        zIndex: 5,
      });
      // draw line
      __line.setMap(__map);
      lineArr.push(__line);
      // add listener on line
      addListenerOnLine(__line, __map, __arr);
    }
  };

  const addListenerOnLine = (__line, __map, __cornerPointsLatLng) => {
    window.google.maps.event.addListener(__line, 'click', (__map) => {
      if (debug > 0) console.log('addEvList/line: ', __line, __map, __cornerPointsLatLng);
      __line.setEditable(true);
      __line.set('strokeColor', '#1e34ff');
      __line.set('strokeOpacity', 1);

      // recalculate and update global cornerPointsLatLng
      var __lineArr = __line.getPath().getArray();
      var __linePt0;
      var __linePt1;
      var __linePt2;
      var __linePt3;

      if (__lineArr[0].lng() < __lineArr[1].lng()) {
        __linePt0 = { lat: __lineArr[0].lat(), lng: __lineArr[0].lng() };
        __linePt1 = { lat: __lineArr[1].lat(), lng: __lineArr[1].lng() };
      } else {
        __linePt1 = { lat: __lineArr[0].lat(), lng: __lineArr[0].lng() };
        __linePt0 = { lat: __lineArr[1].lat(), lng: __lineArr[1].lng() };
      }

      if (debug > 3) console.log('addEvList/line pt0/pt1: ', __linePt0, __linePt1);

      var __othLineArr = __cornerPointsLatLng.filter((__point) => {
        //__point = { lat: __point.lat(), lng: __point.lng() };
        var _check1 = __point.lng !== __linePt0.lng && __point.lat !== __linePt0.lat;
        var _check2 = __point.lng !== __linePt1.lng && __point.lat !== __linePt1.lat;
        return _check1 && _check2;
      });

      if (__othLineArr[0].lng < __othLineArr[1].lng) {
        __linePt3 = __othLineArr[0];
        __linePt2 = __othLineArr[1];
      } else {
        __linePt2 = __othLineArr[0];
        __linePt3 = __othLineArr[1];
      }

      if (debug > 3) console.log('addEvList/line othPts: ', __othLineArr); //__linePt2, __linePt3);
      if (debug > 3) console.log('addEvList/line all: ', __linePt0, __linePt1, __linePt2, __linePt3);
      setCornerPointsLatLng([__linePt0, __linePt1, __linePt2, __linePt3]);

      // go to next step
      setConfigStatus(5);
    });
  };

  const onOverlayComplete = (__event, __map, __overlay) => {
    // load path from drawn overlay
    var __arr = __event.overlay.getPath().getArray();
    if (debug > 0)
      console.log(
        'OGD/onOverlayComplete: ',
        __arr,
        __overlay.getProjection().fromLatLngToContainerPixel(__arr[0]),
        __overlay.getProjection().fromLatLngToDivPixel(__arr[0])
      );
    // extract LatLng coordinates of array
    __arr = __arr.map((__point) => {
      return { lat: __point.lat(), lng: __point.lng() };
    });
    // draw each line of the polygon with separate line for identification of focus line
    drawLines(__map, __arr);

    if (debug > 0) console.log('OGD/onOverlayComplete/Arr: ', __arr);
    // store corner points in LatLng writing style
    dispatch(setCornerPointsLatLng(__arr));
    // store and calculate side length
    calcSideLen(__arr);
    // store and calculate area from selectedArea
    calcSelArea(__arr);
    // store and calculate points in window px coordinates
    calcLatLng2Px(__arr, __overlay);
  };

  const calcSideLen = (arr) => {
    if (debug > 3) console.log('OGD/calcSideLen: ', arr);
    var len = [];

    for (let i = 1; i < arr.length; i++) {
      len.push(
        window.google.maps.geometry.spherical.computeDistanceBetween(arr[i], arr[i - 1]).toFixed(1)
      );
    }
    len.push(
      window.google.maps.geometry.spherical
        .computeDistanceBetween(arr[0], arr[arr.length - 1])
        .toFixed(1)
    );
    dispatch(setSideLen(len));
  };

  const calcSelArea = (arr) => {
    if (debug > 3) console.log('OGD/calcSelArea: ', arr);
    var calcarea = window.google.maps.geometry.spherical.computeArea(arr).toFixed(1);
    dispatch(setArea(calcarea));
  };

  const calcLatLng2Px = (__arr, __overlay) => {
    if (debug > 3) console.log('OGD/calcLatLng2Px: ', __arr, __overlay);
    var __arr2 = [];
    // calculate middle points in latlng writing style
    for (let __i = 1; __i < __arr.length; __i++) {
      __arr2.push({
        lat: (__arr[__i].lat + __arr[__i - 1].lat) / 2,
        lng: (__arr[__i].lng + __arr[__i - 1].lng) / 2,
      });
    }
    __arr2.push({
      lat: (__arr[0].lat + __arr[__arr.length - 1].lat) / 2,
      lng: (__arr[0].lng + __arr[__arr.length - 1].lng) / 2,
    });

    // calculate corner points in px writing style
    var __cornerPoints = __arr.map((__latlng) => {
      //return __overlay.getProjection().fromLatLngToContainerPixel(__latlng);
      var __pts = __overlay.getProjection().fromLatLngToDivPixel(__latlng);
      return { x: __pts.x + 250, y: __pts.y + 250 };
    });
    if (debug > 3) console.log('OGD/calcLatLng2Px: ', __arr, __overlay, __cornerPoints);
    setCornerPoints(__cornerPoints);

    // calculate middle points in px writing style
    var __middlePoints = __arr2.map((__latlng) => {
      //return __overlay.getProjection().fromLatLngToContainerPixel(__latlng);
      var __pts = __overlay.getProjection().fromLatLngToDivPixel(__latlng);
      return { x: __pts.x + 250, y: __pts.y + 250 };
    });
    setMiddlePoints(__middlePoints);

    // calculate center in px writing style
    var __center = __cornerPoints.reduce((__total, __curr) => {
      return { x: __total.x + __curr.x, y: __total.y + __curr.y };
    });
    dispatch(
      setCentrePoint({ x: __center.x / __cornerPoints.length, y: __center.y / __cornerPoints.length })
    );
  };

  // Queries
  if (debug > 3) console.log('OGD/before render: ', drawingManager, location);
  if (deltaX !== locDeltaX || deltaY !== locDeltaY) {
    //if (configStatus === 6) {
    // if modules were moved, ....
    // 1) save new deltaX/deltaY
    // 2) delete existing Modules and redraw Modules

    setLocDeltaX(deltaX);
    setLocDeltaY(deltaY);
    deleteModules(currPoly);
    drawModules(sideLen, pvHeight, pvWidth, cornerPointsLatLng, deltaX, deltaY, map);
  }
  //else if (currPoly?.length > 0) {
  //  deleteModules(currPoly);
  //  eDrawModules(currPoly, map);
  // }

  if (drawingManager) {
    drawingManager.setMap(null);
    drawingManager.setMap(map);
  }

  return (
    <>
      {(configStatus === 4 || configStatus === 5) && (
        <OverlayBody id="overlay-body">
          {middlePoints?.map((pt, i) => {
            return (
              <p className="small" style={{ left: pt.x, top: pt.y }} key={i}>
                {sideLen[i]}m
              </p>
            );
          })}
          <p className="small" style={{ left: centrePoint?.x, top: centrePoint?.y }}>
            {area !== '' && `${area}m²`}
          </p>
        </OverlayBody>
      )}
    </>
  );
};

export default OverlayGoogleDraw;

const OverlayBody = styled.div`
  position: absolute;
  background-color: rgba(25, 45, 165, 0.5);

  p {
    position: absolute;
  }
`;
