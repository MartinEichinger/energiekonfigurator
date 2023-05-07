import { createSlice } from '@reduxjs/toolkit';
import { getData } from './api';
import { useAppDispatch, useAppSelector } from './hooks';
import heatLoadProfileData from './data/heating_load_profile.json';
import getDayOfYear from '../util/util';

const debug = 1;

// initial state
const initialState = {
  loadingHeatProfilData: false,
  withHP: 1,
  noPerson: 1,
  specHeatNeed: 120, // kWh/m2a
  livingSpaceArea: 50, // m2
  heatPumpKeyFigure: 3.5,
  heatPowerCosts: 40, // ct/kWh
  actHeatNeed: 0,
  typHotWaterNeed: 0,
  typServiceWaterNeed: 0,
  dayWaterNeedPerson: 0,
  dayWaterNeedKitchen: 0,
  dayWaterNeedAppliance: 0,
  deltaWarmWaterTemp: 0,
  heatLoss: 0,
  globTimeHour: [],
  globTimeDay: [],
  globTimeMonth: [],
  heatProfilHour: [],
  heatProfilDay: [],
  heatProfilMonth: [],
  heatCurrProfilHour: [],
  heatCurrProfilDay: [],
  heatCurrProfilMonth: [],
};

// create slice
export const slice = createSlice({
  name: 'heatProfilData',
  initialState,
  reducers: {
    // onStart //
    heatProfilDataRequested: (state, action) => {
      if (debug > 0) console.log('heatProfilDataRequested/Payload: ', action.payload);
      state.loadingHeatProfilData = true;
    },

    // onSuccess //
    heatProfilDataReceived: (state, action) => {
      if (debug > 0) console.log('heatProfilDataReceived/Payload: ', action);
      var addObj = action.payload;

      if (action.payload.hasOwnProperty('noPerson')) {
        state.noPerson = action.payload.noPerson;
      } else if (action.payload.hasOwnProperty('livingSpaceArea')) {
        state.livingSpaceArea = action.payload.livingSpaceArea;
      } else if (action.payload.hasOwnProperty('specHeatNeed')) {
        state.specHeatNeed = action.payload.specHeatNeed;
      } else if (action.payload.hasOwnProperty('heatPowerCosts')) {
        state.heatPowerCosts = action.payload.heatPowerCosts;
      } else if (action.payload.hasOwnProperty('dayWaterNeedPerson')) {
        state.dayWaterNeedPerson = action.payload.dayWaterNeedPerson.val;
      } else if (action.payload.hasOwnProperty('dayWaterNeedKitchen')) {
        state.dayWaterNeedKitchen = action.payload.dayWaterNeedKitchen.val;
      } else if (action.payload.hasOwnProperty('dayWaterNeedAppliance')) {
        state.dayWaterNeedAppliance = action.payload.dayWaterNeedAppliance.val;
      } else if (action.payload.hasOwnProperty('deltaWarmWaterTemp')) {
        state.deltaWarmWaterTemp = action.payload.deltaWarmWaterTemp.val;
      } else if (action.payload.hasOwnProperty('heatLoss')) {
        state.heatLoss = action.payload.heatLoss.val;
      } else if (action.payload.hasOwnProperty('hour')) {
        // Write hourly data to arrays
        var __globTimeHour = [];
        var __heatProfilHour = [];

        __globTimeHour = Object.keys(addObj.hour);
        __heatProfilHour = Object.values(addObj.hour);

        state.globTimeHour = __globTimeHour;
        state.heatProfilHour = __heatProfilHour;

        var testresult = __heatProfilHour?.reduce((acc, val) => acc + val);
        if (debug > 0) console.log('hour: ', testresult);
      } else if (action.payload.hasOwnProperty('day')) {
        // Write daily data to arrays
        var __globTimeDay = [];
        var __heatProfilDay = [];

        __globTimeDay = Array.from({ length: 365 }, (_, i) => i + 1);
        __heatProfilDay = Object.values(addObj.day);

        state.globTimeDay = __globTimeDay;
        state.heatProfilDay = __heatProfilDay;

        var testresult = __heatProfilDay?.reduce((acc, val) => acc + val);
        if (debug > 0) console.log('hour: ', testresult);
      } else if (action.payload.hasOwnProperty('month')) {
        // Write monthly data to arrays
        var __globTimeMonth = [];
        var __heatProfilMonth = [];

        __globTimeMonth = Array.from({ length: 12 }, (_, i) => i + 1);
        __heatProfilMonth = Object.values(addObj.month);

        state.globTimeMonth = __globTimeMonth;
        state.heatProfilMonth = __heatProfilMonth;
      }

      state.typHotWaterNeed = state.specHeatNeed * state.livingSpaceArea;

      state.typServiceWaterNeed =
        state.noPerson *
          state.dayWaterNeedPerson *
          state.deltaWarmWaterTemp *
          0.001163 *
          365 *
          (1 + state.heatLoss / 100) +
        state.dayWaterNeedKitchen * state.deltaWarmWaterTemp * 0.001163 * 365 +
        state.dayWaterNeedAppliance * state.deltaWarmWaterTemp * 0.001163 * 365;

      console.log(
        state.typHotWaterNeed,
        state.typServiceWaterNeed,
        state.typHotWaterNeed / 1000 + state.typServiceWaterNeed / 12
      );
      state.heatCurrProfilHour = state.heatProfilHour.map(
        (val) =>
          (((val * state.typHotWaterNeed) / 1000 + state.typServiceWaterNeed / 8760) /
            state.heatPumpKeyFigure) *
          state.withHP
      );
      state.heatCurrProfilDay = state.heatProfilDay.map(
        (val) =>
          (((val * state.typHotWaterNeed) / 1000 + state.typServiceWaterNeed / 365) /
            state.heatPumpKeyFigure) *
          state.withHP
      );
      state.heatCurrProfilMonth = state.heatProfilMonth.map(
        (val) =>
          (((val * state.typHotWaterNeed) / 1000 + state.typServiceWaterNeed / 12) /
            state.heatPumpKeyFigure) *
          state.withHP
      );
    },

    // onError //
    heatProfilDataRequestFailed: (state) => {
      state.loadingHeatProfilData = false;
    },
  },
});

// export reducer
export default slice.reducer;

// export actions
export const { heatProfilDataRequested, heatProfilDataReceived, heatProfilDataRequestFailed } =
  slice.actions;

// export action creators
export const getHeatProfilData = () => async (dispatch) => {
  if (debug > 0) console.log('heatProfilData/getHeatProfilData', heatLoadProfileData);
  dispatch(heatProfilDataRequested());

  try {
    for (const obj in heatLoadProfileData) {
      console.log(obj, heatLoadProfileData[obj]);
      dispatch(heatProfilDataReceived({ [obj]: heatLoadProfileData[obj] }));
    }
    //dispatch(heatProfilDataReceived(heatLoadProfileData));
  } catch (e) {
    console.error(e);
  }
};

export const calcAllocConsumpFeed = () => async (dispatch, getState) => {};

export const setHeatProfilProps = (data) => async (dispatch) => {
  if (debug > 0) console.log('heatProfilData/setHeatProfilProps', data);
  dispatch(heatProfilDataRequested());

  try {
    dispatch(heatProfilDataReceived(data));
  } catch (e) {
    console.error(e);
  }
};

//setLivingSpaceArea;
