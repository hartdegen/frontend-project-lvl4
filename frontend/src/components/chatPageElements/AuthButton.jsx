import i18n from 'i18next';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth.jsx';
import paths from '../../routes.js';

const AuthButton = () => {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{i18n.t('logOut')}</Button>
      : <Button as={Link} to={paths.loginPage} state={{ from: location }}>{i18n.t('logOn')}</Button>
  );
};

export default AuthButton;
