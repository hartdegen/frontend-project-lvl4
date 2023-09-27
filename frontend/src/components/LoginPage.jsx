import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import paths from '../routes.js';
import useAuth from '../hooks/useAuth.jsx';

const LoginPage = () => {
  const auth = useAuth();
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
        auth.logIn(token, username);
      } catch (err) {
        console.error('ERROR CATCH LoginPage', err);
        const errorMessage = err.message === 'Request failed with status code 401' ? t('wrongUsernamePassword') : err.message;
        setError(errorMessage);
        setSubmitDisabled(false);
      }
    },
  });

  return auth.loggedIn
    ? <Navigate to={paths.mainPage} />
    : (
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <Form className="" onSubmit={formik.handleSubmit}>
                  <h1>{t('logOn')}</h1>
                  <Form.Floating className="">
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
            </div>
          </div>
        </div>
      </div>
    );
};

export default LoginPage;
