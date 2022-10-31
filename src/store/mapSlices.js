import { createSlice } from '@reduxjs/toolkit';

const debug = 0;

// initial state
const initialState = {
  loadingMapData: false,
  //map: '',
  zoom: 5,
  cornerPointsLatLng: '',
  sideLen: '',
  currPoly: '',
  selectedShape: '', //delete
  area: 0,
  cornerPoints: '', // delete
  middlePoints: '', //delete
  centrePoint: '',
};

// create slice
export const slice = createSlice({
  name: 'mapData',
  initialState,
  reducers: {
    // onStart //
    mapDataRequested: (state, action) => {
      if (debug > 0) console.log('mapData/dataRequested: ', action.payload);
      state.loadingMapData = true;
    },

    // onSuccess //
    mapDataReceived: (state, action) => {
      if (debug > 0) console.log('mapData/dataReceived: ', action);
      var addObj = action.payload;

      if (addObj.zoom) state.zoom = addObj.zoom;
      if (addObj.cornerPointsLatLng) state.cornerPointsLatLng = addObj.cornerPointsLatLng;
      if (addObj.sideLen) state.sideLen = addObj.sideLen;
      if (addObj.currPoly) state.currPoly = addObj.currPoly;
      if (addObj.selectedShape) state.selectedShape = addObj.selectedShape;
      if (addObj.area) state.area = addObj.area;
      if (addObj.cornerPoint) state.cornerPoint = addObj.cornerPoint;
      if (addObj.middlePoints) state.middlePoints = addObj.middlePoints;
      if (addObj.centrePoint) state.centrePoint = addObj.centrePoint;

      state.loadingMapData = false;
    },

    // onError //
    mapDataRequestFailed: (state) => {
      if (debug > 0) console.log('mapData/dataRequestFailed');
      state.loadingMapData = false;
    },
  },
});

// export reducer
export default slice.reducer;

// export actions
export const { mapDataRequested, mapDataReceived, mapDataRequestFailed } = slice.actions;

// export action creators
export const setCornerPointsLatLng = (cornerPointsLatLng) => async (dispatch) => {
  dispatch(mapDataRequested());
  dispatch(mapDataReceived({ cornerPointsLatLng }));
};

export const setZoom = (zoom) => async (dispatch) => {
  dispatch(mapDataRequested());
  dispatch(mapDataReceived({ zoom }));
};

export const setSideLen = (sideLen) => async (dispatch) => {
  dispatch(mapDataRequested());
  dispatch(mapDataReceived({ sideLen }));
};

export const setCurrPoly = (currPoly) => async (dispatch) => {
  dispatch(mapDataRequested());
  dispatch(mapDataReceived({ currPoly }));
};

export const setSelectedShape = (selectedShape) => async (dispatch) => {
  dispatch(mapDataRequested());
  dispatch(mapDataReceived({ selectedShape }));
};

export const setArea = (area) => async (dispatch) => {
  dispatch(mapDataRequested());
  dispatch(mapDataReceived({ area }));
};

export const setCornerPoints = (cornerPoints) => async (dispatch) => {
  dispatch(mapDataRequested());
  dispatch(mapDataReceived({ cornerPoints }));
};

export const setMiddlePoints = (middlePoints) => async (dispatch) => {
  dispatch(mapDataRequested());
  dispatch(mapDataReceived({ middlePoints }));
};
export const setCentrePoint = (centrePoint) => async (dispatch) => {
  dispatch(mapDataRequested());
  dispatch(mapDataReceived({ centrePoint }));
};
