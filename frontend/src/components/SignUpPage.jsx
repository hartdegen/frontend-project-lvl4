import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import paths from '../routes.js';
import useAuth from '../hooks/useAuth.jsx';

const SignUpPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
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
        const {
          data: { token, username },
        } = await axios.post(paths.backendSignup, values);
        auth.logIn(token, username);
        navigate(paths.mainPage);
      } catch (err) {
        console.error('ERROR CATCH SignUpPage', err);
        const errorMessage = err.message === 'Request failed with status code 409'
          ? t('userAlreadyExists')
          : err.message;
        setError(errorMessage);
        setSubmitDisabled(false);
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <Form onSubmit={formik.handleSubmit}>
                <h1>{t('registration')}</h1>
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder={t('username')}
                    id="username"
                    isInvalid={formik.touched.username && formik.errors.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                  />
                  <Form.Label htmlFor="username">{t('username')}</Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.touched.username && formik.errors.username}
                  </Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.touched.password && formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Floating>
                <br />
                <Form.Floating>
                  <Form.Control
                    type="password"
                    placeholder={t('confirmPassword')}
                    id="confirm"
                    isInvalid={formik.touched.confirm && formik.errors.confirm}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirm}
                  />
                  <Form.Label htmlFor="confirm">{t('confirmPassword')}</Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.touched.confirm && formik.errors.confirm}
                  </Form.Control.Feedback>
                </Form.Floating>
                <br />
                <Button type="submit" disabled={submitDisabled}>
                  {t('signUp')}
                </Button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
