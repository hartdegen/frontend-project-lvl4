import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../contexts/AuthContext';
import paths from '../routes.js';
import '../index.css';

const LoginPage = () => {
  const { logIn, isSignedIn } = useContext(AuthContext);
  const [error, setError] = useState();
  const [submitDisabled, setSubmitDisabled] = useState();
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().required(`${t('required')}`),
      password: Yup.string().required(`${t('required')}`),
    }),
    onSubmit: async (values) => {
      setError('');
      setSubmitDisabled(true);
      try {
        const { data: { token, username } } = await axios.post(paths.backendLogin, values);
        logIn(token, username);
      } catch (err) {
        console.error('ERROR CATCH LoginPage', err);
        const errorMessage = err.message === 'Request failed with status code 401' ? t('wrongUsernamePassword') : err.message;
        setError(errorMessage);
        setSubmitDisabled(false);
      }
    },
  });

  return isSignedIn()
    ? <Navigate to={paths.mainPage} />
    : (
      <div className="loginPage w-25 p-3 border mx-auto">
        <Form onSubmit={formik.handleSubmit}>
          <h1>{t('logOn')}</h1>
          <Form.Floating>
            <Form.Control type="text" placeholder={t('yourNick')} id="username" isInvalid={formik.touched.username && formik.errors.username} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} />
            <Form.Label htmlFor="username">{t('yourNick')}</Form.Label>
          </Form.Floating>
          <br />
          <Form.Floating>
            <Form.Control type="password" placeholder={t('password')} id="password" isInvalid={formik.touched.password && formik.errors.password} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
            <Form.Label htmlFor="password">{t('password')}</Form.Label>
          </Form.Floating>
          <br />
          <Button type="submit" disabled={submitDisabled}>{t('logOn')}</Button>
          {error && <div style={{ color: 'red' }}>{error}</div>}

          <br />

          <span>
            {t('noAccount')}
            {' '}

            <Link to={paths.signupPage}>{t('registration')}</Link>
          </span>
        </Form>

      </div>
    );
};

export default LoginPage;
