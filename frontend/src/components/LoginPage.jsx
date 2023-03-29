import { useTranslation } from "react-i18next";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../index.js";

const LoginPage = () => {
    const { t } = useTranslation();
    const isAuth = useContext(UserContext);
    const [authError, setAuthError] = useState();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, `${t("min3Symbols")}`)
                .max(15, `${t("max15Symbols")}`)
                .required(`${t("required")}`),
            password: Yup.string()
                .min(3, `${t("min3Symbols")}`)
                .required(`${t("required")}`),
        }),
        onSubmit: async (values) => {
            setAuthError("");
            try {
                const {
                    data: { token, username },
                } = await axios.post("/api/v1/login", values);
                localStorage.setItem("token", token);
                localStorage.setItem("username", username);
                <Navigate to="/" />;
            } catch (err) {
                console.error(`ERROR CATCH`, err);
                setAuthError(`${err.message} - ${err.response.statusText}`);
            }
        },
    });

    return isAuth() ? (
        <Navigate to="/" />
    ) : (
        <>
            <Link to="/">{t("toMainPage")}</Link>
            <br />
            <Link to="/signup">{t("toRegistrationPage")}</Link>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input type="text" placeholder={t('typeUsername')} id="username" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} />
                    <label htmlFor="username">{t("username")}</label>
                    {formik.touched.username && formik.errors.username && <div style={{ color: "red" }}>{formik.errors.username}</div>}
                </div>
                <div>
                    <input type="password" placeholder={t('typePassword')} id="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                    <label htmlFor="password">{t("password")}</label>
                    {formik.touched.password && formik.errors.password && <div style={{ color: "red" }}>{formik.errors.password}</div>}
                </div>
                <input type="submit" value={t('submit')} />
                {authError && <div style={{ color: "red" }}>{authError}</div>}
            </form>
        </>
    );
};

export default LoginPage;
