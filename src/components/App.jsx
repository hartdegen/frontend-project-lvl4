import { Routes, Route, Link } from "react-router-dom";
import React from "react";
// import ReactDOM from "react-dom";

import MainPage from "./MainPage.jsx";
import Notfoundpage from "./NotFound404.jsx";
import LoginPage from "./LoginPage.jsx";

function App() {
    return (
        <>
            <header>
                <h1>
                    <Link to="/">MainPage</Link>
                    <Link to="/login">SignIn</Link>
                </h1>
            </header>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Notfoundpage />} />
            </Routes>
        </>
    );
}

export default App;
