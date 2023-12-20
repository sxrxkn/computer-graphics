import React from "react";
import { modelSlice } from "../store/reducers/ModelSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

import "./AffineTransformationButtons.css";

const AffineTransformationButtons = () => {
  const {
    addMappingAffineTransformation,
    addScalingAffineTransformation,
    addTransformAffineTransformation,
    addRotateTransformation,
    addCompositionRotateTransformation,
  } = modelSlice.actions;

  const model = useAppSelector((state) => state.modelSlice);
  const dispatch = useAppDispatch();

  return (
    <div className="affineTransformationButtons-block">
      <h2>Affine transformation</h2>{" "}
      <div className="affineTransformationButtons">
        <button
          className="affineTransformationButtons__button"
          onClick={() => {
            const X =
              parseFloat(prompt("Enter transform in X:", "0") ?? "0") || 0;
            const Y =
              parseFloat(prompt("Enter transform in Y:", "0") ?? "0") || 0;
            const Z =
              parseFloat(prompt("Enter transform in Z:", "0") ?? "0") || 0;
            dispatch(addTransformAffineTransformation([X, Y, Z]));
          }}>
          Transform
        </button>

        <button
          className="affineTransformationButtons__button"
          onClick={() => {
            const scaleX =
              parseFloat(prompt("Enter scaling factor in X:", "1") ?? "1") || 1;
            const scaleY =
              parseFloat(prompt("Enter scaling factor in Y:", "1") ?? "1") || 1;
            const scaleZ =
              parseFloat(prompt("Enter scaling factor in Z:", "1") ?? "1") || 1;
            dispatch(addScalingAffineTransformation([scaleX, scaleY, scaleZ]));
          }}>
          Scale
        </button>

        <div className="affineTransformationButtons__rotateButtons">
          <button
            className="affineTransformationButtons__button"
            onClick={() => {
              const axis = prompt(
                "Enter reflection type: (X, Y, Z,)"
              )?.toUpperCase();
              if (axis) {
                const angle =
                  parseFloat(
                    prompt("Enter rotation angle in degrees:", "0") ?? "0"
                  ) || 0;
                dispatch(addRotateTransformation({ axis, angle }));
              }
            }}>
            Rotate
          </button>
          {model.currentRotateTransformation && (
            <button
              className="affineTransformationButtons__button"
              onClick={() => {
                const axis = model.currentRotateTransformation?.axis;
                const angle = model.currentRotateTransformation?.angle;
                if (axis && angle)
                  dispatch(addRotateTransformation({ axis, angle }));
              }}>
              Repeat rotating
            </button>
          )}
        </div>

        <button
          className="affineTransformationButtons__button"
          onClick={() => {
            const reflectionType: string | undefined = prompt(
              "Enter reflection type: (X, Y, Z, XY, XZ, YZ)"
            )?.toUpperCase();
            if (reflectionType)
              dispatch(addMappingAffineTransformation(reflectionType));
          }}>
          Mapping
        </button>

        <button
          className="affineTransformationButtons__button"
          onClick={() => {
            dispatch(addCompositionRotateTransformation());
          }}>
          Compound rotation
        </button>
      </div>
    </div>
  );
};

export default AffineTransformationButtons;
