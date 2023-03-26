import { useTranslation } from 'react-i18next';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";

const RegistrationPage = (props) => {
    const [authError, setAuthError] = useState();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirm: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, `${t('min3Symbols')}`)
                .max(15, `${t('max15Symbols')}`)
                .required(`${t('required')}`),
            password: Yup.string()
                .min(3, `${t('min3Symbols')}`)
                .required(`${t('required')}`),
            confirm: Yup.string()
                .min(3, `${t('min3Symbols')}`)
                .required(`${t('required')}`)
                .oneOf([Yup.ref("password")], `${t('passwordsSholdBeSame')}`),
        }),
        onSubmit: async (values) => {
            setAuthError("");
            try {
                const { data } = await axios.post("/api/v1/signup", values);
                console.log(`data from /api/v1/signup \n`, data);
                navigate("/");
            } catch (err) {
                console.error(`ERROR CATCH`, err);
                setAuthError(`${err.message} - ${err.response.statusText}`);
            }
        },
    });

    return (
        <>
            <Link to="/">{t('toMainPage')}</Link>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <div>{t('registration')}</div>
                    <input
                        type="text"
                        placeholder={t('from3to20')}
                        id="username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    <label htmlFor="username">{t('username')}</label>
                    {formik.touched.username && formik.errors.username && (
                        <div style={{ color: "red" }}>
                            {formik.errors.username}
                        </div>
                    )}
                </div>
                <div>
                    <input
                        type="password"
                        placeholder={t('minimum3symbols')}
                        id="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    <label htmlFor="password">{t('password')}</label>
                    {formik.touched.password && formik.errors.password && (
                        <div style={{ color: "red" }}>
                            {formik.errors.password}
                        </div>
                    )}
                </div>
                <div>
                    <input
                        type="password"
                        placeholder={t('passwordsSholdBeSame')}
                        id="confirm"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirm}
                    />
                    <label htmlFor="confirm">{t('confirmPassword')}</label>
                    {formik.touched.confirm && formik.errors.confirm && (
                        <div style={{ color: "red" }}>
                            {formik.errors.confirm}
                        </div>
                    )}
                </div>
                <input type="submit" value={t('submit')} />
                {authError && <div style={{ color: "red" }}>{authError}</div>}
            </form>
        </>
    );
};

export default RegistrationPage;

