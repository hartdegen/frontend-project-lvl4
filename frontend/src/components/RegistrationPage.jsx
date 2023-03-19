import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";

const RegistrationPage = (props) => {
    const [authError, setAuthError] = useState();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirm: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, "3 characters minimum")
                .max(15, "15 characters maximum")
                .required("Required"),
            password: Yup.string()
                .min(3, "3 characters minimum")
                .required("Required"),
            confirm: Yup.string()
                .min(3, "3 characters minimum")
                .required("Required")
                .oneOf([Yup.ref("password")], "Passwords must match"),
        }),
        onSubmit: async (values) => {
            setAuthError("");
            try {
                // const data = await axios.post("/api/v1/login", values);
                // const token = data.token;
                // console.log(`data from /api/v1/login \n`, data)
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
            <Link to="/">Go back to main page</Link>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <div>Registration</div>
                    <br />
                    <input
                        type="text"
                        placeholder="От 3 до 20 символов"
                        id="username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    <label htmlFor="username">Имя пользователя</label>
                    {formik.touched.username && formik.errors.username && (
                        <div style={{ color: "red" }}>
                            {formik.errors.username}
                        </div>
                    )}
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Не менее 3 символов"
                        id="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    <label htmlFor="password">Пароль</label>
                    {formik.touched.password && formik.errors.password && (
                        <div style={{ color: "red" }}>
                            {formik.errors.password}
                        </div>
                    )}
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Пароли должны совпадать"
                        id="confirm"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirm}
                    />
                    <label htmlFor="confirm">Подтвердите пароль</label>
                    {formik.touched.confirm && formik.errors.confirm && (
                        <div style={{ color: "red" }}>
                            {formik.errors.confirm}
                        </div>
                    )}
                </div>
                <input type="submit" value="Submit" />
                {authError && <div style={{ color: "red" }}>{authError}</div>}
            </form>
        </>
    );
};

export default RegistrationPage;

