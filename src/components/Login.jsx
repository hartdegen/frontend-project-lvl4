import React from 'react';
 import { useFormik } from 'formik';
 import * as Yup from 'yup';
 
 const Login = () => {
    const formik = useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      validationSchema: Yup.object({
        username: Yup.string()
          .max(15, '15 characters maximum')
          .required('Required'),
          password: Yup.string().min(3, '3 characters minimum').required('Required'),
      }),
      onSubmit: values => {
        alert(JSON.stringify(values, null, 2));
      },
    });
    return (
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">USERNAME</label>
        <input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username ? (
          <div>{formik.errors.username}</div>
        ) : null}
  
        <label htmlFor="password">PASSWORD</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : null}
  
        <button type="submit">Submit</button>
      </form>
    );
  };

 export default Login;
