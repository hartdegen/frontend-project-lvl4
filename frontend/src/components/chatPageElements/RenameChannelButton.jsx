import { useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import { openModal } from '../../slices/modalSlice.js';

const RenameChannelButton = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toggleHandler = () => dispatch(openModal({ modalType: 'renameChannel', id }));
  return <Dropdown.Item onClick={() => toggleHandler()}>{t('rename')}</Dropdown.Item>;
};
export default RenameChannelButton;
