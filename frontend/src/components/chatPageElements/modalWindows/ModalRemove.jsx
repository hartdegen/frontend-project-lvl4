import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import SocketContext from '../../../contexts/SocketContext';
import { closeModal } from '../../../slices/modalSlice.js';

const ModalWindow = () => {
  const { removeCurrentChannel } = useContext(SocketContext);
  const [buttonDisabled, setButtonDisabled] = useState();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const closeModalWindow = () => dispatch(closeModal());
  const currChannelId = useSelector((state) => state.modal.channelId);

  return (
    <Modal show onHide={closeModalWindow}>
      <Modal.Header closeButton><Modal.Title>{t('deleteChannel')}</Modal.Title></Modal.Header>
      <Modal.Body>{t('areYouSure')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" disabled={buttonDisabled} onClick={closeModalWindow}>{t('cancel')}</Button>
        <Button
          variant="danger"
          disabled={buttonDisabled}
          onClick={async () => {
            setButtonDisabled(true);
            try {
              await removeCurrentChannel(currChannelId);
              closeModalWindow();
              toast(t('channelRemoved'));
            } catch (error) {
              console.error('ModalRemove submit error', error);
              setButtonDisabled(false);
            }
          }}
        >
          {t('delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalWindow;
