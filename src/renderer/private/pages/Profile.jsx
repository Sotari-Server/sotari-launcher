import { signOut } from 'firebase/auth';
import React, { useCallback, useContext, useRef } from 'react';
import { userContext } from 'renderer/context/UserContext';
// logout with firebase
// edit pen icon
import { AiOutlineEdit } from 'react-icons/ai';
import './Profile.scss';
import { auth } from 'renderer/firebase-config';
const Profile = () => {
  const { currentUser, uploadUserPhoto } = useContext(userContext);
  const inputRef = useRef();

  const handleImageEdit = useCallback(async () => {
    const file = inputRef.current.files[0];
    if (!file) return;
    try {
      await uploadUserPhoto(file);
    } catch (err) {
      console.log(err);
    }
  }, [uploadUserPhoto]);

  return (
    <div className="page profile">
      {/* open system folder */}
      <input
        style={{
          display: 'none',
        }}
        ref={inputRef}
        type="file"
        id="image-input"
        onChange={handleImageEdit}
      />
      <div className="user">
        <div className="img-input">
          <img src={currentUser.photoURL} />
          <button
            onClick={() => {
              inputRef.current.click();
            }}
          >
            <AiOutlineEdit />
          </button>
        </div>
        <h1>{currentUser.displayName}</h1>
      </div>

      <button
        onClick={() => {
          signOut(auth);
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Profile;
