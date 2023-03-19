import React from "react";
import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom";

const NotFound404 = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div>
            <h1>Oops!</h1>
            <p>
                This page doesn't exist.
                <Link to="/">Go to main page</Link>
            </p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
};

export default NotFound404;

