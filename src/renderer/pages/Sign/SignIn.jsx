import React, { useContext, useRef, useState } from 'react';
import './form.scss';
import logo from '../../assets/logo.png';
import { NavLink } from 'react-router-dom';
import { userContext } from 'renderer/context/UserContext';
import { FcGoogle } from 'react-icons/fc';
import Loader from 'renderer/components/Loader/Loader';

const SignIn = () => {
  const [inConnection, setInConnection] = useState(false);

  const { signin, signinWithGoogle, resetPassword } = useContext(userContext);
  const allInputs = useRef([]);
  const addInput = (el) => {
    if (el && !allInputs.current.includes(el)) {
      allInputs.current.push(el);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInConnection(true);
    const email = allInputs.current[0].value;
    const password = allInputs.current[1].value;
    try {
      await signin(email, password);
      setInConnection(false);
    } catch (err) {
      alert(err.message);
      setInConnection(false);
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const email = allInputs.current[0].value;
    if (email.length < 1) {
      alert('Pleaase enter your email');
      return;
    }
    if (email.length < 5) {
      alert('email must be at least 5 characters');
      return;
    }
    try {
      await resetPassword(email);
      alert('Check your email');
    } catch (err) {
      alert(err.message);
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader />
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
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
              placeholder="Password"
              type="password"
              name="password"
              id="password"
            />
            <div className="line"></div>
          </div>

          <button type="submit">Sign In</button>
          <button
            onClick={handleResetPassword}
            style={{
              width: 230,
            }}
          >
            Forgot password ?
          </button>

          <p>
            You D'ont have an account ?{' '}
            <NavLink className={'accent'} to="/sign-up">
              Sign Up
            </NavLink>
          </p>
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
