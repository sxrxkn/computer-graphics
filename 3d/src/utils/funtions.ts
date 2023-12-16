import { CordinateSystem } from "../store/reducers/CameraSlice";

export const multiplyMatrices = (matrixA: number[][], matrixB: number[][]) => {
  const result: number[][] = [];
  for (let i = 0; i < matrixA.length; i++) {
    result[i] = [];
    for (let j = 0; j < matrixB[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < matrixA[0].length; k++) {
        sum += matrixA[i][k] * matrixB[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};

export const projectionToScreen = (
  x: number,
  y: number,
  X0: number,
  Y0: number,
  px: number,
  py: number
) => {
  const screenX = X0 + px * x;
  const screenY = Y0 - py * y;
  return [screenX, screenY];
};

export const screenToProjection = (
  x: number,
  y: number,
  X0: number,
  Y0: number,
  px: number,
  py: number
) => {
  const worldX = (x - X0 + 0.5) / px;
  const worldY = -((y - Y0 + 0.5) / py);
  return [worldX, worldY];
};

export const worldToView = (
  iv: CordinateSystem,
  jv: CordinateSystem,
  kv: CordinateSystem,
  Ov: CordinateSystem,
  uw: CordinateSystem
) => {
  const firstMatrix = [
    [iv.x, iv.y, iv.z, -(iv.x * Ov.x + iv.y * Ov.y + iv.z * Ov.z)],
    [jv.x, jv.y, jv.z, -(jv.x * Ov.x + jv.y * Ov.y + jv.z * Ov.z)],
    [kv.x, kv.y, kv.z, -(kv.x * Ov.x + kv.y * Ov.y + kv.z * Ov.z)],
    [0, 0, 0, 1],
  ];
  const secondMatrix = [[uw.x], [uw.y], [uw.z], [1]];

  const result = multiplyMatrices(firstMatrix, secondMatrix);
  return result;
};

export const viewToProjection = (F: number, uv: CordinateSystem) => {
  const firstMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, -(1 / F), 1],
  ];

  const secondMatrix = [[uv.x], [uv.y], [uv.z], [1]];

  const result = multiplyMatrices(firstMatrix, secondMatrix);
  return result;
};
