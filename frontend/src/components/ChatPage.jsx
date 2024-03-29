import React, { useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import useAuth from '../hooks/useAuth.jsx';
import SocketContext from '../contexts/SocketContext';
import { addChannels } from '../slices/channelsSlice.js';
import { addMessages } from '../slices/messagesSlice.js';
import ChannelsElem from './chatPageElements/ChannelsElem.jsx';
import MessagesElem from './chatPageElements/MessagesElem.jsx';
import ModalWindow from './chatPageElements/ModalWindow.jsx';
import paths from '../routes.js';
import '../index.css';

const ChatPage = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const [currChannelId, setCurrChannelId] = useState();
  const { enableDataAutoUpdate } = useContext(SocketContext);
  useEffect(() => {
    const loadData = async () => {
      const data = await axios.get(paths.backendData, { headers: { Authorization: `Bearer ${auth.getToken()}` } });
      const { channels, messages, currentChannelId } = data.data;
      dispatch(addChannels(channels));
      dispatch(addMessages(messages));
      setCurrChannelId(currentChannelId);
    };
    loadData()
      .then(enableDataAutoUpdate(dispatch, setCurrChannelId))
      .catch((err) => {
        console.error('ERROR CATCH ChatPage', err);
        if (err.message === 'Request failed with status code 401') auth.logOut();
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="chatPage d-flex justify-content-center">
      <ChannelsElem setCurrChannelId={setCurrChannelId} currChannelId={currChannelId} />
      <MessagesElem currChannelId={currChannelId} />
      <ModalWindow setCurrChannelId={setCurrChannelId} />
    </div>
  );
};

export default ChatPage;
