import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cameraSlice from "./reducers/CameraSlice";
import modelSlice from "./reducers/ModelSlice";

const rootReducer = combineReducers({
  cameraSlice,
  modelSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
