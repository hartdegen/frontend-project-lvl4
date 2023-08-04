import { createContext } from 'react';

const AuthContext = createContext();
const values = {
  getToken: () => localStorage.getItem('token'),
  getUsername: () => localStorage.getItem('username'),
  isSignedIn: () => localStorage.getItem('token') !== null,
  logIn: (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  },
  logOut: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },
};

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
);

export default AuthContext;
