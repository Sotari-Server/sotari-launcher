import React, { useContext, useRef, useState } from 'react';
import './form.scss';
import logo from '../../assets/logo.png';
import { userContext } from 'renderer/context/UserContext';
import { FcGoogle } from 'react-icons/fc';
// icon microsoft

import Loader from 'renderer/components/Loader/Loader';
const SignIn = () => {
  const { signup, setUsername, signinWithGoogle } = useContext(userContext);
  const [inConnection, setInConnection] = useState(false);
  const allInputs = useRef([]);
  const addInput = (el) => {
    if (el && !allInputs.current.includes(el)) {
      allInputs.current.push(el);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = allInputs.current[0].value;
    const username = allInputs.current[1].value;
    const password = allInputs.current[2].value;
    const confirmPassword = allInputs.current[3].value;
    if (password !== confirmPassword) {
      alert('passwords do not match');

      return;
    }
    if (password.length < 6) {
      alert('password must be at least 6 characters');

      return;
    }
    if (username.length < 5) {
      alert('username must be at least 5 characters');

      return;
    }

    try {
      await signup(email, password);
      await setUsername(username);
      setInConnection(false);
    } catch (err) {
      alert(err.message);
      setInConnection(false);
      return;
    }
  };

  const handleGoogle = async (e) => {
    setInConnection(true);
    e.preventDefault();
    try {
      await signinWithGoogle();
      setInConnection(false);
    } catch (err) {
      alert(err.message);
      setInConnection(false);
    }
  };

  return (
    <div className="page sign">
      <div className="logo">
        <img src={logo} />
      </div>
      {inConnection ? (
        <form
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          action=""
        >
          <Loader />
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <div className="input">
            <input
              ref={addInput}
              placeholder="Email"
              type="email"
              name="email"
              id="email"
            />
            <div className="line"></div>
          </div>
          <div className="input">
            <input
              ref={addInput}
              placeholder="Username"
              type="text"
              name="username"
              id="username"
            />
            <div className="line"></div>
          </div>
          <div className="input">
            <input
              ref={addInput}
              placeholder="Password"
              type="password"
              name="password"
              id="password"
            />
            <div className="line"></div>
          </div>
          <div className="input">
            <input
              ref={addInput}
              placeholder="Confirme Password"
              type="password"
              name="password"
              id="password"
            />
            <div className="line"></div>
          </div>
          <button type="submit">Sign Up</button>
          <div className="authProvider">
            <button onClick={handleGoogle} className="icon">
              <FcGoogle />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignIn;
