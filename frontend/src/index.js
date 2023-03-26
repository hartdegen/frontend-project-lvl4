import { I18nextProvider } from 'react-i18next';
import instance from './i18nInstance.js';

import "bootstrap/dist/css/bootstrap.min.css";
import { createContext } from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./components/App.jsx";
import NotFound404 from "./components/NotFound404.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegistrationPage from "./components/RegistrationPage.jsx";

import store from "./slices/index.js";

export const UserContext = createContext();
const isAuth = () => localStorage.getItem("token") !== null;
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound404 />,
        // children: [
        //     {
        //         path: "/login",
        //         element: <LoginPage/>
        //     }
        // ]
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <RegistrationPage /> },
]);

const mountNode = document.getElementById("root");
const root = ReactDOM.createRoot(mountNode);

root.render(
    <Provider store={store}>
        <UserContext.Provider value={isAuth}>
            <I18nextProvider i18n={instance}>
                <b>Test Header</b><br></br>
                <RouterProvider router={router} />
            </I18nextProvider>
        </UserContext.Provider>
    </Provider>
);
