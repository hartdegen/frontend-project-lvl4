import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import SocketContext from '../contexts/SocketContext';
import { addChannels } from '../slices/channelsSlice.js';
import { addMessages } from '../slices/messagesSlice.js';
import ChannelsElem from './chatPageElements/ChannelsElem.jsx';
import MessagesElem from './chatPageElements/MessagesElem.jsx';
import ModalWindow from './chatPageElements/ModalWindow.jsx';
import paths from '../routes.js';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [currChannelId, setCurrChannelId] = useState();
  const { enableDataAutoUpdate } = useContext(SocketContext);
  const { logOut, getToken } = useContext(AuthContext);
  useEffect(() => {
    const loadData = async () => {
      const data = await axios.get(paths.backendData, { headers: { Authorization: `Bearer ${getToken()}` } });
      const { channels, messages, currentChannelId } = data.data;
      dispatch(addChannels(channels));
      dispatch(addMessages(messages));
      setCurrChannelId(currentChannelId);
    };
    loadData()
      .then(enableDataAutoUpdate(dispatch, setCurrChannelId))
      .catch((err) => {
        console.error('ERROR CATCH ChatPage', err);
        if (err.message === 'Request failed with status code 401') logOut();
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="chatPage d-flex">
      <Link onClick={logOut} to={paths.loginPage}>{t('logOut')}</Link>
      <ChannelsElem setCurrChannelId={setCurrChannelId} currChannelId={currChannelId} />
      <MessagesElem currChannelId={currChannelId} />
      <ModalWindow setCurrChannelId={setCurrChannelId} />
    </div>
  );
};

export default ChatPage;
