import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import paths from '../routes.js';

const PrivateRoute = ({ children }) => {
  const { isSignedIn } = useContext(AuthContext);
  return isSignedIn() ? children : <Navigate to={paths.loginPage} />;
};

export default PrivateRoute;
