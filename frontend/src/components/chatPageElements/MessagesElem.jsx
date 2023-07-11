import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { selectors as messagesSelectors } from '../../slices/messagesSlice.js';

const MessagesElem = ({
  nickname,
  currChannelId,
  messageText,
  handleNewMessage,
  changeMessageText,
}) => {
  const { t } = useTranslation();
  const stateMessages = useSelector(messagesSelectors.selectAll);
  const messageEl = useRef(null);

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
    <div className="messages flex-column" style={{ overflow: 'hidden' }}>
      {t('yourNick')}
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
      <ListGroup
        style={{ overflowY: 'auto', width: '350px', height: '450px' }}
        ref={messageEl}
      >
        {stateMessages
          .filter((message) => currChannelId === message.channelId)
          .map((message) => (<ListGroup.Item key={message.id}>{message.body}</ListGroup.Item>))}
      </ListGroup>
    </div>
  );
};

export default MessagesElem;
