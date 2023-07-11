import i18n from 'i18next';
import '../i18n';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChatPage from './ChatPage.jsx';
import NotFound404 from './NotFound404.jsx';
import LoginPage from './LoginPage.jsx';
import RegistrationPage from './RegistrationPage.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import paths from '../routes.js';

const router = createBrowserRouter([
  {
    path: paths.toChatPage,
    element: <PrivateRoute><ChatPage /></PrivateRoute>,
    errorElement: <NotFound404 />,
  },
  { path: paths.toLoginPage, element: <LoginPage /> },
  { path: paths.toRegistrationPage, element: <RegistrationPage /> },
]);

const App = () => (
  <div className="app">
    <Navbar bg="light">
      <ToastContainer />
      <Container>
        <Navbar.Brand href="/">{i18n.t('hexletChat')}</Navbar.Brand>
      </Container>
    </Navbar>
    <RouterProvider router={router} />
  </div>
);

export default App;
