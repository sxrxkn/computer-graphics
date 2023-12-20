import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { multiplyMatrices } from "../../utils/funtions";

interface ModelInterface {
  originalVertices: number[][];
  currentVertices: number[][];
  edges: number[][];
  currentAffineTransformation: number[][];
  currentRotateTransformation: null | { axis: string; angle: number };
  currentCompositionRotateTransformation: null | {
    x1: number;
    y1: number;
    z1: number;
    x2: number;
    y2: number;
    z2: number;
    angle: number;
  };
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
    [60, 60, 190, 180, 120],
    [0, 0, 0, 0, 55],
    [120, 60, 60, 120, 90],
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
  currentRotateTransformation: null,
  currentCompositionRotateTransformation: null,
};

export const modelSlice = createSlice({
  name: "modelSlice",
  initialState,
  reducers: {
    addTransformAffineTransformation: (
      state,
      action: PayloadAction<number[]>
    ) => {
      const [x, y, z] = action.payload;
      const transformMatrix = [
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1],
      ];
      state.currentAffineTransformation = multiplyMatrices(
        transformMatrix,
        state.currentAffineTransformation
      );
      state.currentVertices = multiplyMatrices(
        state.currentAffineTransformation,
        state.originalVertices
      );
    },

    addScalingAffineTransformation: (
      state,
      action: PayloadAction<number[]>
    ) => {
      const [kx, ky, kz] = action.payload;
      const scalingMatrix = [
        [kx, 0, 0, 0],
        [0, ky, 0, 0],
        [0, 0, kz, 0],
        [0, 0, 0, 1],
      ];
      state.currentAffineTransformation = multiplyMatrices(
        scalingMatrix,
        state.currentAffineTransformation
      );
      state.currentVertices = multiplyMatrices(
        state.currentAffineTransformation,
        state.originalVertices
      );
    },

    addRotateTransformation: (
      state,
      action: PayloadAction<{ axis: string; angle: number }>
    ) => {
      let rotationMatrix;
      const radianAngle = (action.payload.angle * Math.PI) / 180;
      switch (action.payload.axis) {
        case "X":
          rotationMatrix = [
            [1, 0, 0, 0],
            [0, Math.cos(radianAngle), -Math.sin(radianAngle), 0],
            [0, Math.sin(radianAngle), Math.cos(radianAngle), 0],
            [0, 0, 0, 1],
          ];
          break;
        case "Y":
          rotationMatrix = [
            [Math.cos(radianAngle), 0, Math.sin(radianAngle), 0],
            [0, 1, 0, 0],
            [-Math.sin(radianAngle), 0, Math.cos(radianAngle), 0],
            [0, 0, 0, 1],
          ];
          break;
        case "Z":
          rotationMatrix = [
            [Math.cos(radianAngle), -Math.sin(radianAngle), 0, 0],
            [Math.sin(radianAngle), Math.cos(radianAngle), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
          ];
          break;
        default:
          alert("Invalid reflection type.");
          return;
      }
      if (rotationMatrix) {
        state.currentAffineTransformation = multiplyMatrices(
          rotationMatrix,
          state.currentAffineTransformation
        );
        state.currentVertices = multiplyMatrices(
          state.currentAffineTransformation,
          state.originalVertices
        );

        state.currentRotateTransformation = {
          axis: action.payload.axis,
          angle: action.payload.angle,
        };
      }
    },

    addMappingAffineTransformation: (state, action: PayloadAction<string>) => {
      let reflectionMatrix;
      switch (action.payload) {
        case "Y":
          reflectionMatrix = [
            [-1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 1],
          ];
          break;
        case "X":
          reflectionMatrix = [
            [1, 0, 0, 0],
            [0, -1, 0, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 1],
          ];
          break;
        case "Z":
          reflectionMatrix = [
            [-1, 0, 0, 0],
            [0, -1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
          ];
          break;
        case "XY":
          reflectionMatrix = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 1],
          ];
          break;
        case "XZ":
          reflectionMatrix = [
            [1, 0, 0, 0],
            [0, -1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
          ];
          break;
        case "YZ":
          reflectionMatrix = [
            [-1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
          ];
          break;
        default:
          alert("Invalid reflection type.");
          return;
      }
      if (reflectionMatrix) {
        state.currentAffineTransformation = multiplyMatrices(
          reflectionMatrix,
          state.currentAffineTransformation
        );
        state.currentVertices = multiplyMatrices(
          state.currentAffineTransformation,
          state.originalVertices
        );
      }
    },

    addCompositionRotateTransformation: (state) => {
      let x1, y1, z1, x2, y2, z2, angle;

      if (state.currentCompositionRotateTransformation) {
        x1 = state.currentCompositionRotateTransformation.x1;
        y1 = state.currentCompositionRotateTransformation.y1;
        z1 = state.currentCompositionRotateTransformation.z1;
        x2 = state.currentCompositionRotateTransformation.x2;
        y2 = state.currentCompositionRotateTransformation.y2;
        z2 = state.currentCompositionRotateTransformation.z2;
        angle = state.currentCompositionRotateTransformation.angle;
      } else {
        const point1 = prompt(
          "Enter coordinates for point 1 (comma-separated):",
          "0, -55, 150"
        );
        const point2 = prompt(
          "Enter coordinates for point 2 (comma-separated):",
          "180, 110, 60"
        );
        angle =
          parseFloat(prompt("Enter rotation angle in degrees:", "0") ?? "0") ||
          0;

        const parsePoint = (pointString: string) =>
          pointString.split(",").map(Number);

        [x1, y1, z1] = parsePoint(point1 ?? "");
        [x2, y2, z2] = parsePoint(point2 ?? "");

        state.currentVertices[0].push(x1, x2);
        state.currentVertices[1].push(y1, y2);
        state.currentVertices[2].push(z1, z2);
        state.currentVertices[2].push(1, 1);
        state.edges.push([
          state.currentVertices[0].length - 2,
          state.currentVertices[0].length - 1,
        ]);
      }
      if (
        x1 !== undefined &&
        y1 !== undefined &&
        z1 !== undefined &&
        x2 !== undefined &&
        y2 !== undefined &&
        z2 !== undefined &&
        angle !== undefined
      ) {
        // Вычисляем направляющий вектор
        const v = [x2 - x1, y2 - y1, z2 - z1];

        // Нормализуем направляющий вектор
        const lengthV = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
        const u = [v[0] / lengthV, v[1] / lengthV, v[2] / lengthV];

        // Теперь у нас есть координаты нормализованного вектора
        const [A, B, C] = u;
        const radianAngle = (angle * Math.PI) / 180;

        // Построим матрицы "перенос, поворот вокруг оси абсцисс, поворот вокруг оси аппликат, поворот, обр поворот, обр поворот, перенос
        const cos1 = B / Math.sqrt(B ** 2 + C ** 2);
        const sin1 = C / Math.sqrt(B ** 2 + C ** 2);

        const cos2 = A / Math.sqrt(A ** 2 + B ** 2 + C ** 2);
        const sin2 =
          Math.sqrt(B ** 2 + C ** 2) / Math.sqrt(A ** 2 + B ** 2 + C ** 2);

        const translationMatrix1 = [
          [1, 0, 0, -x1],
          [0, 1, 0, -y1],
          [0, 0, 1, -z1],
          [0, 0, 0, 1],
        ];

        const rotationMatrix1 = [
          [1, 0, 0, 0],
          [0, cos1, sin1, 0],
          [0, -sin1, cos1, 0],
          [0, 0, 0, 1],
        ];

        const rotationMatrix2 = [
          [cos2, sin2, 0, 0],
          [-sin2, cos2, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ];

        const rotationMatrix3 = [
          [1, 0, 0, 0],
          [0, Math.cos(radianAngle), -Math.sin(radianAngle), 0],
          [0, Math.sin(radianAngle), Math.cos(radianAngle), 0],
          [0, 0, 0, 1],
        ];

        const reverseRotationMatrix1 = [
          [cos2, -sin2, 0, 0],
          [sin2, cos2, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ];

        const reverseRotationMatrix2 = [
          [1, 0, 0, 0],
          [0, cos1, -sin1, 0],
          [0, sin1, cos1, 0],
          [0, 0, 0, 1],
        ];

        const translationMatrix2 = [
          [1, 0, 0, x1],
          [0, 1, 0, y1],
          [0, 0, 1, z1],
          [0, 0, 0, 1],
        ];

        state.currentAffineTransformation = multiplyMatrices(
          translationMatrix1,
          state.currentAffineTransformation
        );
        state.currentAffineTransformation = multiplyMatrices(
          rotationMatrix1,
          state.currentAffineTransformation
        );
        state.currentAffineTransformation = multiplyMatrices(
          rotationMatrix2,
          state.currentAffineTransformation
        );
        state.currentAffineTransformation = multiplyMatrices(
          rotationMatrix3,
          state.currentAffineTransformation
        );
        state.currentAffineTransformation = multiplyMatrices(
          reverseRotationMatrix1,
          state.currentAffineTransformation
        );
        state.currentAffineTransformation = multiplyMatrices(
          reverseRotationMatrix2,
          state.currentAffineTransformation
        );
        state.currentAffineTransformation = multiplyMatrices(
          translationMatrix2,
          state.currentAffineTransformation
        );

        state.currentVertices = multiplyMatrices(
          state.currentAffineTransformation,
          state.originalVertices
        );

        state.currentVertices[0].push(x1, x2);
        state.currentVertices[1].push(y1, y2);
        state.currentVertices[2].push(z1, z2);
        state.currentVertices[2].push(1, 1);

        state.currentCompositionRotateTransformation = {
          x1,
          y1,
          z1,
          x2,
          y2,
          z2,
          angle,
        };
      }
    },

    addNewFigure: (state) => {
      const newVerticesString = prompt(
        "Enter original vertices (comma-separated values):",
        "-60,-60,-190,-180,-120\n0,0,0,0,-55\n-120,-60,-60,-120,-90\n1,1,1,1,1"
      );

      const newEdgesString = prompt(
        "Enter edges (comma-separated pairs):",
        "0,1\n1,2\n2,3\n3,0\n0,4\n1,4\n2,4\n3,4"
      );

      // Преобразование строки в массив чисел
      const parseArray = (str: string) =>
        str.split(",").map((item) => parseFloat(item.trim()));

      if (newEdgesString && newVerticesString) {
        const newVertices = newVerticesString.split("\n").map(parseArray);
        let edges = newEdgesString.split("\n").map((pair) => parseArray(pair));
        // Увеличиваем счётчик углов
        const totalEdgesCount = (state.edges[0].length += edges[0].length + 1);

        // Корректируем углы в соответствии с общим счётчиком
        edges = edges.map((edgeArr) =>
          edgeArr.map((edge) => edge + totalEdgesCount)
        );
        state.originalVertices[0] = [
          ...state.originalVertices[0],
          ...newVertices[0],
        ];
        state.originalVertices[1] = [
          ...state.originalVertices[1],
          ...newVertices[1],
        ];
        state.originalVertices[2] = [
          ...state.originalVertices[2],
          ...newVertices[2],
        ];
        state.originalVertices[3] = [
          ...state.originalVertices[3],
          ...newVertices[3],
        ];

        state.currentVertices[0] = [
          ...state.currentVertices[0],
          ...newVertices[0],
        ];
        state.currentVertices[1] = [
          ...state.currentVertices[1],
          ...newVertices[1],
        ];
        state.currentVertices[2] = [
          ...state.currentVertices[2],
          ...newVertices[2],
        ];
        state.currentVertices[3] = [
          ...state.currentVertices[3],
          ...newVertices[3],
        ];
        state.edges = [...state.edges, ...edges];
      }
    },
  },
});

export const {
  addTransformAffineTransformation,
  addScalingAffineTransformation,
  addMappingAffineTransformation,
  addRotateTransformation,
  addNewFigure,
  addCompositionRotateTransformation,
} = modelSlice.actions;
export default modelSlice.reducer;
