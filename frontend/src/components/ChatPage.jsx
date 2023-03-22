import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

// import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import { io } from "socket.io-client";

import { UserContext } from "../index.js";
import { selectors as channelsSelectors } from "../slices/channelsSlice.js";
import { selectors as messagesSelectors } from "../slices/messagesSlice.js";
import { addChannels, addChannel, removeChannel } from "../slices/channelsSlice.js";
import { addMessages, addMessage } from "../slices/messagesSlice.js";

const socket = io();
const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
};

const MainPage = (props) => {
    const dispatch = useDispatch();
    const [messageText, setMessageText] = useState();
    const [username, setUsername] = useState();
    const [channelName, setChannelName] = useState();
    const [currentChannelId, setCurrentChannelId] = useState();
    const [show, setShow] = useState(false);
    const isAuth = useContext(UserContext);
    const stateChannels = useSelector(channelsSelectors.selectAll);
    const stateMessages = useSelector(messagesSelectors.selectAll);

    socket.on("newMessage", (message) => {
        console.log(`SOCKET.ON newMessage`, message); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
        dispatch(addMessage(message));
    });
    socket.on('newChannel', (channel) => {
        console.log(`SOCKET.ON newChannel`, channel); // { id: 6, name: "new channel", removable: true }
        dispatch(addChannel(channel));
    });
    socket.on('removeChannel', (channel) => {
        console.log(`SOCKET.ON removeChannel`, channel); // { id: 6 }
        dispatch(removeChannel(channel.id));
    });

    useEffect(() => {
        const updateData = async () => {
            try {
                const token = localStorage.getItem("token");
                const username = localStorage.getItem("username");
                setUsername(username);
                const data = await axios.get("/api/v1/data", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { channels, messages, currentChannelId } = data.data;
                dispatch(addChannels(channels));
                dispatch(addMessages(messages));
                setCurrentChannelId(currentChannelId);
                console.log(`useEffect, channels`, channels);
                console.log(`useEffect, messages`, messages);
            } catch (err) {
                console.error(`ERROR CATCH`, err);
            }
        };
        updateData();
    }, []);


    const changeChannelName = (e) => setChannelName(e.target.value);
    const changeMessageText = (e) => setMessageText(e.target.value);
    const createNewChannel = (e) => {
        e.preventDefault();
        const isNameAlreadyExist = stateChannels.some(channel => channel.name === channelName);
        if (isNameAlreadyExist) return;
        socket.emit('newChannel', { name: channelName }, (response) => {
            console.log(`newChannel RESPONSE STATUS`, response); // ok
            setCurrentChannelId(response.data.id);
            setChannelName("");
        });
    }
    const handleRemoveChannel = (id) => {
        socket.emit('removeChannel', { id }, (response) => {
            console.log(`removeChannel RESPONSE STATUS`, response); // ok
        });
    }
    const sendMessage = (e) => {
        e.preventDefault();
        const time = `${new Date().getHours()}:${new Date().getMinutes()}`;
        const message = {
            channelId: currentChannelId,
            id: _.uniqueId(),
            username: username,
            body: `${time} ${username}: ${messageText}`,
        };
        socket.emit("newMessage", message, (response) => {
            console.log(`newMessage RESPONSE STATUS`, response); // ok
            setMessageText("");
        });
    };

    const dropdownModal = (channelId) => {
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
                        <Button variant="danger" onClick={() => handleRemoveChannel(channelId)}>
                            Удалить
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    return isAuth() ? (
        <>
            <div className="chatPage d-flex">
                <div className="channels flex-column">
                    <Link onClick={logOut} to="/login">Log out</Link>
                    <Form onSubmit={createNewChannel}>
                        <InputGroup className="mb-3">
                            <Form.Control placeholder="Add New Channel" value={channelName} onChange={changeChannelName} />
                            <Button type="submit">+</Button>
                        </InputGroup>
                    </Form>
                    <ButtonGroup vertical>
                        <ListGroup>
                            {stateChannels.map((channel) => (
                                <ListGroup.Item key={channel.id} name={channel.name} action onClick={() => setCurrentChannelId(channel.id)}>
                                    <Dropdown as={ButtonGroup}>
                                        <Button variant="success">{channel.name}</Button>
                                        <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
                                        <Dropdown.Menu>
                                            {dropdownModal(channel.id)}
                                        </Dropdown.Menu>
                                    </Dropdown>
                            </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </ButtonGroup>
                </div>

                <div className="messages flex-column">
                    <div>You are {username}</div>
                    <Form onSubmit={sendMessage}>
                        <InputGroup className="mb-3">
                            <Form.Control placeholder="Type your message" value={messageText} onChange={changeMessageText} />
                            <Button type="submit">+</Button>
                        </InputGroup>
                    </Form>
                    <ListGroup style={{ maxHeight: `300px`, overflow: `auto` }}>
                        {stateMessages.filter(message => currentChannelId === message.channelId)
                            .map(message => <p key={message.id}>{message.body}</p>)}
                    </ListGroup>
                </div>
            </div>
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default MainPage;