import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../contexts/AuthContext';
import paths from '../routes.js';

const RegistrationPage = () => {
  const { logIn, isSignedIn } = useContext(AuthContext);
  const [error, setError] = useState();
  const [submitDisabled, setSubmitDisabled] = useState();
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: { username: '', password: '', confirm: '' },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, `${t('from3to20')}`)
        .max(20, `${t('from3to20')}`)
        .required(`${t('required')}`),
      password: Yup.string()
        .min(6, `${t('min6Symbols')}`)
        .required(`${t('required')}`),
      confirm: Yup.string()
        .min(6, `${t('min6Symbols')}`)
        .required(`${t('required')}`)
        .oneOf([Yup.ref('password')], `${t('passwordsSholdBeSame')}`),
    }),
    onSubmit: async (values) => {
      setError('');
      setSubmitDisabled(true);
      try {
        const { data: { token, username } } = await axios.post(paths.backendSignup, values);
        logIn(token, username);
      } catch (err) {
        console.error('ERROR CATCH RegistrationPage', err);
        const errorMessage = err.message === 'Request failed with status code 409' ? t('userAlreadyExists') : err.message;
        setError(errorMessage);
        setSubmitDisabled(false);
      }
    },
  });

  return isSignedIn()
    ? <Navigate to={paths.mainPage} />
    : (
      <Form onSubmit={formik.handleSubmit} style={{ width: '500px' }}>
        <h1>{t('registration')}</h1>
        <Form.Floating>
          <Form.Control type="text" placeholder={t('username')} id="username" isInvalid={formik.touched.username && formik.errors.username} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} />
          <Form.Label htmlFor="username">{t('username')}</Form.Label>
          <Form.Control.Feedback type="invalid" tooltip>{formik.touched.username && formik.errors.username}</Form.Control.Feedback>
        </Form.Floating>
        <br />
        <Form.Floating>
          <Form.Control type="password" placeholder={t('password')} id="password" isInvalid={formik.touched.password && formik.errors.password} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
          <Form.Label htmlFor="password">{t('password')}</Form.Label>
          <Form.Control.Feedback type="invalid" tooltip>{formik.touched.password && formik.errors.password}</Form.Control.Feedback>
        </Form.Floating>
        <br />
        <Form.Floating>
          <Form.Control type="password" placeholder={t('confirmPassword')} id="confirm" isInvalid={formik.touched.confirm && formik.errors.confirm} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirm} />
          <Form.Label htmlFor="confirm">{t('confirmPassword')}</Form.Label>
          <Form.Control.Feedback type="invalid" tooltip>{formik.touched.confirm && formik.errors.confirm}</Form.Control.Feedback>
        </Form.Floating>
        <br />
        <Button type="submit" disabled={submitDisabled}>{t('signUp')}</Button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </Form>
    );
};

export default RegistrationPage;
