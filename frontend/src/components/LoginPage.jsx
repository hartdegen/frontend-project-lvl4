import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../index.js";

const LoginPage = (props) => {
    const isAuth = useContext(UserContext);
    const [authError, setAuthError] = useState();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, "3 characters minimum")
                .max(15, "15 characters maximum")
                .required("Required"),
            password: Yup.string()
                .min(3, "3 characters minimum")
                .required("Required"),
        }),
        onSubmit: async (values) => {
            setAuthError("");
            try {
                // const data = await axios.post("/api/v1/login", values);
                // const token = data.token;
                // console.log(`data from /api/v1/login \n`, data)
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
            <Link to="/">Go back to main page</Link>
            <br />
            <Link to="/registration">Go to registration page</Link>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <div>username & password — admin</div>
                    <br></br>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        placeholder="Type username"
                        id="username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div style={{ color: "red" }}>
                            {formik.errors.username}
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Type password"
                        id="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div style={{ color: "red" }}>
                            {formik.errors.password}
                        </div>
                    )}
                </div>
                <input type="submit" value="Submit" />
                {authError && <div style={{ color: "red" }}>{authError}</div>}
            </form>
        </>
    );
};

export default LoginPage;