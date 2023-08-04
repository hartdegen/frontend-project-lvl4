import { createContext } from 'react';
import { addChannel, removeChannel, renameChannel } from '../slices/channelsSlice.js';
import { addMessage } from '../slices/messagesSlice.js';

const SocketContext = createContext();
const createValues = (socket) => ({
  enableDataAutoUpdate: (dispatch, setCurrChannelId) => {
    socket.on('newMessage', (message) => dispatch(addMessage(message)));
    socket.on('newChannel', (channel) => dispatch(addChannel(channel)));
    socket.on('renameChannel', (channel) => dispatch(renameChannel({ id: channel.id, changes: { name: channel.name } })));
    socket.on('removeChannel', (channel) => {
      dispatch(removeChannel(channel.id));
      setCurrChannelId((currId) => (currId === channel.id ? 1 : currId));
    });
    socket.on('connect_error', (err) => console.error('socket.on(connect_error)\n', err.message));
  },
  createNewChannel: async (setCurrChannelId, name) => new Promise((resolve, reject) => {
    socket.emit('newChannel', { name }, (response) => {
      setCurrChannelId(response.data.id);
      resolve(response);
    });
    setTimeout(() => reject(new Error('socket.emit(newChannel) - timeout error')), 3000);
  }),
  renameCurrentChannel: async (id, name) => new Promise((resolve, reject) => {
    socket.emit('renameChannel', { id, name }, (response) => resolve(response));
    setTimeout(() => reject(new Error('socket.emit(renameChannel) - timeout error')), 3000);
  }),
  removeCurrentChannel: async (id) => new Promise((resolve, reject) => {
    socket.emit('removeChannel', { id }, (response) => resolve(response));
    setTimeout(() => reject(new Error('socket.emit(removeChannel) - timeout error')), 3000);
  }),
  sendNewMessage: async (message) => new Promise((resolve, reject) => {
    socket.emit('newMessage', message, (response) => resolve(response));
    setTimeout(() => reject(new Error('socket.emit(sendNewMessage) - timeout error')), 3000);
  }),
});

export const SocketProvider = ({ children, socket }) => (
  <SocketContext.Provider value={createValues(socket)}>{children}</SocketContext.Provider>
);

export default SocketContext;
