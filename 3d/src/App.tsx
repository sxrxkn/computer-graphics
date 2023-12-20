import React from "react";
import Scene3D from "./components/Scene3D";
import RotateButtons from "./components/RotateButtons";
import MoveButtons from "./components/MoveButtons";
import AffineTransformationButtons from "./components/AffineTransformationButtons";
import SettingButtons from "./components/SettingsButtons";

import "./App.css";

const App = () => {
  return (
    <div>
      <Scene3D />
      <div className="affineTransformationsButtons">
        <AffineTransformationButtons />
      </div>
      <div className="movingButtons">
        <RotateButtons />
        <MoveButtons />
      </div>
      <div className="settingsButtons">
        <SettingButtons />
      </div>
    </div>
  );
};

export default App;
