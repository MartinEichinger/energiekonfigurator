import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getData } from './api';
import { useAppDispatch, useAppSelector } from './hooks';
import currLoadProfileData from './data/current_load_profile.json';
import getDayOfYear from '../util/util';

const debug = 0;

// initial state
const initialState = {
  loadingCurrentProfilData: false,
  globTimeHour: [],
  currProfilHour: [],
  currBattCapaHour: [],
  currConsumpHour: [],
  currConsumpDay: [],
  currConsumpMonth: [],
  currBattProvHour: [],
  currBattProvDay: [],
  currBattProvMonth: [],
  currFeedHour: [],
  currFeedDay: [],
  currFeedMonth: [],
  currPurchaseHour: [],
  currPurchaseDay: [],
  currPurchaseMonth: [],
  globTimeDay: [],
  currProfilDay: [],
  globTimeWeek: [],
  currProfilWeek: [],
  globTimeMonth: [],
  currProfilMonth: [],
  currProfilYear: 0,
  noPerson: 1,
  livingSpaceArea: 50,
  noAppliances: 1,
  powerCosts: 40, // ct/kWh
  actPowerConsump: 0,
};

// create slice
export const slice = createSlice({
  name: 'currentProfilData',
  initialState,
  reducers: {
    // onStart //
    currentProfilDataRequested: (state, action) => {
      if (debug > 0) console.log('currentProfilDataRequested/Payload: ', action.payload);
      state.loadingCurrentProfilData = true;
    },

    // onSuccess //
    currentProfilDataReceived: (state, action) => {
      if (debug > 0) console.log('currentProfilData/dataReceived: ', action);
      var addObj = action.payload;

      if (action.payload.hasOwnProperty('noPerson')) {
        state.noPerson = action.payload.noPerson;
      } else if (action.payload.hasOwnProperty('currProfilYear')) {
        state.currProfilYear = action.payload.currProfilYear;
      } else if (action.payload.hasOwnProperty('actPowerConsump')) {
        state.actPowerConsump = action.payload.actPowerConsump;
      } else if (action.payload.hasOwnProperty('powerCosts')) {
        state.powerCosts = action.payload.powerCosts;
      } else if (action.payload.hasOwnProperty('livingSpaceArea')) {
        state.livingSpaceArea = action.payload.livingSpaceArea;
      } else if (action.payload.hasOwnProperty('noAppliances')) {
        state.noAppliances = action.payload.noAppliances;
      } else if (action.payload.hasOwnProperty('currConsumpHour')) {
        state.currConsumpHour = action.payload.currConsumpHour;
      } else if (action.payload.hasOwnProperty('currBattCapaHour')) {
        state.currBattCapaHour = action.payload.currBattCapaHour;
      } else if (action.payload.hasOwnProperty('currConsumpDay')) {
        state.currConsumpDay = action.payload.currConsumpDay;
      } else if (action.payload.hasOwnProperty('currConsumpMonth')) {
        state.currConsumpMonth = action.payload.currConsumpMonth;
      } else if (action.payload.hasOwnProperty('currFeedHour')) {
        state.currFeedHour = action.payload.currFeedHour;
      } else if (action.payload.hasOwnProperty('currFeedDay')) {
        state.currFeedDay = action.payload.currFeedDay;
      } else if (action.payload.hasOwnProperty('currFeedMonth')) {
        state.currFeedMonth = action.payload.currFeedMonth;
      } else if (action.payload.hasOwnProperty('currPurchaseHour')) {
        state.currPurchaseHour = action.payload.currPurchaseHour;
      } else if (action.payload.hasOwnProperty('currPurchaseDay')) {
        state.currPurchaseDay = action.payload.currPurchaseDay;
      } else if (action.payload.hasOwnProperty('currPurchaseMonth')) {
        state.currPurchaseMonth = action.payload.currPurchaseMonth;
      } else if (action.payload.hasOwnProperty('currBattProvHour')) {
        state.currBattProvHour = action.payload.currBattProvHour;
      } else if (action.payload.hasOwnProperty('currBattProvDay')) {
        state.currBattProvDay = action.payload.currBattProvDay;
      } else if (action.payload.hasOwnProperty('currBattProvMonth')) {
        state.currBattProvMonth = action.payload.currBattProvMonth;
      } else {
        // Write hourly data to arrays
        var __globTimeHour = [];
        var __currProfilHour = [];

        __globTimeHour = Object.keys(addObj.hour);
        __currProfilHour = Object.values(addObj.hour);

        state.globTimeHour = __globTimeHour;
        state.currProfilHour = __currProfilHour;

        // Write daily data to arrays
        var __globTimeDay = [];
        var __currProfilDay = [];

        __globTimeDay = Array.from({ length: 365 }, (_, i) => i + 1);
        __currProfilDay = Object.values(addObj.day);

        state.globTimeDay = __globTimeDay;
        state.currProfilDay = __currProfilDay;

        // Write weekly data to arrays
        var __globTimeWeek = [];
        var __currProfilWeek = [];

        __globTimeWeek = Array.from({ length: 52 }, (_, i) => i + 1);
        __currProfilWeek = Object.values(addObj.week);

        state.globTimeWeek = __globTimeWeek;
        state.currProfilWeek = __currProfilWeek;

        // Write monthly data to arrays
        var __globTimeMonth = [];
        var __currProfilMonth = [];

        __globTimeMonth = Array.from({ length: 12 }, (_, i) => i + 1);
        __currProfilMonth = Object.values(addObj.month);

        state.globTimeMonth = __globTimeMonth;
        state.currProfilMonth = __currProfilMonth;
      }
    },

    // onError //
    currentProfilDataRequestFailed: (state) => {
      state.loadingCurrentProfilData = false;
    },
  },
});

