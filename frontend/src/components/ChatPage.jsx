import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { toast } from 'react-toastify';

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';

import AuthContext from '../contexts/AuthContext';
import SocketContext from '../contexts/SocketContext';

import { addChannels } from '../slices/channelsSlice.js';
import { addMessages } from '../slices/messagesSlice.js';

import ChannelsElem from './chatPageElements/ChannelsElem.jsx';
import MessagesElem from './chatPageElements/MessagesElem.jsx';
import ModalWindow from './chatPageElements/ModalWindow.jsx';

const MainPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState();
  const [messageText, setMessageText] = useState();
  const [currChannelId, setCurrChannelId] = useState();
  const {
    createOngoingDataUpdating, sendNewMessage,
    createNewChannel, removeCurrentChannel, renameCurrentChannel,
  } = useContext(SocketContext);
  const { logOut } = useContext(AuthContext);

  useEffect(() => {
    createOngoingDataUpdating(dispatch, setCurrChannelId);
    const updateData = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        setNickname(username);
        const data = await axios.get('/api/v1/data', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { channels, messages, currentChannelId } = data.data;
        dispatch(addChannels(channels));
        dispatch(addMessages(messages));
        setCurrChannelId(currentChannelId);
        console.log('useEffect, channels', channels);
        console.log('useEffect, messages', messages);
      } catch (err) {
        console.error('ERROR CATCH', err);
        console.error('ERROR CODE', err.response.status);
        if (err.response.status === 401) {
          toast(t('wrongUsernamePassword'));
          logOut();
          navigate('/login');
        }
        toast(t('error'));
      }
    };
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeMessageText = (e) => setMessageText(e.target.value);
  const handleNewMessage = (e) => {
    e.preventDefault();
    const time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
    const message = {
      channelId: currChannelId,
      id: _.uniqueId(),
      username: nickname,
      body: `${time} ${nickname}: ${filter.clean(messageText)}`,
    };
    sendNewMessage(message);
    setMessageText('');
  };
  const handleNewChannel = (name) => {
    createNewChannel(name, setCurrChannelId);
    toast(t('channelCreated'));
  };
  const handleRemoveChannel = (id) => {
    removeCurrentChannel(id);
    toast(t('channelRemoved'));
  };
  const handleRenameChannel = (id, name) => {
    renameCurrentChannel(id, name);
    toast(t('channelRenamed'));
  };

  return (
    <div className="chatPage d-flex">
      <Link onClick={logOut} to="/login">{t('logOut')}</Link>
      <ChannelsElem setCurrChannelId={setCurrChannelId} currChannelId={currChannelId} />
      <MessagesElem
        nickname={nickname}
        currChannelId={currChannelId}
        messageText={messageText}
        handleNewMessage={handleNewMessage}
        changeMessageText={changeMessageText}
      />
      <ModalWindow
        handleRemoveChannel={handleRemoveChannel}
        handleRenameChannel={handleRenameChannel}
        handleNewChannel={handleNewChannel}
      />
    </div>
  );
};

export default MainPage;
