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

export const worldToScreen = (
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

export const screenToWorld = (
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
