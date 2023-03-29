import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

import { useTranslation } from "react-i18next";

const RemoveChannelButton = ({ channelId, handleRemoveChannel }) => {
    const { t } = useTranslation();
    const [show, setShow] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Dropdown.Item onClick={handleShow}>{t("delete")}</Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("deleteChannel")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t("areYouSure")}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t("cancel")}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleRemoveChannel(channelId);
                            handleClose();
                        }}
                    >
                        {t("delete")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RemoveChannelButton;
