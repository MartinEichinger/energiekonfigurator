import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getData } from './api';
import { useAppDispatch, useAppSelector } from './hooks';
import currLoadProfileData from './data/current_load_profile.json';
import getDayOfYear from '../util/util';

const debug = 1;

// initial state
const initialState = {
  loadingPowerStorageData: false,
  usePowerStorage: false,
  sizePowerStorage: 0, // kWh
  costPowerStorage: 1500, // €/kWh; 700€ - 2400€/kWh + 250€/kWh
};

// create slice
export const slice = createSlice({
  name: 'powerStorageData',
  initialState,
  reducers: {
    // onStart //
    powerStorageDataRequested: (state, action) => {
      if (debug > 0) console.log('powerStorageDataRequested/Payload: ', action.payload);
      state.loadingPowerStorageData = true;
    },

    // onSuccess //
    powerStorageDataReceived: (state, action) => {
      if (debug > 0) console.log('powerStorageData/dataReceived: ', action);
      var addObj = action.payload;

      if (action.payload.hasOwnProperty('sizePowerStorage')) {
        state.sizePowerStorage = addObj.sizePowerStorage;
      } else if (action.payload.hasOwnProperty('usePowerStorage')) {
        state.usePowerStorage = addObj.usePowerStorage;
      }
    },

    // onError //
    powerStorageDataRequestFailed: (state) => {
      state.loadingPowerStorageData = false;
    },
  },
});

// export reducer
export default slice.reducer;

// export actions
export const { powerStorageDataRequested, powerStorageDataReceived, powerStorageDataRequestFailed } =
  slice.actions;

// export action creators
export const setUsePowerStorage = (data) => async (dispatch) => {
  console.log('powerStorageData/setUsePowerStorage', data);
  dispatch(powerStorageDataRequested());

  try {
    dispatch(powerStorageDataReceived({ usePowerStorage: data }));
  } catch (e) {
    console.error(e);
  }
};

export const setPowerStorageSize = (__input) => async (dispatch, getState) => {
  console.log('powerStorageData/setPowerStorageSize', __input);
  dispatch(powerStorageDataRequested());

  try {
    dispatch(powerStorageDataReceived(__input));
  } catch (e) {
    console.error(e);
  }
};

//setLivingSpaceArea;
