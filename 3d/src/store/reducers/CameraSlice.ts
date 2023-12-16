import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CordinateSystem {
  x: number;
  y: number;
  z: number;
}

interface CameraInterface {
  px: number;
  py: number;
  W: number;
  H: number;
  pixelWidth: number;
  pixelHeight: number;
  X0: number;
  Y0: number;
  axisSize: number[];
  Ov: CordinateSystem;
  N: CordinateSystem;
  T: CordinateSystem;
  kv: CordinateSystem;
  iv: CordinateSystem;
  jv: CordinateSystem;
  F: number;
  D: number;
}

const initialState: CameraInterface = {
  px: 1,
  py: 1,
  W: 600,
  H: 600,
  pixelWidth: 50,
  pixelHeight: 50,
  X0: 300,
  Y0: 300,
  axisSize: [600, 600],
  Ov: { x: 0, y: 0, z: 1000 },
  N: { x: 0, y: 0, z: -1 },
  T: { x: 1, y: 0, z: 0 },
  F: 1000,
  D: 500,
  kv: { x: 0, y: 0, z: 0 },
  iv: { x: 0, y: 0, z: 0 },
  jv: { x: 0, y: 0, z: 0 },
};

export const cameraSlice = createSlice({
  name: "cameraSlice",
  initialState,
  reducers: {
    setBasisVectors: (state, action: PayloadAction<CordinateSystem[]>) => {
      state.iv = action.payload[0];
      state.jv = action.payload[1];
      state.kv = action.payload[2];
    },
  },
});

export const { setBasisVectors } = cameraSlice.actions;
export default cameraSlice.reducer;
