import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CameraInterface {
  px: number;
  py: number;
  pz: number;
  W: number;
  H: number;
  pixelWidth: number;
  pixelHeight: number;
  X0: number;
  Y0: number;
  axisSize: number[];
}

const initialState: CameraInterface = {
  px: 1,
  py: 1,
  pz: 1,
  W: 600,
  H: 600,
  pixelWidth: 50,
  pixelHeight: 50,
  X0: 300,
  Y0: 300,
  axisSize: [600, 600],
};

export const cameraSlice = createSlice({
  name: "cameraSlice",
  initialState,
  reducers: {},
});

export const {} = cameraSlice.actions;
export default cameraSlice.reducer;
