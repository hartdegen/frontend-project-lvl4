import { createContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const values = {
  socket: io(),
};

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
);

export default SocketContext;
