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
  Ov: { x: 0, y: 0, z: 0 },
  N: { x: 1, y: 0.7, z: 1 },
  T: { x: 0, y: 1, z: 0 },
  F: 100,
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
    rotateVectors: (
      state,
      action: PayloadAction<{ N: CordinateSystem; T: CordinateSystem }>
    ) => {
      state.N.x += action.payload.N.x;
      state.N.y += action.payload.N.y;
      state.N.z += action.payload.N.z;
      state.T.x += action.payload.T.x;
      state.T.y += action.payload.T.y;
      state.T.z += action.payload.T.z;
    },
    changeOv: (state, action: PayloadAction<CordinateSystem>) => {
      state.Ov.x += action.payload.x;
      state.Ov.y += action.payload.y;
      state.Ov.z += action.payload.z;
    },

    scaleCamera: (state) => {
      const newWidth =
        parseInt(prompt("Enter new width:", state.W.toString()) ?? "10", 10) ||
        state.W;
      const newHeight =
        parseInt(prompt("Enter new height:", state.H.toString()) ?? "10", 10) ||
        state.H;

      const newPy = (newHeight / state.H) * state.py;
      const newPx = newPy;
      const newY0 = (newHeight / state.H) * state.Y0;
      const newX0 =
        ((-2 * state.X0 + state.W) * ((newHeight / state.H) * state.py)) /
          (-2 * state.px) -
        newWidth / -2;

      state.axisSize = [state.axisSize[0] * newPx, state.axisSize[1] * newPy];
      state.px = newPx;
      state.py = newPy;
      state.X0 = newX0;
      state.Y0 = newY0;
      state.H = newHeight;
      state.W = newWidth;
    },
    updateDragging: (
      state,
      action: PayloadAction<{ deltaX: number; deltaY: number }>
    ) => {
      state.X0 += action.payload.deltaX;
      state.Y0 += action.payload.deltaY;
    },
    zoomCamera: (
      state,
      action: PayloadAction<{ xs: number; ys: number; k: number }>
    ) => {
      state.X0 =
        action.payload.xs - action.payload.k * (action.payload.xs - state.X0);
      state.Y0 =
        action.payload.ys - action.payload.k * (action.payload.ys - state.Y0);
      state.px *= action.payload.k;
      state.py *= action.payload.k;
    },
  },
});

export const {
  setBasisVectors,
  rotateVectors,
  changeOv,
  scaleCamera,
  updateDragging,
  zoomCamera,
} = cameraSlice.actions;
export default cameraSlice.reducer;
