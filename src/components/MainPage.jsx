import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import UserContext from "./contexts/UserContext.js";

const MainPage = (props) => {
    const isAuth = useContext(UserContext);
    // console.log(111111111, useContext(UserContext));
    return isAuth() ? (
        <div>
            here will be chat section, but for now check this out
            <br />
            <Link to="/login">authentication page</Link>
            <br />
        </div>
    ) : (
        <Navigate to="/login" />
    );
};

export default MainPage;
