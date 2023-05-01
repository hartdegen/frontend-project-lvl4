import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';

import AuthContext from '../contexts/AuthContext';
import SocketContext from '../contexts/SocketContext';

import {
  selectors as channelsSelectors,
  addChannels,
  addChannel,
  removeChannel,
  renameChannel,
} from '../slices/channelsSlice.js';
import { addMessages, addMessage } from '../slices/messagesSlice.js';

import ChannelsElem from './chatPageElements/ChannelsElem.jsx';
import MessagesElem from './chatPageElements/MessagesElem.jsx';

const MainPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState();
  const [messageText, setMessageText] = useState();
  const [currChannelId, setCurrChannelId] = useState();
  const { logOut } = useContext(AuthContext);

  const { socket } = useContext(SocketContext);

  const stateChannels = useSelector(channelsSelectors.selectAll);

  useEffect(() => {
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
    socket.emit('newMessage', message, (response) => {
      console.log('newMessage RESPONSE STATUS', response); // ok
      setMessageText('');
    });
  };
  const handleNewChannel = (name) => {
    const isNameAlreadyExist = stateChannels.some(
      (channel) => channel.name === name,
    );
    if (isNameAlreadyExist) return;
    socket.emit('newChannel', { name }, (response) => {
      console.log('newChannel RESPONSE STATUS', response); // ok
      setCurrChannelId(response.data.id);
      toast(t('channelCreated'));
    });
  };
  const handleRemoveChannel = (id) => {
    socket.emit('removeChannel', { id }, (response) => {
      console.log('removeChannel RESPONSE STATUS', response); // ok
      setCurrChannelId(1);
      toast(t('channelRemoved'));
    });
  };
  const handleRenameChannel = (id, name) => {
    const isNameAlreadyExist = stateChannels.some(
      (channel) => channel.name === name,
    );
    if (isNameAlreadyExist) return;
    socket.emit('renameChannel', { id, name }, (response) => {
      console.log('renameChannel RESPONSE STATUS', response); // ok
      toast(t('channelRenamed'));
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="chatPage d-flex">
        <Link onClick={logOut} to="/login">
          {t('logOut')}
        </Link>
        <br />
        <ChannelsElem
          handleNewChannel={handleNewChannel}
          setCurrChannelId={setCurrChannelId}
          handleRemoveChannel={handleRemoveChannel}
          handleRenameChannel={handleRenameChannel}
        />

        <MessagesElem
          nickname={nickname}
          currChannelId={currChannelId}
          messageText={messageText}
          handleNewMessage={handleNewMessage}
          changeMessageText={changeMessageText}
        />
      </div>
    </>
  );
};

export default MainPage;
