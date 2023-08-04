import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import SocketContext from '../../../contexts/SocketContext';
import { closeModal } from '../../../slices/modalSlice.js';
import { selectors as channelsSelectors } from '../../../slices/channelsSlice.js';

const ModalWindow = () => {
  const { renameCurrentChannel } = useContext(SocketContext);
  const [submitDisabled, setSubmitDisabled] = useState();
  const stateChannels = useSelector(channelsSelectors.selectAll);
  const channelsNames = stateChannels.map((item) => item.name);
  const currChannelId = useSelector((state) => state.modal.channelId);
  const currChannelName = stateChannels.find((channel) => channel.id === currChannelId).name;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const closeModalWindow = () => dispatch(closeModal());
  const formikRename = useFormik({
    initialValues: { newChannelName: currChannelName },
    validationSchema: Yup.object({
      newChannelName: Yup.string().required(`${t('required')}`).notOneOf(channelsNames, `${t('mustBeUniq')}`),
    }),
    onSubmit: async (initialValues) => {
      setSubmitDisabled(true);
      try {
        await renameCurrentChannel(currChannelId, initialValues.newChannelName);
        closeModalWindow();
        toast(t('channelRenamed'));
      } catch (error) {
        console.error('ModalRename submit error', error);
        setSubmitDisabled(false);
      }
    },
  });

  return (
    <Modal
      show
      onHide={closeModalWindow}
      onEntered={(e) => { e.querySelector('input[id="newChannelName"]').focus(); }}
      // костыль, т.к. autoFocus внутри <Form.Control /> не работает
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formikRename.handleSubmit}>
          <Form.Group>
            <Form.Control
              id="newChannelName"
              type="text"
              placeholder={t('setNewChannelName')}
              isInvalid={formikRename.touched.newChannelName && formikRename.errors.newChannelName}
              onChange={formikRename.handleChange}
              onBlur={formikRename.handleBlur}
              value={formikRename.values.newChannelName}
            />
            <Form.Label className="visually-hidden" htmlFor="newChannelName">{t('channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>{formikRename.touched.newChannelName && formikRename.errors.newChannelName}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" disabled={submitDisabled} onClick={closeModalWindow}>{t('cancel')}</Button>
        <Button variant="danger" type="submit" disabled={submitDisabled} onClick={formikRename.handleSubmit}>{t('send')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalWindow;
