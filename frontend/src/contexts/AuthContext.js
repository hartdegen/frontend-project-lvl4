import { createContext } from 'react';

const AuthContext = createContext();
const values = {
  getToken: () => localStorage.getItem('token'),
  isSignedIn: () => localStorage.getItem('token') !== null,
  logIn: () => {},
  logOut: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },
};

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
);

export default AuthContext;
