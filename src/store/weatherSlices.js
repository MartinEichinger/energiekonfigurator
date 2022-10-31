import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getData } from './api';
//import { AppThunk } from './store';

const debug = 1;
const baseURL = process.env.REACT_APP_TMDB_BASIC_PATH;
const apiKey = 'api_key=' + process.env.REACT_APP_TMDB_API_KEY;
const imgURL = process.env.REACT_APP_TMDB_IMG_PATH;

// initial state
const initialState = {
  loadingWeatherData: false,
  globTimeHour: [],
  globIrradHour: [],
  pvYieldHour: [],
  globTimeDay: [],
  globIrradDay: [],
  pvYieldDay: [],
  globTimeWeek: [],
  globIrradWeek: [],
  pvYieldWeek: [],
  globTimeMonth: [],
  globIrradMonth: [],
  pvYieldMonth: [],
  globIrradYear: 0,
  pvYieldYear: 0,
};

// create slice
export const slice = createSlice({
  name: 'weatherData',
  initialState,
  reducers: {
    // onStart //
    weatherDataRequested: (state, action) => {
      if (debug > 0) console.log('weatherDataRequested/Payload: ', action.payload);
      state.loadingWeatherData = true;
    },

    // onSuccess //
    weatherDataReceived: (state, action) => {
      if (debug > 0) console.log('weatherData/dataReceived: ', action);
      var addObj = action.payload.hourly;

      // Write hourly Data to Arrays
      var __globTimeHour = [];
      var __globIrradHour = [];
      var __pvYieldHour = [];
      var __globIrradYear = 0;
      var __pvYieldYear = 0;

      for (let i = 0; i < addObj.length; i++) {
        __globTimeHour.push(addObj[i]['time']);
        __globIrradHour.push(addObj[i]['P']);
        __pvYieldHour.push(addObj[i]['G(i)']);
        __pvYieldYear += addObj[i]['P'] / 1000;
        __globIrradYear += addObj[i]['G(i)'] / 1000;
        //console.log(__pvYieldYear, __globIrradYear, typeof addObj[i]['P']);
      }
      state.globTimeHour = __globTimeHour;
      state.globIrradHour = __globIrradHour;
      state.pvYieldHour = __pvYieldHour;
      state.pvYieldYear = __pvYieldYear;
      state.globIrradYear = __globIrradYear;

      // Write monthly Data to Arrays
      var __globTimeMonth = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mai',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Okt',
        'Nov',
        'Dez',
      ];
      var __globIrradMonth = [];
      var __pvYieldMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (let i = 0; i < addObj.length; i++) {
        var day_string =
          addObj[i]['time'].slice(0, 4) +
          '-' +
          addObj[i]['time'].slice(4, 6) +
          '-' +
          addObj[i]['time'].slice(6, 8) +
          ' ' +
          addObj[i]['time'].slice(9, 11) +
          ':' +
          addObj[i]['time'].slice(11);
        var day = new Date(day_string);
        var month = day.getMonth();
        __pvYieldMonth[month] = __pvYieldMonth[month] + addObj[i]['P'] / 1000;
      }

      state.globTimeMonth = __globTimeMonth;
      state.globIrradMonth = __globIrradMonth;
      state.pvYieldMonth = __pvYieldMonth;

      state.loadingWeatherData = false;
    },

    // onError //
    weatherDataRequestFailed: (state) => {
      state.loadingWeatherData = false;
    },
  },
});

// export reducer
export default slice.reducer;

// export actions
export const { weatherDataRequested, weatherDataReceived, weatherDataRequestFailed } = slice.actions;

// export action creators
export const getWeatherData = (formData) => async (dispatch) => {
  console.log('weatherData/getWeatherData', formData);
  dispatch(weatherDataRequested());

  var lt = Math.round(formData.lat * 100) / 100; //-1.13; //48.569;
  var ln = Math.round(formData.lng * 100) / 100; //39.21; //12.559;
  //var aspect = -90;
  //var angle = 30; // send request
  // Standard Data
  //var peakpower = 1;
  var loss = 15;
  var endyear = 2015;
  var startyear = 2015;
  var pvcalculation = 1;
  var outputformat = 'json';

  var searchUrl_0 = `https://thingproxy.freeboard.io/fetch/`; //`http://www.whateverorigin.org/get?url=`; //`https://fast-dawn-89938.herokuapp.com/`;
  var searchUrl_1 = `https://re.jrc.ec.europa.eu/api/seriescalc?`;
  var searchUrl_2 = `lat=${lt}&lon=${ln}&aspect=${formData.aspect}&angle=${formData.angle}`;
  var searchUrl_3 = `&pvcalculation=${pvcalculation}&peakpower=${formData.peakpower}&loss=${loss}&endyear=${endyear}&startyear=${startyear}&outputformat=${outputformat}`;
  try {
    let res = await getData(
      searchUrl_0 + encodeURIComponent(searchUrl_1 + searchUrl_2 + searchUrl_3),
      'get'
    );
    //let res = JSON.parse(res_json);
    console.log('weatherData/getWeatherData: ', res);

    dispatch(weatherDataReceived(res.outputs));
  } catch (e) {
    dispatch(weatherDataRequestFailed());
    console.error(e);
  }
};
