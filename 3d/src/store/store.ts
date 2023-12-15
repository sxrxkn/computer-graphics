import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cameraSlice from "./reducers/CameraSlice";
import generalSlice from "./reducers/GeneralSlice";
import modelSlice from "./reducers/ModelSlice";

const rootReducer = combineReducers({
  cameraSlice,
  generalSlice,
  modelSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
