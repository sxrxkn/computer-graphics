import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModelInterface {
  originalVertices: number[][];
  currentVertices: number[][];
  edges: number[][];
  currentAffineTransformation: number[][];
}

const initialState: ModelInterface = {
  currentAffineTransformation: [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ],
  currentVertices: [[], [], [], []],
  originalVertices: [[], [], [], []],
  edges: [],
};

export const modelSlice = createSlice({
  name: "modelSlice",
  initialState,
  reducers: {},
});

export const {} = modelSlice.actions;
export default modelSlice.reducer;
