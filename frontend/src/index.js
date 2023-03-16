import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";

import App from './components/App.jsx';
import NotFound404 from './components/NotFound404.jsx';
import LoginPage from './components/LoginPage.jsx';
import store from './slices/index.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound404 />,
    // children: [
    //   {
    //     path: "/login",
    //     element: <LoginPage />,
    //   },
    // ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

const mountNode = document.getElementById('root');
const root = ReactDOM.createRoot(mountNode);

root.render(
  <Provider store={store}>
    {/* <App /> */}
    <RouterProvider router={router} />
  </Provider>,
);