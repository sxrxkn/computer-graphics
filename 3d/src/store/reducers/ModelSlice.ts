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
  currentVertices: [
    [20, 20, 60, 60, 40],
    [0, 0, 0, 0, 55],
    [40, 20, 20, 40, 30],
    [1, 1, 1, 1, 1],
  ],
  originalVertices: [
    [20, 20, 60, 60, 40],
    [0, 0, 0, 0, 55],
    [40, 20, 20, 40, 30],
    [1, 1, 1, 1, 1],
  ],
  edges: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
  ],
};

export const modelSlice = createSlice({
  name: "modelSlice",
  initialState,
  reducers: {
    updateAffineTransformation(store, action: PayloadAction<any>) {},
  },
});

export const { updateAffineTransformation } = modelSlice.actions;
export default modelSlice.reducer;
