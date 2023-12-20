import React from "react";
import ArrowVector from "./ArrowVector";
import { useAppDispatch } from "../hooks/redux";
import { CordinateSystem, cameraSlice } from "../store/reducers/CameraSlice";
import "./ViewButtons.css";

const MoveButtons = () => {
  const { changeOv } = cameraSlice.actions;
  const dispatch = useAppDispatch();

  function rotate(Ov: CordinateSystem) {
    dispatch(changeOv(Ov));
  }

  return (
    <>
      <h2>Move</h2>
      <div className="buttons-container">
        <button
          className="viewButton viewButton_green-color"
          onClick={() => {
            rotate({ x: -10, y: 0, z: 0 });
          }}
          style={{ transform: "rotate(-90deg)" }}>
          <ArrowVector />
        </button>

        <div className="buttons_column-direction">
          <button
            className="viewButton viewButton_green-color"
            onClick={() => {
              rotate({ x: 0, y: 10, z: 0 });
            }}>
            <ArrowVector />
          </button>
          <button
            className="viewButton viewButton_green-color"
            onClick={() => {
              rotate({ x: 0, y: -10, z: 0 });
            }}
            style={{ transform: "rotate(180deg)" }}>
            <ArrowVector />
          </button>
        </div>

        <button
          className="viewButton viewButton_green-color"
          onClick={() => {
            rotate({ x: 10, y: 0, z: 0 });
          }}
          style={{ transform: "rotate(90deg)" }}>
          <ArrowVector />
        </button>
      </div>
    </>
  );
};

export default MoveButtons;
