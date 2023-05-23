import { useContext, useState } from 'react';
import './Settings.scss';
import { appContext } from 'renderer/context/AppContext';

const Settings = () => {
  const { ram, setRam } = useContext(appContext);
  const [tempRam, setTempRam] = useState(ram);

  const changeRam = () => {
    setRam(tempRam);
  };
  return (
    <div className="Settings page">
      <h1>Settings</h1>
      <h3>Ram: {tempRam}Go</h3>
      <div className="range-input">
        <input
          type="range"
          step={1}
          min={1}
          value={tempRam}
          max={16}
          onChange={(e) => {
            setTempRam(e.target.value);
          }}
        />
      </div>
      <button onClick={changeRam}>Save</button>
    </div>
  );
};

export default Settings;
