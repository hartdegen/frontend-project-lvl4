import { Routes, Route, Link } from "react-router-dom";
import React from "react";
// import ReactDOM from "react-dom";

import Homepage from "./Homepage.jsx";
import Notfoundpage from "./NotFound404.jsx";
import Login from "./Login.jsx";

function App() {
  return (
    <>
      <header>
        <h1>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </h1>
      </header>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Notfoundpage />} />
      </Routes>
    </>
  );
}

export default App;
