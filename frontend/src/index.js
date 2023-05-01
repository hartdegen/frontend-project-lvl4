import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import { Provider as ProviderRollbar, ErrorBoundary } from '@rollbar/react';

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import i18n from 'i18next';
import './i18n';

import { AuthProvider } from './contexts/AuthContext.js';
import { SocketProvider } from './contexts/SocketContext.js';

// import App from './components/App.jsx';
import ChatPage from './components/ChatPage.jsx';
import NotFound404 from './components/NotFound404.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegistrationPage from './components/RegistrationPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import store from './slices/index.js';
import paths from './routes.js';

const rollbarConfig = {
  // accessToken: ${{ vars.ACCESSTOKEN }},
  environment: 'testenv',
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute><ChatPage /></PrivateRoute>,
    errorElement: <NotFound404 />,
  },
  { path: paths.toLoginPage, element: <LoginPage /> },
  { path: paths.toSignUpPage, element: <RegistrationPage /> },
]);

const mountNode = document.getElementById('root');
const root = ReactDOM.createRoot(mountNode);

root.render(
  <ProviderRollbar config={rollbarConfig}>
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <SocketProvider>
            <Navbar bg="light">
              <Container>
                <Navbar.Brand href="/">{i18n.t('hexletChat')}</Navbar.Brand>
              </Container>
            </Navbar>
            <RouterProvider router={router} />
          </SocketProvider>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  </ProviderRollbar>,
);
