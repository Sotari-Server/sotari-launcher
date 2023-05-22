import './Settings.scss';

const Settings = () => {
  return (
    <div className="Settings page">
      <h1>Settings</h1>
      <div className="number-input">
        <input type="number" />
        <button>+</button>
        <button>-</button>
      </div>
    </div>
  );
};

export default Settings;
