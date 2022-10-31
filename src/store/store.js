import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlices';
import pvModuleReducer from './pvModuleSlices';
import mapReducer from './mapSlices';
import objectReducer from './objectSlices';

import logger from './logger';
import toasty from './toast';

export const store = configureStore({
  reducer: {
    weatherData: weatherReducer,
    pvModuleData: pvModuleReducer,
    mapData: mapReducer,
    objectData: objectReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, toasty),
});
