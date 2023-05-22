import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { userContext } from 'renderer/context/UserContext';

const Private = () => {
  const { currentUser } = useContext(userContext);
  if (!currentUser) return <Navigate to="/sign-in" />;
  return <Outlet />;
};

export default Private;