// export reducer
export default slice.reducer;

// export actions
export const { currentProfilDataRequested, currentProfilDataReceived, currentProfilDataRequestFailed } =
  slice.actions;

// export action creators
export const getCurrentProfilData = () => async (dispatch) => {
  //console.log('currentProfilData/getCurrentProfilData', currLoadProfileData);
  dispatch(currentProfilDataRequested());

  try {
    dispatch(currentProfilDataReceived(currLoadProfileData));
  } catch (e) {
    console.error(e);
  }
};

export const calcAllocConsumpFeed = () => async (dispatch, getState) => {
  let __state = getState();
  if (debug > 0) console.log('currentProfilData/calc: ', __state);
  let __globTimeHour = __state.currentProfilData.globTimeHour;
  let __pvYieldHour = __state.weatherData.pvYieldHour;
  let __currProfilHour = __state.currentProfilData.currProfilHour;
  let __currProfilYear = __state.currentProfilData.currProfilYear;
  let __heatCurrProfilHour = __state.heatProfilData.heatCurrProfilHour;
  let __currConsumpHour = [];
  let __currConsumpDay = Array(365).fill(0);
  let __currConsumpMonth = Array(12).fill(0);
  let __currFeedHour = [];
  let __currFeedDay = Array(365).fill(0);
  let __currFeedMonth = Array(12).fill(0);
  let __currPurchaseHour = [];
  let __currPurchaseDay = Array(365).fill(0);
  let __currPurchaseMonth = Array(12).fill(0);
  let __currProfilHourEntry;
  let __capacity = __state.powerStorageData.sizePowerStorage;
  let __currBattCapa;
  let __currBattCapaHour = [];
  let __currBattProvHour = [];
  let __currBattProvDay = Array(365).fill(0);
  let __currBattProvMonth = Array(12).fill(0);

  // calculate hourly data
  // pvYield: der aus der Sonne/PV Anlage generierte Strom - PV Ertrag
  // currConsump: der aus dem PV Ertrag genutzte Stromverbrauch - Eigenverbrauch
  // currPurchase: der aus dem Netz eingespeiste Strom zur Deckung des eigenen Verbrauchs - Fremdbezug
  // currFeed: der aus dem PV Ertrag nicht genutzte sondern eingespeiste Strom - Einspeisung
  // currBattProv: der aus der Batterie genutzte Strom zur Deckung des eigenen Verbrauchs - Batteriebezug
  __pvYieldHour.map((entry, i) => {
    __currProfilHourEntry = (__currProfilHour[i] * __currProfilYear) / 1000; // actual current consumption
    __currProfilHourEntry = __currProfilHourEntry + __heatCurrProfilHour[i];
    i === 0 ? (__currBattCapa = 0) : (__currBattCapa = __currBattCapaHour[i - 1]); // actual battery energy level

    if (debug > 0) console.log(i, ': Erzeugung vs. Bedarf: ', entry, __currProfilHourEntry);
    if (entry >= __currProfilHourEntry) {
      // Erzeugung größer als Bedarf
      var __rest = entry - __currProfilHourEntry;

      if (__currBattCapa + __rest >= __capacity) {
        // Stromspeicher voll
        __currConsumpHour.push(__currProfilHourEntry); // wenn mehr erzeugt wird als benötigt, wird der komplette Bedarf im Eigenverbrauch gedeckt
        __currFeedHour.push(__rest - (__capacity - __currBattCapa));
        __currPurchaseHour.push(0);
        __currBattCapaHour.push(__capacity); // die Batterie wird mit dem Reststrom komplett vollgeladen
        __currBattProvHour.push(0);
      } else if (__currBattCapa + __rest < __capacity) {
        // Stromspeicher halbvoll
        __currConsumpHour.push(__currProfilHourEntry);
        __currFeedHour.push(0);
        __currPurchaseHour.push(0);
        __currBattCapaHour.push(__currBattCapa + __rest); // die Batterie wird mit dem Reststrom teilweise vollgeladen
        __currBattProvHour.push(0);
      }
    } else if (entry < __currProfilHourEntry) {
      // Erzeugung kleiner als Bedarf
      var __rest = __currProfilHourEntry - entry;

      if (__currProfilHourEntry <= entry + __currBattCapa) {
        // Stromspeicher halb geleert
        __currConsumpHour.push(entry); // wenn weniger erzeugt wird als benötigt, wird die gesamte Erzeugung im Eigenverbrauch genutzt
        __currFeedHour.push(0);
        __currPurchaseHour.push(0);
        __currBattCapaHour.push(__currBattCapa - __rest);
        __currBattProvHour.push(__rest); // wenn Batterie voll genug, wird die restliche Strommenge aus dem Speicher genommen
      } else if (__currProfilHourEntry > entry + __currBattCapa) {
        // stromspeicher voll
        __currConsumpHour.push(entry);
        __currFeedHour.push(0);
        __currPurchaseHour.push(__currProfilHourEntry - (entry + __currBattCapa)); // mit fremdbezogenem Strom wird der Bedarf gedeckt, welcher weder von PV nach Batt gedeckt werden kann
        __currBattCapaHour.push(0);
        __currBattProvHour.push(__currBattCapa);
      }
    }
  });

  // calculate daily/monthly data
  for (let i = 0; i < __globTimeHour.length; i++) {
    var day_string =
      __globTimeHour[i].slice(0, 4) +
      '-' +
      __globTimeHour[i].slice(4, 6) +
      '-' +
      __globTimeHour[i].slice(6, 8) +
      ' ' +
      __globTimeHour[i].slice(9, 11) +
      ':' +
      __globTimeHour[i].slice(11);
    var day = new Date(day_string);
    var month = day.getMonth();
    var dayOfYear = getDayOfYear(day);
    //console.log(
    //  i,
    //  ': weatherDataReceived/day/month/dayOfYear: ',
    //  day,
    //  month,
    //  dayOfYear,
    //  __currConsumpHour[i]
    //);
    __currConsumpDay[dayOfYear - 1] = __currConsumpDay[dayOfYear - 1] + __currConsumpHour[i];
    __currConsumpMonth[month] = __currConsumpMonth[month] + __currConsumpHour[i];
    __currFeedDay[dayOfYear - 1] = __currFeedDay[dayOfYear - 1] + __currFeedHour[i];
    __currFeedMonth[month] = __currFeedMonth[month] + __currFeedHour[i];
    __currPurchaseDay[dayOfYear - 1] = __currPurchaseDay[dayOfYear - 1] + __currPurchaseHour[i];
    __currPurchaseMonth[month] = __currPurchaseMonth[month] + __currPurchaseHour[i];
    __currBattProvDay[dayOfYear - 1] = __currBattProvDay[dayOfYear - 1] + __currBattProvHour[i];
    __currBattProvMonth[month] = __currBattProvMonth[month] + __currBattProvHour[i];
  }

  // transmit data
  try {
    dispatch(currentProfilDataReceived({ currBattCapaHour: __currBattCapaHour }));
    dispatch(currentProfilDataReceived({ currFeedHour: __currFeedHour }));
    dispatch(currentProfilDataReceived({ currFeedDay: __currFeedDay }));
    dispatch(currentProfilDataReceived({ currFeedMonth: __currFeedMonth }));
    dispatch(currentProfilDataReceived({ currPurchaseHour: __currPurchaseHour }));
    dispatch(currentProfilDataReceived({ currPurchaseDay: __currPurchaseDay }));
    dispatch(currentProfilDataReceived({ currPurchaseMonth: __currPurchaseMonth }));
    dispatch(currentProfilDataReceived({ currConsumpHour: __currConsumpHour }));
    dispatch(currentProfilDataReceived({ currConsumpDay: __currConsumpDay }));
    dispatch(currentProfilDataReceived({ currConsumpMonth: __currConsumpMonth }));
    dispatch(currentProfilDataReceived({ currBattProvHour: __currBattProvHour }));
    dispatch(currentProfilDataReceived({ currBattProvDay: __currBattProvDay }));
    dispatch(currentProfilDataReceived({ currBattProvMonth: __currBattProvMonth }));
  } catch (e) {
    console.error(e);
  }
};

export const setCurrentProfilProps = (data) => async (dispatch) => {
  dispatch(currentProfilDataRequested());

  try {
    dispatch(currentProfilDataReceived(data));
  } catch (e) {
    console.error(e);
  }
};

//setLivingSpaceArea;
