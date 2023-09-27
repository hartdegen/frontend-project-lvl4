import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import RenameChannelButton from './RenameChannelButton.jsx';
import RemoveChannelButton from './RemoveChannelButton.jsx';
import AddChannelButton from './AddChannelButton.jsx';
import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';

const ChannelsElem = ({ setCurrChannelId, currChannelId }) => {
  const { t } = useTranslation();
  const stateChannels = useSelector(channelsSelectors.selectAll);
  return (
    <div className="channels border">
      <div className="d-flex justify-content-between align-items-center">
        {t('channels')}
        <AddChannelButton />
      </div>

      <ListGroup className="autoScrollSettings" defaultActiveKey={`#link${currChannelId}`}>
        {stateChannels.map((channel) => (
          <ListGroup.Item key={channel.id} active={currChannelId === channel.id}>
            <Dropdown className="d-flex" as={ButtonGroup}>
              <Button className="d-flex justify-content-start overflow-hidden" onClick={() => { setCurrChannelId(channel.id); }}>{`#${channel.name}`}</Button>
              {channel.removable && (
                <>
                  <Dropdown.Toggle className="flex-grow-0 bg-dark bg-gradient"><span className="visually-hidden">{t('channelControl')}</span></Dropdown.Toggle>
                  <Dropdown.Menu>
                    <RemoveChannelButton id={channel.id} />
                    <RenameChannelButton id={channel.id} />
                  </Dropdown.Menu>
                </>
              )}
            </Dropdown>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ChannelsElem;

// eslint-disable-next-line max-len
// <ListGroup.Item key={channel.id} href={`#link${channel.id}`} active={currChannelId === channel.id}>
// there is problem with added href
// Warning: `action=false` and `href` should not be used together.
