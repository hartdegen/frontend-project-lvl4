import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import Dropdown from "react-bootstrap/Dropdown";
import Form from 'react-bootstrap/Form';

import { useTranslation } from 'react-i18next';

const RenameChannelButton = ({ channel, handleRenameChannel }) => {
  const { id, name } = channel;
  const { t } = useTranslation();
  const [newChannelName, setNewChannelName] = useState(name);
  const changeNewChannelName = (e) => setNewChannelName(e.target.value);
  const handleSubmitDropdownModal = (e) => {
    e.preventDefault();
    handleRenameChannel(id, newChannelName);
    handleClose();
  };

  const [show, setShow] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      {/* <Dropdown.Item onClick={handleShow}>{t("rename")}</Dropdown.Item>
            autoFocus noy working with Dropdown.Item */}
      <Button variant="light" onClick={handleShow}>
        {t('rename')}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('renameChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleSubmitDropdownModal(e)}>
            <Form.Group>
              <Form.Control
                autoFocus
                id="channelName"
                type="text"
                placeholder={t('setNewChannelName')}
                value={newChannelName}
                onChange={changeNewChannelName}
              />
              <Form.Label
                className="visually-hidden"
                htmlFor="channelName"
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

export default RenameChannelButton;
