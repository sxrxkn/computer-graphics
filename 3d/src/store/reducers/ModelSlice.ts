import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { multiplyMatrices } from "../../utils/funtions";

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
    [60, 60, 190, 180, 120],
    [0, 0, 0, 0, 55],
    [120, 60, 60, 120, 90],
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
    addTransformAffineTransformation: (state, action: PayloadAction<number[]>) => {
      const [x, y, z] = action.payload
      const transformMatrix = [
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1]
      ]
      state.currentAffineTransformation = multiplyMatrices(transformMatrix, state.currentAffineTransformation)
      state.currentVertices = multiplyMatrices(state.currentAffineTransformation, state.originalVertices)
    },

    addScalingAffineTransformation: (state, action: PayloadAction<number[]>) => {
      const [kx, ky, kz] = action.payload
      const scalingMatrix = [
        [kx, 0, 0, 0],
        [0, ky, 0, 0],
        [0, 0, kz, 0],
        [0, 0, 0, 1]
      ]
      state.currentAffineTransformation = multiplyMatrices(scalingMatrix, state.currentAffineTransformation)
      state.currentVertices = multiplyMatrices(state.currentAffineTransformation, state.originalVertices)
    },

    addMappingAffineTransformation: (state, action: PayloadAction<string>) => {
      let reflectionMatrix;
      switch (action.payload) {
          case 'Y':
              reflectionMatrix = [
                  [-1, 0, 0, 0],
                  [0, 1, 0, 0],
                  [0, 0, -1, 0],
                  [0, 0, 0, 1],
              ];
              break;
          case 'X':
              reflectionMatrix = [
                [1, 0, 0, 0],
                [0, -1, 0, 0],
                [0, 0, -1, 0],
                [0, 0, 0, 1],
              ];
              break;
          case 'Z':
            reflectionMatrix = [
              [-1, 0, 0, 0],
              [0, -1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ];
            break;
          case 'XY':
            reflectionMatrix = [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, -1, 0],
              [0, 0, 0, 1],
            ];
            break;
          case 'XZ':
            reflectionMatrix = [
              [1, 0, 0, 0],
              [0, -1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ];
            break;
          case 'YZ':
            reflectionMatrix = [
              [-1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ];
            break;
          default:
              alert('Invalid reflection type.');
              return;
        }
        if (reflectionMatrix) {
          state.currentAffineTransformation = multiplyMatrices(reflectionMatrix, state.currentAffineTransformation)
          state.currentVertices = multiplyMatrices(state.currentAffineTransformation, state.originalVertices)
        }
    },

    
  },
});

export const { addTransformAffineTransformation, addScalingAffineTransformation } = modelSlice.actions;
export default modelSlice.reducer;
