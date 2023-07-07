import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'

const PrivateComponent = () => {
  const auth = localStorage.getItem('user');
  return (
    (auth != null) ? <Outlet to="/" /> : <Navigate to="/signin" />
  );
}

export default PrivateComponent;