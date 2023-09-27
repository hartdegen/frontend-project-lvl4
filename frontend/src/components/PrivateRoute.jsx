import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import paths from '../routes.js';
import useAuth from '../hooks/useAuth.jsx';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to={paths.loginPage} state={{ from: location }} />
  );
};

export default PrivateRoute;
