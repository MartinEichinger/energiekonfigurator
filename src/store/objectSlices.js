import { createSlice } from '@reduxjs/toolkit';

const debug = 0;

// initial state
const initialState = {
  loadingObjectData: false,
  lng: 11.58,
  lat: 48.13,
  slope: 30,
  azimuth: 0, // Ost: -90°, Süd: 0°, West: 90°
  compass: 'S',
  roofType: '-',
  panelNo: 0,
};

// create slice
export const slice = createSlice({
  name: 'objectData',
  initialState,
  reducers: {
    // onStart //
    objectDataRequested: (state) => {
      if (debug > 0) console.log('objectData/dataRequested');
      state.loadingMapData = true;
    },

    // onSuccess //
    objectDataReceived: (state, action) => {
      if (debug > 0) console.log('objectData/dataReceived: ', action);
      var addObj = action.payload;

      if (addObj.lng) state.lng = addObj.lng;
      if (addObj.lat) state.lat = addObj.lat;
      if (addObj.slope) state.slope = addObj.slope;
      if (addObj.azimuth) {
        state.azimuth = addObj.azimuth; // - 180;
        if (addObj.azimuth < -157.5) {
          state.compass = 'N';
        } else if (addObj.azimuth < -112.5) {
          state.compass = 'NO';
        } else if (addObj.azimuth < -67.5) {
          state.compass = 'O';
        } else if (addObj.azimuth < -22.5) {
          state.compass = 'SO';
        } else if (addObj.azimuth < 22.5) {
          state.compass = 'S';
        } else if (addObj.azimuth < 67.5) {
          state.compass = 'SW';
        } else if (addObj.azimuth < 122.5) {
          state.compass = 'W';
        } else if (addObj.azimuth < 157.5) {
          state.compass = 'NW';
        } else {
          state.compass = 'N';
        }
      }
      if (addObj.roofType) state.roofType = addObj.roofType;
      if (addObj.panelNo) state.panelNo = addObj.panelNo;

      state.loadingMapData = false;
      if (debug > 0) console.log('objectData/dataReceived: exit');
    },

    // onError //
    objectDataRequestFailed: (state) => {
      if (debug > 0) console.log('objectData/dataRequestFailed');
      state.loadingMapData = false;
    },
  },
});

// export reducer
export default slice.reducer;

// export actions
export const { objectDataRequested, objectDataReceived, objectDataRequestFailed } = slice.actions;

// export action creators

export const setLng = (lng) => async (dispatch) => {
  dispatch(objectDataRequested());
  dispatch(objectDataReceived({ lng }));
};

export const setLat = (lat) => async (dispatch) => {
  dispatch(objectDataRequested());
  dispatch(objectDataReceived({ lat }));
};

export const setSlope = (slope) => async (dispatch) => {
  dispatch(objectDataRequested());
  dispatch(objectDataReceived({ slope }));
};

export const setRoofType = (roofType) => async (dispatch) => {
  dispatch(objectDataRequested());
  dispatch(objectDataReceived({ roofType }));
};

export const setRoofDirect = (azimuth) => async (dispatch) => {
  dispatch(objectDataRequested());
  dispatch(objectDataReceived({ azimuth }));
};

export const setPanelNo = (panelNo) => async (dispatch) => {
  if (debug > 0) console.log('objectSlices/setPanelNo: ', panelNo);
  dispatch(objectDataRequested());
  dispatch(objectDataReceived({ panelNo }));
};
