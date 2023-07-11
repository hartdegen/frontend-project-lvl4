import { createContext } from 'react';
import { io } from 'socket.io-client';
import { addChannel, removeChannel, renameChannel } from '../slices/channelsSlice.js';
import { addMessage } from '../slices/messagesSlice.js';

const SocketContext = createContext();
const socket = io();
const values = {
  createOngoingDataUpdating: (dispatch, setCurrChannelId) => {
    socket.on('newMessage', (message) => {
      console.log('SOCKET.ON newMessage', message); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
      dispatch(addMessage(message));
    });
    socket.on('newChannel', (channel) => {
      console.log('SOCKET.ON newChannel', channel); // { id: 6, name: "new channel", removable: true }
      dispatch(addChannel(channel));
    });
    socket.on('removeChannel', (channel) => {
      console.log('SOCKET.ON removeChannel', channel); // { id: 6 }
      dispatch(removeChannel(channel.id));
      // как по-другому переключать на дефолтный канал всех пользователей при удалении активного?
      // если не здесь
      setCurrChannelId((currId) => (currId === channel.id ? 1 : currId));
    });
    socket.on('renameChannel', (channel) => {
      console.log('SOCKET.ON renameChannel', channel); // { id: 7, name: "new name channel", removable: true }
      dispatch(
        renameChannel({
          id: channel.id,
          changes: { name: channel.name },
        }),
      );
    });
  },
  sendNewMessage: (message) => {
    socket.emit('newMessage', message, (response) => {
      console.log('newMessage RESPONSE STATUS', response);
    });
  },
  createNewChannel: (name, setCurrChannelId) => {
    socket.emit('newChannel', { name }, (response) => {
      console.log('newChannel RESPONSE STATUS', response);
      setCurrChannelId(response.data.id);
    });
  },
  removeCurrentChannel: (id) => {
    socket.emit('removeChannel', { id }, (response) => {
      console.log('removeChannel RESPONSE STATUS', response);
    });
  },
  renameCurrentChannel: (id, name) => {
    socket.emit('renameChannel', { id, name }, (response) => {
      console.log('renameChannel RESPONSE STATUS', response);
    });
  },
};

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
);

export default SocketContext;
