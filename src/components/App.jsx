import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import UserContext from "./contexts/UserContext.js";
import MainPage from "./MainPage.jsx";
import Notfoundpage from "./NotFound404.jsx";
import LoginPage from "./LoginPage.jsx";

const isAuth = () => localStorage.getItem("token") !== null;
const App = () => {
    return (
        <>
            <UserContext.Provider value={isAuth}>
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
            </UserContext.Provider>
        </>
    );
};

export default App;
