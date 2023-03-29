import { useTranslation } from "react-i18next";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import React, { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import { io } from "socket.io-client";

import { UserContext } from "../index.js";
import { selectors as channelsSelectors } from "../slices/channelsSlice.js";
import { selectors as messagesSelectors } from "../slices/messagesSlice.js";
import { addChannels, addChannel, removeChannel, renameChannel } from "../slices/channelsSlice.js";
import { addMessages, addMessage } from "../slices/messagesSlice.js";

import RenameChannelButton from "./chatPageElements/RenameChannelButton.jsx";
import RemoveChannelButton from "./chatPageElements/RemoveChannelButton.jsx";

const socket = io();
const notify = (text) => toast(text);
const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
};

const MainPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [username, setUsername] = useState();
    const [messageText, setMessageText] = useState();
    const [channelName, setChannelName] = useState();
    const [currentChannelId, setCurrentChannelId] = useState();
    const isAuth = useContext(UserContext);

    const stateChannels = useSelector(channelsSelectors.selectAll);
    const stateMessages = useSelector(messagesSelectors.selectAll);

    useEffect(() => {
        socket.on("newMessage", (message) => {
            console.log(`SOCKET.ON newMessage`, message); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
            dispatch(addMessage(message));
        });
        socket.on("newChannel", (channel) => {
            console.log(`SOCKET.ON newChannel`, channel); // { id: 6, name: "new channel", removable: true }
            dispatch(addChannel(channel));
            notify(t("newChannelCreated"));
        });
        socket.on("removeChannel", (channel) => {
            console.log(`SOCKET.ON removeChannel`, channel); // { id: 6 }
            dispatch(removeChannel(channel.id));
            notify(t("channelRemoved"));
        });
        socket.on("renameChannel", (channel) => {
            console.log(`SOCKET.ON renameChannel`, channel); // { id: 7, name: "new name channel", removable: true }
            dispatch(renameChannel({ id: channel.id, changes: { name: channel.name } }));
            notify(t("channelRenamed"));
        });
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
                notify(t("error"));
            }
        };
        updateData();
    }, []);

    const changeChannelName = (e) => setChannelName(e.target.value);
    const changeMessageText = (e) => setMessageText(e.target.value);
    const handleNewMessage = (e) => {
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
    const handleNewChannel = (e) => {
        e.preventDefault();
        const isNameAlreadyExist = stateChannels.some((channel) => channel.name === channelName);
        if (isNameAlreadyExist) return;
        socket.emit("newChannel", { name: channelName }, (response) => {
            console.log(`newChannel RESPONSE STATUS`, response); // ok
            setCurrentChannelId(response.data.id);
            setChannelName("");
        });
    };
    const handleRemoveChannel = (id) => {
        socket.emit("removeChannel", { id }, (response) => {
            console.log(`removeChannel RESPONSE STATUS`, response); // ok
            setCurrentChannelId(1);
        });
    };
    const handleRenameChannel = (id, name) => {
        const isNameAlreadyExist = stateChannels.some((channel) => channel.name === name);
        if (isNameAlreadyExist) return;
        socket.emit("renameChannel", { id, name }, (response) => {
            console.log(`renameChannel RESPONSE STATUS`, response); // ok
        });
    };

    return isAuth() ? (
        <>
            <ToastContainer />
            <div className="chatPage d-flex">
                <div className="channels flex-column">
                    <Link onClick={logOut} to="/login">
                        {t("logOut")}
                    </Link>
                    <Form onSubmit={handleNewChannel}>
                        <InputGroup>
                            <Form.Control placeholder={t("addNewChannel")} value={channelName} onChange={changeChannelName} />
                            <Button type="submit">+</Button>
                        </InputGroup>
                    </Form>
                    <ListGroup style={{ maxHeight: `250px`, maxWidth: `250px`, overflow: `auto` }} defaultActiveKey="#link1">
                        {stateChannels.map((channel) => (
                            <ListGroup.Item key={channel.id} href={`#link${channel.id}`}>
                                <Dropdown as={ButtonGroup} className="d-flex">
                                    <Button
                                        onClick={() => {
                                            setCurrentChannelId(channel.id);
                                        }}
                                    >
                                        {channel.name}
                                    </Button>

                                    {channel.removable && (
                                        <>
                                            <Dropdown.Toggle />
                                            <Dropdown.Menu>
                                                <RemoveChannelButton channelId={channel.id} handleRemoveChannel={handleRemoveChannel} />
                                                <RenameChannelButton channelId={channel.id} handleRenameChannel={handleRenameChannel} />
                                            </Dropdown.Menu>
                                        </>
                                    )}
                                </Dropdown>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                <div className="messages flex-column">
                    {t("yourUsername")} <b>{username}</b>
                    <Form onSubmit={handleNewMessage}>
                        <InputGroup>
                            <Form.Control placeholder={t("typeMessage")} value={messageText} onChange={changeMessageText} />
                            <Button type="submit">+</Button>
                        </InputGroup>
                    </Form>
                    <ListGroup style={{ maxHeight: `250px`, maxWidth: `250px`, overflow: `auto` }}>
                        {stateMessages
                            .filter((message) => currentChannelId === message.channelId)
                            .map((message) => (
                                <ListGroup.Item key={message.id}>{message.body}</ListGroup.Item>
                            ))}
                    </ListGroup>
                </div>
            </div>
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default MainPage;
