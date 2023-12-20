import React from "react";
import { useAppDispatch } from "../hooks/redux";
import { cameraSlice } from "../store/reducers/CameraSlice";
import { modelSlice } from "../store/reducers/ModelSlice";
import "./SettingsButtons.css";

const SettingButtons = () => {
  const dispatch = useAppDispatch();

  const { scaleCamera } = cameraSlice.actions;
  const { addNewFigure } = modelSlice.actions;
  return (
    <>
      <div className="settings-block">
        <h2>Settings</h2>
        <div className="settings-block__buttons-block">
          <button
            className="settings-block__button"
            onClick={() => {
              dispatch(scaleCamera());
            }}>
            Scale camera
          </button>
          <button
            className="settings-block__button"
            onClick={() => {
              dispatch(addNewFigure());
            }}>
            Add new figure
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingButtons;
