import { createSlice } from '@reduxjs/toolkit';
import { getData } from './api';

const debug = 1;

// initial state
const initialState = {
  loadingPVModuleData: false,
  moduleName: 'Standardmodul',
  modulePower: 375,
  moduleHeight: 1.65,
  moduleWidth: 1.0,
};

// create slice
export const slice = createSlice({
  name: 'pvModuleData',
  initialState,
  reducers: {
    // onStart //
    pvModuleDataRequested: (state, action) => {
      if (debug > 0) console.log('pvModuleDataRequested/Payload: ', action.payload);
      state.loadingPVModuleData = true;
    },

    // onSuccess //
    pvModuleDataReceived: (state, action) => {
      if (debug > 0) console.log('pvModuleData/dataReceived: ', action);
      var addObj = action.payload;

      state.moduleName = addObj.name;
      state.modulePower = addObj.power;
      state.moduleHeight = addObj.height;
      state.moduleWidth = addObj.width;

      state.loadingPVModuleData = false;
    },

    // onError //
    pvModuleDataRequestFailed: (state) => {
      if (debug > 0) console.log('pvModuleData/Request failed');
      state.loadingPVModuleData = false;
    },
  },
});

// export reducer
export default slice.reducer;

// export actions
export const { pvModuleDataRequested, pvModuleDataReceived, pvModuleDataRequestFailed } = slice.actions;

// export action creators
export const setPVModuleData =
  ({ name, power, height, width }) =>
  async (dispatch) => {
    dispatch(pvModuleDataRequested());

    dispatch(pvModuleDataReceived({ name, power, height, width }));
  };
