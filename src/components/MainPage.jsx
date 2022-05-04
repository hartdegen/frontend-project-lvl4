import React from "react";
import { Link, Navigate } from "react-router-dom";

const MainPage = () =>
    localStorage.getItem("token") === null ? (
        <Navigate to="/login" />
    ) : (
        <div>
            here will be chat section
            <br />
            but for now check this out
            <br />
            <Link to="/login">authorization page</Link>
            <br />
        </div>
    );

export default MainPage;
