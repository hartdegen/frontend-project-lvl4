import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

const RemoveChannelButton = (channelId, handleRemoveChannel) => {
    const [show, setShow] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Dropdown.Item onClick={handleShow}>Удалить</Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Удалить канал</Modal.Title>
                </Modal.Header>
                <Modal.Body>Уверены?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отменить
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleRemoveChannel(channelId);
                            handleClose();
                        }}
                    >
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RemoveChannelButton;
