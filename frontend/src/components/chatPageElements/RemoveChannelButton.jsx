import { useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import { toggleModalRemove } from '../../slices/modalSlice.js';

const RemoveChannelButton = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toggleHandler = () => dispatch(toggleModalRemove(id));
  return (
    <Dropdown.Item onClick={() => toggleHandler()}>
      {t('delete')}
    </Dropdown.Item>
  );
};
export default RemoveChannelButton;
