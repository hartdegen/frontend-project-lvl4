import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import UserContext from "./UserContext.js";

const MainPage = (props) => {
    const { isAuth } = useContext(UserContext);
    return isAuth() ? (
        <div>
            here will be chat section, but for now check this out
            <br />
            <Link to="/login">authorization page</Link>
            <br />
        </div>
    ) : (
        <Navigate to="/login" />
    );
};

export default MainPage;
