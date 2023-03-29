import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

const RenameChannelButton = ( { channelId, handleRenameChannel } ) => {
    const [newChannelName, setNewChannelName] = useState(``);
    const changeNewChannelName = (e) => setNewChannelName(e.target.value);
    const handleSubmitDropdownModal = (e) => (channelId) => {
        e.preventDefault();
        handleRenameChannel(channelId, newChannelName);
    };

    const [show, setShow] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Dropdown.Item onClick={handleShow}>Переименовать</Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Переименовать канал</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => handleSubmitDropdownModal(e)(channelId)}>
                        <Form.Group>
                            <Form.Control autoFocus type="text" placeholder="Set new channel name" value={newChannelName} onChange={changeNewChannelName} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отменить
                    </Button>
                    <Button
                        variant="danger"
                        type="submit"
                        onClick={(e) => {
                            handleSubmitDropdownModal(e)(channelId);
                            handleClose();
                        }}
                    >
                        Переименовать
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RenameChannelButton;
