import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import {
  projectionToScreen,
  viewToProjection,
  worldToView,
} from "../utils/funtions";
import { cameraSlice } from "../store/reducers/CameraSlice";

const Scene3D = () => {
  const dispatch = useAppDispatch();

  const camera = useAppSelector((state) => state.cameraSlice);
  const model = useAppSelector((state) => state.modelSlice);

  const { setBasisVectors } = cameraSlice.actions;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Шаг 1: Вычисление вектора kv
    const kvMagnitude = Math.sqrt(
      camera.N.x ** 2 + camera.N.y ** 2 + camera.N.z ** 2
    );

    const kv = {
      x: camera.N.x / kvMagnitude,
      y: camera.N.y / kvMagnitude,
      z: camera.N.z / kvMagnitude,
    };

    // Шаг 2: Вычисление вектора iv
    const crossProduct = {
      x: camera.T.y * camera.N.z - camera.T.z * camera.N.y,
      y: camera.T.z * camera.N.x - camera.T.x * camera.N.z,
      z: camera.T.x * camera.N.y - camera.T.y * camera.N.x,
    };
    const ivMagnitude = Math.sqrt(
      crossProduct.x ** 2 + crossProduct.y ** 2 + crossProduct.z ** 2
    );
    const iv = {
      x: crossProduct.x / ivMagnitude,
      y: crossProduct.y / ivMagnitude,
      z: crossProduct.z / ivMagnitude,
    };

    // Шаг 3: Вычисление вектора jv
    const jv = {
      x: kv.y * iv.z - kv.z * iv.y,
      y: kv.z * iv.x - kv.x * iv.z,
      z: kv.x * iv.y - kv.y * iv.x,
    };
    dispatch(setBasisVectors([iv, jv, kv]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      const clearWorkspace = () => {
        context?.clearRect(0, 0, camera.W, camera.H);
      };

      const drawVertex = (x: number, y: number) => {
        const [screenX, screenY] = projectionToScreen(
          x,
          y,
          camera.X0,
          camera.Y0,
          camera.px,
          camera.py
        );

        context?.beginPath();
        context?.arc(screenX, screenY, 3, 0, 2 * Math.PI);
        context.fillStyle = "red";
        context?.fill();
      };

      const drawLine = (
        startX: number,
        startY: number,
        endX: number,
        endY: number
      ) => {
        const [screenStartX, screenStartY] = projectionToScreen(
          startX,
          startY,
          camera.X0,
          camera.Y0,
          camera.px,
          camera.py
        );
        const [screenEndX, screenEndY] = projectionToScreen(
          endX,
          endY,
          camera.X0,
          camera.Y0,
          camera.px,
          camera.py
        );

        context.beginPath();
        context.moveTo(screenStartX, screenStartY);
        context.lineTo(screenEndX, screenEndY);
        context.stroke();
      };

      const drawAxes = () => {
        drawLine(
          -camera.axisSize[0] / (2 * camera.px),
          0,
          camera.axisSize[0] / (2 * camera.px),
          0
        );
        drawLine(
          0,
          camera.axisSize[1] / (2 * camera.py),
          0,
          -camera.axisSize[1] / (2 * camera.py)
        );
        drawLine(
          0,
          0,
          -camera.axisSize[0] / (2 * camera.px),
          -camera.axisSize[1] / (2 * camera.py)
        );
        drawAxisTicks();
      };

      const drawAxisTicks = () => {
        drawAxisTicksX();
        drawAxisTicksY();
        // drawAxisTicksZ();
      };

      const drawAxisTicksX = () => {
        const tickLength = 5;
        const tickSpacing = camera.pixelWidth; // Интервал между делениями в мировых координатах

        for (
          let i = -camera.axisSize[0] / (2 * camera.px);
          i <= camera.axisSize[0] / (2 * camera.px);
          i += tickSpacing
        ) {
          const x = i;
          const y = 0;

          drawLine(x, y - tickLength / 2, x, y + tickLength / 2);
          drawTickLabel(x, y + tickLength, x);
        }
      };

      const drawAxisTicksY = () => {
        const tickLength = 5;
        const tickSpacing = camera.pixelHeight;

        for (
          let i = -camera.axisSize[1] / (2 * camera.py);
          i <= camera.axisSize[1] / (2 * camera.py);
          i += tickSpacing
        ) {
          const x = 0;
          const y = i;

          drawLine(x - tickLength / 2, y, x + tickLength / 2, y);
          drawTickLabel(x - tickLength, y, y);
        }
      };

      // const drawAxisTicksZ = () => {
      //   const tickLength = 20;
      //   const tickSpacing = 50;

      //   for (
      //     let i = 0;
      //     i <= camera.axisSize[2] / (2 * camera.pz);
      //     i += tickSpacing
      //   ) {
      //     const z = i;

      //     drawLine(z - tickLength / 2, z, 0, z + tickLength / 2);
      //     drawTickLabel(0, 0, z + tickLength);
      //   }
      // };

      const drawTickLabel = (x: number, y: number, label: number) => {
        context.font = "10px Arial";
        context.fillStyle = "black";
        const scaledX = camera.X0 + camera.px * x;
        const scaledY = camera.Y0 - camera.py * y;
        context.fillText(label.toFixed(2), scaledX, scaledY + 7);
      };

      const drawVertices = (vertices: number[][]) => {
        for (let i = 0; i < vertices[0].length; i++) {
          drawVertex(vertices[0][i], vertices[1][i]);
        }
      };

      const render = () => {
        clearWorkspace();
        drawAxes();
        const viewCoordinates: number[][] = [[], [], [], []];

        // Пройдем по всем точкам и преобразуем их в видовые координаты
        for (let i = 0; i < model.currentVertices[0].length; i++) {
          const uw = {
            x: model.currentVertices[0][i],
            y: model.currentVertices[1][i],
            z: model.currentVertices[2][i],
          };
          const viewCoordinate = worldToView(
            camera.iv,
            camera.jv,
            camera.kv,
            camera.Ov,
            uw
          );
          viewCoordinates[0].push(viewCoordinate[0][0]);
          viewCoordinates[1].push(viewCoordinate[1][0]);
          viewCoordinates[2].push(viewCoordinate[2][0]);
          viewCoordinates[3].push(viewCoordinate[3][0]);
        }

        const resultProjectionCoordinates: number[][] = [[], [], []];

        // Пройдем по всем видовым координатам и преобразуем их в проекционные
        for (let i = 0; i < viewCoordinates[0].length; i++) {
          const uv = {
            x: viewCoordinates[0][i],
            y: viewCoordinates[1][i],
            z: viewCoordinates[2][i],
          };
          const projectionCoordinate = viewToProjection(camera.F, uv);
          resultProjectionCoordinates[0].push(projectionCoordinate[0][0]);
          resultProjectionCoordinates[1].push(projectionCoordinate[1][0]);
          resultProjectionCoordinates[2].push(projectionCoordinate[2][0]);
        }
        // console.log(resultProjectionCoordinates);
        drawVertices(resultProjectionCoordinates);

        const edges = model.edges;

        for (let i = 0; i < edges.length; i++) {
          const startVertex = [
            resultProjectionCoordinates[0][edges[i][0]],
            resultProjectionCoordinates[1][edges[i][0]],
          ];
          const endVertex = [
            resultProjectionCoordinates[0][edges[i][1]],
            resultProjectionCoordinates[1][edges[i][1]],
          ];

          drawLine(startVertex[0], startVertex[1], endVertex[0], endVertex[1]);
        }
      };

      render();
    }
  }, [camera, model]);

  return (
    <canvas
      style={{ border: "2px solid black", margin: "10px" }}
      ref={canvasRef}
      width={camera.W}
      height={camera.H}
    />
  );
};

export default Scene3D;
