import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { toggleModalRemove, toggleModalRename, toggleModalAddChannel } from '../../slices/modalSlice.js';
import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';

const ModalWindow = ({ handleRemoveChannel, handleRenameChannel, handleNewChannel }) => {
  const [authError, setAuthError] = useState();
  const stateChannels = useSelector(channelsSelectors.selectAll);
  const channelsNames = stateChannels.map((item) => item.name);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toggleHandlerRemove = () => dispatch(toggleModalRemove());
  const toggleHandlerRename = () => dispatch(toggleModalRename());
  const toggleHandlerAdd = () => dispatch(toggleModalAddChannel());
  const whichModalShown = useSelector((state) => state.modal.whichModalShown);
  const currChannelId = useSelector((state) => state.modal.channelId);
  const formikRename = useFormik({
    initialValues: { newChannelName: '' },
    validationSchema: Yup.object({
      newChannelName: Yup.string()
        .required(`${t('required')}`)
        .notOneOf(channelsNames, `${t('mustBeUniq')}`),
    }),
    onSubmit: (initialValues) => {
      try {
        handleRenameChannel(currChannelId, initialValues.newChannelName);
        toggleHandlerRename();
      } catch (err) {
        console.error('ERROR CATCH', err);
        setAuthError(`${err.message} - ${err.response.statusText}`);
      }
    },
  });
  const formikAdd = useFormik({
    initialValues: { newChannelName: '' },
    validationSchema: Yup.object({
      newChannelName: Yup.string()
        .required(`${t('required')}`)
        .notOneOf(channelsNames, `${t('mustBeUniq')}`),
    }),
    onSubmit: (initialValues) => {
      try {
        handleNewChannel(initialValues.newChannelName);
        toggleHandlerAdd();
      } catch (err) {
        console.error('ERROR CATCH', err);
        setAuthError(`${err.message} - ${err.response.statusText}`);
      }
    },
  });

  return (
    <>
      <Modal show={whichModalShown === 'remove'} onHide={toggleHandlerRemove}>
        <Modal.Header closeButton>
          <Modal.Title>{t('deleteChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('areYouSure')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleHandlerRemove}>
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleRemoveChannel(currChannelId);
              toggleHandlerRemove();
            }}
          >
            {t('delete')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={whichModalShown === 'rename'} onHide={toggleHandlerRename}>
        <Modal.Header closeButton>
          <Modal.Title>{t('renameChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formikRename.handleSubmit}>
            <Form.Group>
              <Form.Control
                autoFocus
                id="newChannelName"
                type="text"
                placeholder={t('setNewChannelName')}
                isInvalid={formikRename.touched.newChannelName
                   && formikRename.errors.newChannelName}
                onChange={formikRename.handleChange}
                onBlur={formikRename.handleBlur}
                value={formikRename.values.newChannelName}
              />
              <Form.Label className="visually-hidden" htmlFor="newChannelName">
                {t('channelName')}
              </Form.Label>
              <Form.Control.Feedback type="invalid" tooltip>
                {formikRename.touched.newChannelName && formikRename.errors.newChannelName}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
          {authError && <div style={{ color: 'red' }}>{authError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleHandlerRename}>
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            type="submit"
            onClick={formikRename.handleSubmit}
          >
            {t('send')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={whichModalShown === 'addChannel'} onHide={toggleHandlerAdd}>
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
              <Form.Label className="visually-hidden" htmlFor="newChannelName">
                {t('channelName')}
              </Form.Label>
              <Form.Control.Feedback type="invalid" tooltip>
                {formikAdd.touched.newChannelName && formikAdd.errors.newChannelName}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
          {authError && <div style={{ color: 'red' }}>{authError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleHandlerAdd}>
            {t('cancel')}
          </Button>
          <Button variant="danger" type="submit" onClick={formikAdd.handleSubmit}>
            {t('send')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalWindow;
