import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useTranslation } from 'react-i18next';
import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { UserContext } from '../index.js';

const LoginPage = () => {
  const { t } = useTranslation();
  const isAuth = useContext(UserContext);
  const [authError, setAuthError] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const changeUsername = (e) => setUsername(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);
  const values = { username, password };
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
      err.response.statusText === 'Unauthorized'
        ? setAuthError(t('wrongUsernamePassword'))
        : setAuthError(`${err.message} - ${err.response.statusText}`);
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
            onChange={changeUsername}
            value={username}
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
