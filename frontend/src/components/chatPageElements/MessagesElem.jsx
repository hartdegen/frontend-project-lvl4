import React, {
  useEffect, useRef, useContext, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import _ from 'lodash';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import useAuth from '../../hooks/useAuth.jsx';
import SocketContext from '../../contexts/SocketContext';
import { selectors as messagesSelectors } from '../../slices/messagesSlice.js';

const MessagesElem = ({ currChannelId }) => {
  const { t } = useTranslation();
  const stateMessages = useSelector(messagesSelectors.selectAll);
  const messageEl = useRef(null);
  const { sendNewMessage } = useContext(SocketContext);
  const auth = useAuth();
  const [messageText, setMessageText] = useState();
  const [submitDisabled, setSubmitDisabled] = useState();
  const changeMessageText = (e) => setMessageText(e.target.value);
  const submitMessage = async (e) => {
    e.preventDefault();
    setSubmitDisabled(true);
    const message = {
      channelId: currChannelId,
      id: _.uniqueId(),
      username: auth.getUsername(),
      body: `${auth.getUsername()}: ${filter.clean(messageText)}`,
    };
    try {
      await sendNewMessage(message);
      setMessageText('');
      setSubmitDisabled(false);
    } catch (error) {
      console.error('MessagesElem submit error', error);
      setSubmitDisabled(false);
    }
  };

  useEffect(() => {
    // автопрокрутка сообщений к новым
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, []);

  return (
    <div className="messages border">
      <ListGroup className="autoScrollSettings" ref={messageEl}>
        {stateMessages
          .filter((message) => currChannelId === message.channelId)
          .map((message) => (<ListGroup.Item key={message.id}>{message.body}</ListGroup.Item>))}
      </ListGroup>
      <Form onSubmit={submitMessage}>
        <InputGroup>
          <Form.Control placeholder={t('typeMessage')} aria-label="Новое сообщение" value={messageText} onChange={changeMessageText} />
          <Button type="submit" disabled={submitDisabled}>{t('send')}</Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessagesElem;
