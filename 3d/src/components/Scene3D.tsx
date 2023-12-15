import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../hooks/redux";
import { worldToScreen } from "../utils/funtions";

const Scene3D = () => {
  const camera = useAppSelector((state) => state.cameraSlice);
  const model = useAppSelector((state) => state.modelSlice);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const context = canvas?.getContext("2d");
    if (context) {
      const clearWorkspace = () => {
        context?.clearRect(0, 0, camera.W, camera.H);
      };

      const drawVertex = (x: number, y: number) => {
        const [screenX, screenY] = worldToScreen(
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
        const [screenStartX, screenStartY] = worldToScreen(
          startX,
          startY,
          camera.X0,
          camera.Y0,
          camera.px,
          camera.py
        );
        const [screenEndX, screenEndY] = worldToScreen(
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
        drawAxisTicksZ();
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

      const drawAxisTicksZ = () => {
        const tickLength = 20;
        const tickSpacing = 50;

        for (
          let i = 0;
          i <= camera.axisSize[2] / (2 * camera.pz);
          i += tickSpacing
        ) {
          const z = i;

          drawLine(z - tickLength / 2, z, 0, z + tickLength / 2);
          drawTickLabel(0, 0, z + tickLength);
        }
      };

      const drawTickLabel = (x: number, y: number, label: number) => {
        context.font = "10px Arial";
        context.fillStyle = "black";
        const scaledX = camera.X0 + camera.px * x;
        const scaledY = camera.Y0 - camera.py * y;
        context.fillText(label.toFixed(2), scaledX, scaledY + 7);
      };

      const drawVertices = () => {
        const vertices = model.currentVertices;

        for (let i = 0; i < vertices[0].length; i++) {
          drawVertex(vertices[0][i], vertices[1][i]);
        }
      };

      clearWorkspace();
      drawAxes();

      drawVertices();

      const edges = model.edges;

      for (let i = 0; i < edges.length; i++) {
        const startVertex = [
          model.currentVertices[0][edges[i][0]],
          model.currentVertices[1][edges[i][0]],
        ];
        const endVertex = [
          model.currentVertices[0][edges[i][1]],
          model.currentVertices[1][edges[i][1]],
        ];

        drawLine(startVertex[0], startVertex[1], endVertex[0], endVertex[1]);
      }
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
