/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
} from 'firebase/auth';
import { useState, createContext, useEffect } from 'react';
import {
  auth,
  GoogleProvider,
  MicrosoftProvider,
  storage,
} from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addReactLog } from 'renderer/utils/tools';

export const userContext = createContext(null);

function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password).then((res) => {
      return res;
    });

  const signin = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        addReactLog('Signin', err);
      });

  const signinWithGoogle = () =>
    signInWithRedirect(auth, GoogleProvider)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        addReactLog('Signin', err);
      });

  const signinWithMicrosoft = () =>
    signInWithPopup(auth, MicrosoftProvider)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        addReactLog('Signin', err);
      });

  const resetPassword = (email) => sendPasswordResetEmail(auth, email).catch;

  const setUsername = async (username) => {
    console.log(username);
    try {
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      setCurrentUser((currentUser) => (currentUser.displayName = username));
    } catch (err) {
      addReactLog('Update Profile', err);
    }
  };

  const uploadUserPhoto = async (photo) => {
    const storageRef = ref(storage, `users/${currentUser.uid}/profile`);
    try {
      console.log('uploading...');
      const upload = await uploadBytes(storageRef, photo);
      const downloadURL = await getDownloadURL(upload.ref);
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL,
      });
      setCurrentUser({
        ...currentUser,
        photoURL: downloadURL,
      });
    } catch (err) {
      addReactLog('Ppdate Profile', err);
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('save-json-user', {
      username: currentUser?.displayName,
      photoURL: currentUser?.photoURL,
      email: currentUser?.email,
      uid: currentUser?.uid,
      token: currentUser?.refreshToken,
    });
  }, [currentUser]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        navigate('/private/profile');
      }
    });
    return unsubscribe;
  }, []);
  return (
    <userContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        signup,
        signin,
        setUsername,
        resetPassword,
        uploadUserPhoto,
        signinWithGoogle,
        signinWithMicrosoft,
      }}
    >
      {children}
    </userContext.Provider>
  );
}

export default UserContextProvider;
