import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useTranslation } from 'react-i18next';

const AddChannelButton = ({ handleNewChannel }) => {
  const { t } = useTranslation();
  const [newChannelName, setNewChannelName] = useState('');
  const changeNewChannelName = (e) => setNewChannelName(e.target.value);

  const [show, setShow] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmitDropdownModal = (e) => {
    e.preventDefault();
    handleNewChannel(newChannelName);
    setNewChannelName('');
    handleClose();
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        +
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('addNewChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleSubmitDropdownModal(e)}>
            <Form.Group>
              <Form.Control
                autoFocus
                id="name"
                type="text"
                placeholder={t('setNewChannelName')}
                value={newChannelName}
                onChange={changeNewChannelName}
              />
              <Form.Label
                className="visually-hidden"
                htmlFor="name"
              >
                {t('channelName')}
              </Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            type="submit"
            onClick={(e) => {
              handleSubmitDropdownModal(e);
              handleClose();
            }}
          >
            {t('send')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddChannelButton;
