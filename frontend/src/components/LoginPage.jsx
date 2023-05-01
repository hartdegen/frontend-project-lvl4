import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useTranslation } from 'react-i18next';
import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const { isAuth } = useContext(AuthContext);
  const [authError, setAuthError] = useState();
  const [nick, setNick] = useState('');
  const [password, setPassword] = useState('');
  const changeNick = (e) => setNick(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);
  const values = { username: nick, password };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const {
        data: { token, username },
      } = await axios.post('/api/v1/login', values);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      navigate('/');
    } catch (err) {
      console.error('ERROR CATCH', err);
      const error = err.response.statusText === 'Unauthorized'
        ? t('wrongUsernamePassword') : `${err.message} - ${err.response.statusText}`;
      setAuthError(error);
    }
  };

  return isAuth() ? (
    <Navigate to="/" />
  ) : (
    <>
      <Form onSubmit={handleSubmit} style={{ width: '500px' }}>
        <h1>{t('logOn')}</h1>
        <Form.Floating>
          <Form.Control
            type="text"
            placeholder={t('yourNick')}
            id="username"
            onChange={changeNick}
            value={nick}
          />
          <Form.Label htmlFor="username">{t('yourNick')}</Form.Label>
        </Form.Floating>
        <br />
        <Form.Floating>
          <Form.Control
            type="password"
            placeholder={t('password')}
            id="password"
            onChange={changePassword}
            value={password}
          />
          <Form.Label htmlFor="password">{t('password')}</Form.Label>
        </Form.Floating>
        <br />
        <Button type="submit">{t('logOn')}</Button>
        {authError && <div style={{ color: 'red' }}>{authError}</div>}
      </Form>
      <p>
        <Link to="/signup">{t('registration')}</Link>
      </p>
    </>
  );
};

export default LoginPage;
