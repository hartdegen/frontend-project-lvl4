import React from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toggleModalAddChannel } from '../../slices/modalSlice.js';

const AddChannelButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toggleHandler = () => dispatch(toggleModalAddChannel());
  return (
    <Button variant="primary" onClick={() => toggleHandler()}>
      {t('createChannel')}
    </Button>

  );
};

export default AddChannelButton;
