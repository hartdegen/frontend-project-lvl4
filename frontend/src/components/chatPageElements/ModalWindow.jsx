import React from 'react';
import { useSelector } from 'react-redux';

import ModalAddChannel from './modalWindows/ModalAddChannel.jsx';
import ModalRemove from './modalWindows/ModalRemove.jsx';
import ModalRename from './modalWindows/ModalRename.jsx';

const ModalWindow = ({ setCurrChannelId }) => {
  const whichModalShown = useSelector((state) => state.modal.whichModalShown);
  const switchModal = () => {
    switch (whichModalShown) {
      case 'addChannel': return <ModalAddChannel setCurrChannelId={setCurrChannelId} />;
      case 'removeChannel': return <ModalRemove />;
      case 'renameChannel': return <ModalRename />;
      default: return null;
    }
  };
  return switchModal();
};

export default ModalWindow;
