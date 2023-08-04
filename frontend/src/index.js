import React from 'react';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import { Provider as ProviderRollbar, ErrorBoundary } from '@rollbar/react';
import { Provider } from 'react-redux';
import { AuthProvider } from './contexts/AuthContext.js';
import { SocketProvider } from './contexts/SocketContext.js';
import store from './slices/index.js';
import App from './components/App.jsx';

const rollbarConfig = {
  // accessToken: ${{ vars.ACCESSTOKEN }},
  environment: 'testenv',
};

const mountNode = document.getElementById('root');
const root = ReactDOM.createRoot(mountNode);
const socket = io();

root.render(
  <ProviderRollbar config={rollbarConfig}>
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <SocketProvider socket={socket}>
            <App />
          </SocketProvider>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  </ProviderRollbar>,
);
