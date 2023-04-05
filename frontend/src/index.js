import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import { Provider as ProviderRollbar, ErrorBoundary } from '@rollbar/react';

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { I18nextProvider } from 'react-i18next';
import instance from './i18nInstance.js';

import UserContext from './contexts/UserContext.js';
// import App from './components/App.jsx';
import ChatPage from './ChatPage.jsx';
import NotFound404 from './components/NotFound404.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegistrationPage from './components/RegistrationPage.jsx';

import store from './slices/index.js';

const rollbarConfig = {
  // accessToken: "efc0d443c8a24fcdbbfddea533414883",
  environment: 'testenv',
};

const isAuth = () => localStorage.getItem('token') !== null;
const router = createBrowserRouter([
  {
    path: '/',
    element: <ChatPage />,
    errorElement: <NotFound404 />,
    // children: [
    //     {
    //         path: "/login",
    //         element: <LoginPage/>
    //     }
    // ]
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <RegistrationPage /> },
]);

const mountNode = document.getElementById('root');
const root = ReactDOM.createRoot(mountNode);

root.render(
  <ProviderRollbar config={rollbarConfig}>
    <ErrorBoundary>
      <Provider store={store}>
        <UserContext.Provider value={isAuth}>
          <I18nextProvider i18n={instance}>
            <Navbar bg="light">
              <Container>
                <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
              </Container>
            </Navbar>
            <RouterProvider router={router} />
          </I18nextProvider>
        </UserContext.Provider>
      </Provider>
    </ErrorBoundary>
  </ProviderRollbar>,
);
