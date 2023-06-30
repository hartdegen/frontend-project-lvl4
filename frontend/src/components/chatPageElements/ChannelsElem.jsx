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
    <div className="channels flex-column">
      <AddChannelButton />
      <ListGroup defaultActiveKey={`#link${currChannelId}`}>
        {stateChannels.map((channel) => (
          <ListGroup.Item key={channel.id} href={`#link${channel.id}`} active={currChannelId === channel.id}>
            <Dropdown as={ButtonGroup} className="d-flex">
              <Button onClick={() => { setCurrChannelId(channel.id); }} style={{ overflow: 'hidden' }}>
                {`#${channel.name}`}
              </Button>

              {channel.removable && (
                <>
                  <Dropdown.Toggle>
                    <span className="visually-hidden">{t('channelControl')}</span>
                  </Dropdown.Toggle>
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
