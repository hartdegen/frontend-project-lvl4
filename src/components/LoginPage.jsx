import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";

import UserContext from "./contexts/UserContext.js";

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
        <p>you have been already authorized</p>
    ) : (
        <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username && (
                    <div style={{ color: "red" }}>{formik.errors.username}</div>
                )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                    <div style={{ color: "red" }}>{formik.errors.password}</div>
                )}
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            {authError && <div style={{ color: "red" }}>{authError}</div>}
        </Form>
    );
};

export default LoginPage;
