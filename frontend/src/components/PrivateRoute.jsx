import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isSignedIn } = useContext(AuthContext);

  if (isSignedIn()) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;
