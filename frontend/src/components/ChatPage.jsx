import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import { io } from 'socket.io-client';

import UserContext from '../contexts/UserContext';
import {
  selectors as channelsSelectors,
  addChannels,
  addChannel,
  removeChannel,
  renameChannel,
} from '../slices/channelsSlice.js';
import {
  selectors as messagesSelectors,
  addMessages,
  addMessage,
} from '../slices/messagesSlice.js';

import RenameChannelButton from './chatPageElements/RenameChannelButton.jsx';
import RemoveChannelButton from './chatPageElements/RemoveChannelButton.jsx';
import AddChannelButton from './chatPageElements/AddChannelButton.jsx';

const socket = io();
const notify = (text) => toast(text);
const logOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

const MainPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState();
  const [messageText, setMessageText] = useState();
  const [currChannelId, setCurrChannelId] = useState();
  const isAuth = useContext(UserContext);

  const stateChannels = useSelector(channelsSelectors.selectAll);
  const stateMessages = useSelector(messagesSelectors.selectAll);

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
        notify(t('error'));
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
      notify(t('channelCreated'));
    });
  };
  const handleRemoveChannel = (id) => {
    socket.emit('removeChannel', { id }, (response) => {
      console.log('removeChannel RESPONSE STATUS', response); // ok
      setCurrChannelId(1);
      notify(t('channelRemoved'));
    });
  };
  const handleRenameChannel = (id, name) => {
    const isNameAlreadyExist = stateChannels.some(
      (channel) => channel.name === name,
    );
    if (isNameAlreadyExist) return;
    socket.emit('renameChannel', { id, name }, (response) => {
      console.log('renameChannel RESPONSE STATUS', response); // ok
      notify(t('channelRenamed'));
    });
  };

  return isAuth() ? (
    <>
      <ToastContainer />
      <div className="chatPage d-flex">
        <div
          className="channels flex-column"
          style={{
            height: '800px',
            width: '250px',
            overflow: 'auto',
          }}
        >
          <Link onClick={logOut} to="/login">
            {t('logOut')}
          </Link>
          <br />
          <AddChannelButton handleNewChannel={handleNewChannel} />
          <ListGroup defaultActiveKey="#link1">
            {stateChannels.map((channel) => (
              <ListGroup.Item
                key={channel.id}
                href={`#link${channel.id}`}
              >
                <Dropdown as={ButtonGroup} className="d-flex">
                  <Button
                    onClick={() => {
                      setCurrChannelId(channel.id);
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    {`#${channel.name}`}
                  </Button>

                  {channel.removable && (
                    <>
                      <Dropdown.Toggle>
                        <span className="visually-hidden">
                          {t('channelControl')}
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <RemoveChannelButton
                          channelId={channel.id}
                          handleRemoveChannel={handleRemoveChannel}
                        />
                        <RenameChannelButton
                          channel={channel}
                          handleRenameChannel={handleRenameChannel}
                        />
                      </Dropdown.Menu>
                    </>
                  )}
                </Dropdown>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <div
          className="messages flex-column"
          style={{
            height: '800px',
            width: '300px',
            overflow: 'auto',
          }}
        >
          {t('yourNick')}
          {' '}
          <b>{nickname}</b>
          <Form onSubmit={handleNewMessage}>
            <InputGroup>
              <Form.Control
                placeholder={t('typeMessage')}
                aria-label="Новое сообщение"
                value={messageText}
                onChange={changeMessageText}
              />
              <Button type="submit">{t('send')}</Button>
            </InputGroup>
          </Form>
          <ListGroup style={{ overflowWrap: 'break-word' }}>
            {stateMessages
              .filter(
                (message) => currChannelId === message.channelId,
              )
              .map((message) => (
                <ListGroup.Item key={message.id}>
                  {message.body}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default MainPage;
