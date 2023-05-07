import { configureStore } from '@reduxjs/toolkit';
import currentProfilReducer from './currentProfilSlices';
import heatProfilReducer from './heatProfilSlices';
import weatherReducer from './weatherSlices';
import pvModuleReducer from './pvModuleSlices';
import mapReducer from './mapSlices';
import objectReducer from './objectSlices';
import powerStorageReducer from './powerStorageSlices';

import logger from './logger';
import toasty from './toast';

export const store = configureStore({
  reducer: {
    powerStorageData: powerStorageReducer,
    currentProfilData: currentProfilReducer,
    heatProfilData: heatProfilReducer,
    weatherData: weatherReducer,
    pvModuleData: pvModuleReducer,
    mapData: mapReducer,
    objectData: objectReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, toasty),
});
