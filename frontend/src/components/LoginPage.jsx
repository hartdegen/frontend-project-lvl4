import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import {UserContext} from "../index.js";

const LoginPage = (props) => {
    const isAuth = useContext(UserContext);
    const [authError, setAuthError] = useState();
    const navigate = useNavigate();
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
                const {
                    data: { token },
                } = await axios.post("/api/v1/login", values);
                localStorage.setItem("token", token);
                navigate("/");
            } catch (err) {
                console.error(`ERROR CATCH`, err);
                setAuthError(`${err.message} - ${err.response.statusText}`);
            }
        },
    });

    return isAuth() ? (
        <><p>you have been already authorized</p><Link to="/">Go back to main page</Link></>
    ) : (
        <>
        <Link to="/">Go back to main page</Link>
        <form onSubmit={formik.handleSubmit} name="usernamepassword">
            <div>
                <div>username & password — admin</div><br></br>
                <label htmlFor="username">Username</label>
                <input 
                    type="text"
                    placeholder="Type username"
                    id="username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username} 
                />
                {formik.touched.username && formik.errors.username && (<div style={{ color: "red" }}>{formik.errors.username}</div>)}
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
                    <div style={{ color: "red" }}>{formik.errors.password}</div>
                )}
            </div>
            <input type="submit" value="Submit"></input>
            {authError && <div style={{ color: "red" }}>{authError}</div>}
        </form>
        </>
    );
};

export default LoginPage;