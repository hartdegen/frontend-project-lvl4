import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useTranslation } from 'react-i18next';
import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AuthContext from '../contexts/AuthContext';

const LoginPage = () => {
  const { isAuth } = useContext(AuthContext);
  const [authError, setAuthError] = useState();
  const [submitDisabled, setSubmitDisabled] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, `${t('from3to20')}`)
        .max(20, `${t('from3to20')}`)
        .required(`${t('required')}`),
      password: Yup.string()
        .min(5, `${t('min6Symbols')}`)
        .required(`${t('required')}`),
    }),
    onSubmit: async (values) => {
      setAuthError('');
      setSubmitDisabled(true);
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
        setSubmitDisabled(false);
      }
    },
  });

  return isAuth() ? (
    <Navigate to="/" />
  ) : (
    <>
      <Form onSubmit={formik.handleSubmit} style={{ width: '500px' }}>
        <h1>{t('logOn')}</h1>
        <Form.Floating>
          <Form.Control
            type="text"
            placeholder={t('yourNick')}
            id="username"
            isInvalid={formik.touched.username && formik.errors.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          <Form.Label htmlFor="username">{t('yourNick')}</Form.Label>
        </Form.Floating>
        <br />
        <Form.Floating>
          <Form.Control
            type="password"
            placeholder={t('password')}
            id="password"
            isInvalid={formik.touched.password && formik.errors.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <Form.Label htmlFor="password">{t('password')}</Form.Label>
        </Form.Floating>
        <br />
        <Button type="submit" disabled={submitDisabled}>{t('logOn')}</Button>
        {authError && <div style={{ color: 'red' }}>{authError}</div>}
      </Form>
      <p>
        <Link to="/signup">{t('registration')}</Link>
      </p>
    </>
  );
};

export default LoginPage;
