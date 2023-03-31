import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

import { useTranslation } from "react-i18next";

const RenameChannelButton = ({ channelId, handleRenameChannel }) => {
    const { t } = useTranslation();
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
            <Dropdown.Item onClick={handleShow}>{t("rename")}</Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("renameChannel")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => handleSubmitDropdownModal(e)(channelId)}>
                        <Form.Group>
                            <Form.Control autoFocus type="text" placeholder={t("setNewChannelName")} value={newChannelName} onChange={changeNewChannelName} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t("cancel")}
                    </Button>
                    <Button
                        variant="danger"
                        type="submit"
                        onClick={(e) => {
                            handleSubmitDropdownModal(e)(channelId);
                            handleClose();
                        }}
                    >
                        {t("send")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RenameChannelButton;
