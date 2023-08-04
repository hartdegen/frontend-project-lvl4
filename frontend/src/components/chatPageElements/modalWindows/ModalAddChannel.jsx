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

const ModalWindow = ({ setCurrChannelId }) => {
  const { createNewChannel } = useContext(SocketContext);
  const [submitDisabled, setSubmitDisabled] = useState();
  const stateChannels = useSelector(channelsSelectors.selectAll);
  const channelsNames = stateChannels.map((item) => item.name);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const closeModalWindow = () => dispatch(closeModal());

  const formikAdd = useFormik({
    initialValues: { newChannelName: '' },
    validationSchema: Yup.object({
      newChannelName: Yup.string().required(`${t('required')}`).notOneOf(channelsNames, `${t('mustBeUniq')}`),
    }),
    onSubmit: async (initialValues) => {
      setSubmitDisabled(true);
      try {
        await createNewChannel(setCurrChannelId, initialValues.newChannelName);
        closeModalWindow();
        toast(t('channelCreated'));
      } catch (error) {
        console.error('ModalAddChannel submit error', error);
        setSubmitDisabled(false);
      }
    },
  });

  return (
    <Modal show onHide={closeModalWindow}>
      <Modal.Header closeButton>
        <Modal.Title>{t('addNewChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formikAdd.handleSubmit}>
          <Form.Group>
            <Form.Control
              autoFocus
              id="newChannelName"
              type="text"
              placeholder={t('setNewChannelName')}
              isInvalid={formikAdd.touched.newChannelName && formikAdd.errors.newChannelName}
              onChange={formikAdd.handleChange}
              onBlur={formikAdd.handleBlur}
              value={formikAdd.values.newChannelName}
            />
            <Form.Label className="visually-hidden" htmlFor="newChannelName">{t('channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>{formikAdd.touched.newChannelName && formikAdd.errors.newChannelName}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" disabled={submitDisabled} onClick={closeModalWindow}>{t('cancel')}</Button>
        <Button variant="danger" type="submit" disabled={submitDisabled} onClick={formikAdd.handleSubmit}>{t('send')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalWindow;
