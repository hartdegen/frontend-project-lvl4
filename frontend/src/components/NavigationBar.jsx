import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import paths from '../routes.js';
import AuthContext from '../contexts/AuthContext';

const NavigationBar = () => {
  const { t } = useTranslation();
  const { logOut, isSignedIn } = useContext(AuthContext);

  return (
    <Navbar bg="light">
      <ToastContainer />
      <Container>
        <Navbar.Brand href={paths.mainPage}>{t('hexletChat')}</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {isSignedIn() && <a onClick={logOut} href={paths.loginPage}>{t('logOut')}</a>}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
