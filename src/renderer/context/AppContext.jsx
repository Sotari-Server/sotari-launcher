import { createContext, useEffect, useState } from 'react';

export const appContext = createContext();

const AppContextProvider = ({ children }) => {
  const [ram, setRam] = useState(3);
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('save-json-settings', {
      ram: ram,
    });
  }, [ram]);
  return (
    <appContext.Provider value={{ ram, setRam }}>
      {children}
    </appContext.Provider>
  );
};

export default AppContextProvider;
