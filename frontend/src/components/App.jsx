import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18n from 'i18next';
import '../i18n';
import React, { useState, useMemo } from 'react';
import {
  BrowserRouter, Routes, Route, Link,
} from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import SignUpPage from './SignUpPage.jsx';
import LoginPage from './LoginPage.jsx';
import ChatPage from './ChatPage.jsx';
import AuthButton from './chatPageElements/AuthButton.jsx';
import NotFound404 from './NotFound404.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import AuthContext from '../contexts/AuthContext.jsx';
import paths from '../routes.js';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('username'));
  const authContext = useMemo(() => ({
    loggedIn,
    getToken: () => localStorage.getItem('token'),
    getUsername: () => localStorage.getItem('username'),
    logIn: (token, username) => {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      setLoggedIn(true);
    },
    logOut: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setLoggedIn(false);
    },
  }), [loggedIn]);
  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Container>
        <Navbar className="justify-content-between">
          <Navbar.Brand as={Link} to={paths.mainPage}>{i18n.t('hexletChat')}</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to={paths.signupPage}>{i18n.t('signUp')}</Nav.Link>
          </Nav>
          <AuthButton />
        </Navbar>
        <Routes>
          <Route path="*" element={<NotFound404 />} />
          <Route path={paths.mainPage} element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path={paths.loginPage} element={<LoginPage />} />
          <Route path={paths.signupPage} element={<SignUpPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
    <ToastContainer />
  </AuthProvider>
);

export default App;
