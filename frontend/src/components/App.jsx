import i18n from 'i18next';
import '../i18n';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useContext } from 'react';
import ChatPage from './ChatPage.jsx';
import NotFound404 from './NotFound404.jsx';
import LoginPage from './LoginPage.jsx';
import RegistrationPage from './RegistrationPage.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import paths from '../routes.js';
import AuthContext from '../contexts/AuthContext';

const router = createBrowserRouter([
  {
    path: paths.mainPage,
    element: <PrivateRoute><ChatPage /></PrivateRoute>,
    errorElement: <NotFound404 />,
  },
  { path: paths.loginPage, element: <LoginPage /> },
  { path: paths.signupPage, element: <RegistrationPage /> },
]);

const App = () => {
  const { logOut, isSignedIn } = useContext(AuthContext);

  return (
    <div className="app">
      <Navbar bg="light">
        <ToastContainer />
        <Container>
          <Navbar.Brand href={paths.mainPage}>{i18n.t('hexletChat')}</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {isSignedIn() && <a onClick={logOut} href={paths.loginPage}>{i18n.t('logOut')}</a>}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
