import React from "react";
import { Link } from "react-router-dom";

const NotFound404 = () => {
    return (
        <div>
            This page doesn't exist. Go <Link to="/">home</Link>
        </div>
    );
};

export default NotFound404;
