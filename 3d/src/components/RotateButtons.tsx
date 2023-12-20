import React from "react";
import ArrowVector from "./ArrowVector";
import { useAppDispatch } from "../hooks/redux";
import { CordinateSystem, cameraSlice } from "../store/reducers/CameraSlice";
import "./ViewButtons.css";

const RotateButtons = () => {
  const { rotateVectors } = cameraSlice.actions;
  const dispatch = useAppDispatch();

  function rotate(N: CordinateSystem, T: CordinateSystem) {
    dispatch(rotateVectors({ N, T }));
  }

  return (
    <>
      <h2>Rotate</h2>
      <div className="buttons-container">
        <button
          className="viewButton viewButton_blue-color"
          onClick={() => {
            rotate({ x: -0.1, y: 0, z: 0 }, { x: 0.1, y: 0, z: 0 });
          }}
          style={{ transform: "rotate(-90deg)" }}>
          <ArrowVector />
        </button>
        <div className="buttons_column-direction">
          <button
            className="viewButton viewButton_blue-color"
            onClick={() => {
              rotate({ x: 0, y: 0.1, z: 0 }, { x: 0, y: -0.1, z: 0 });
            }}>
            <ArrowVector />
          </button>
          <button
            className="viewButton viewButton_blue-color"
            onClick={() => {
              rotate({ x: 0, y: -0.1, z: 0 }, { x: 0, y: -0.1, z: 0 });
            }}
            style={{ transform: "rotate(180deg)" }}>
            <ArrowVector />
          </button>
        </div>

        <button
          className="viewButton viewButton_blue-color"
          onClick={() => {
            rotate({ x: 0.1, y: 0, z: 0 }, { x: -0.1, y: 0, z: 0 });
          }}
          style={{ transform: "rotate(90deg)" }}>
          <ArrowVector />
        </button>
      </div>
    </>
  );
};

export default RotateButtons;
