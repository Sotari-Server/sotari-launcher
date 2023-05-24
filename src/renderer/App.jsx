import './App.scss';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './pages/Home/Home';
import NavBar from './components/Navigation/NavBar';
import News from './pages/News/News';
import Settings from './pages/Settings/Settings';
import UserContextProvider from './context/UserContext';
import SignIn from './pages/Sign/SignIn';
import SignUp from './pages/Sign/SignUp';
import Private from './private/Private';
import Profile from './private/pages/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ShowNews from './pages/News/ShowNews';
import AppContextProvider from './context/AppContext';
import { useEffect, useState } from 'react';
import day from 'dayjs';
import LoaderCircle from './components/Loader/LoaderCircle';
import Toast from './components/Toast/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      refetchOnVisibilityChange: false,
    },
  },
});

function App() {
  const [checkJava, setCheckJava] = useState(false);

  const [isUpdate, setIsUpdate] = useState(
    localStorage.getItem('date-update') === day().format('DD/MM/YYYY/HH')
  );

  const [step, setStep] = useState('');
  const [progress, setProgress] = useState('1');
  const [inDownload, setInDownload] = useState(false);

  useEffect(() => {
    window.addEventListener('online', () => {
      sendToast(3000, 'You are online');
    });
    window.addEventListener('offline', () => {
      sendToast(3000, 'You are offline');
    });

    window.electron.ipcRenderer.on('update-available', () => {
      sendToast(8000, 'update available', 'update');
    });

    window.electron.ipcRenderer.on('notify', (event, arg) => {
      sendToast(2000, arg.message);
    });

    window.electron.ipcRenderer.on('step', (params) => {
      setStep(params);
    });
    window.electron.ipcRenderer.on('progress', (params) => {
      setProgress(params);
    });

    window.electron.ipcRenderer.sendMessage('download-java', {});

    window.electron.ipcRenderer.on('java-ok', () => {
      console.log('receipt java ok');
      setCheckJava(true);
      window.electron.ipcRenderer.sendMessage('download-utils');

      window.electron.ipcRenderer.sendMessage('check-update');
    });
    window.electron.ipcRenderer.on('utils-ok', () => {
      console.log('update');
      setIsUpdate(true);
    });
  }, []);

  useEffect(() => {
    if (step === 'END') {
      setInDownload(false);

      localStorage.setItem('date-update', day().format('DD/MM/YYYY/HH'));
    }
  }, [step]);
  const [isToast, setIsToast] = useState({
    open: false,
    message: '',
  });

  const sendToast = (time, message, button) => {
    console.log(button);
    setIsToast({
      ...isToast,
      open: true,
      message: message,
      button: button ? button : null,
    });
    window.setTimeout(() => setIsToast({ ...isToast, open: false }), time);
  };

  return (
    <div className="App">
      <Toast
        start={isToast.open}
        message={isToast.message}
        button={isToast.button}
      />
      <QueryClientProvider client={queryClient}>
        {!checkJava && <LoaderCircle />}
        <HashRouter>
          <AppContextProvider>
            <UserContextProvider>
              <NavBar />
              <Routes>
                <Route
                  path="/*"
                  element={
                    <Home
                      inDownload={inDownload}
                      isUpdate={isUpdate}
                      progress={progress}
                      step={step}
                      setInDownload={setInDownload}
                      checkJava={checkJava}
                    />
                  }
                />
                <Route path="/news" element={<News />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/show-news/:id" element={<ShowNews />} />
                <Route path="/private/" element={<Private />}>
                  <Route path="/private/profile" element={<Profile />} />
                </Route>
              </Routes>
            </UserContextProvider>
          </AppContextProvider>
        </HashRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
