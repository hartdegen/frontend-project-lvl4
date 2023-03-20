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
import { addChannels, addChannel } from "../slices/channelsSlice.js";
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
    socket.on("newMessage", (message) => {
        console.log(`SOCKET.ON newMessage`, message);
        dispatch(addMessage(message));
    });
    socket.on('newChannel', (channel) => {
        console.log(`SOCKET.ON newChannel`, channel)
        dispatch(addChannel(channel));
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

    const isAuth = useContext(UserContext);
    const stateChannels = useSelector(channelsSelectors.selectAll);
    const stateMessages = useSelector(messagesSelectors.selectAll);
    const changeChannelName = (e) => setChannelName(e.target.value);
    const changeMessageText = (e) => setMessageText(e.target.value);
    const createNewChannel = (e) => {
        e.preventDefault();
        const isNameAlreadyExist = stateChannels.some(channel => channel.name === channelName);
        if (isNameAlreadyExist) return;
        socket.emit('newChannel', { name: channelName }, (response) => {
            console.log(`newChannel RESPONSE STATUS`, response.status); // ok
            setCurrentChannelId(response.data.id);
            setChannelName("");
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
            console.log(`newMessage RESPONSE STATUS`, response.status); // ok
            setMessageText("");
        });
    };

    return isAuth() ? (
        <>
        <div className="chatPage" style={{ display: "flex" }}>
            <div className="channels" style={{ display: "flex", flexDirection: "column" }}>
                <Link onClick={logOut} to="/login">Log out</Link>
                <br />
                <form className="createNewChannel" onSubmit={createNewChannel}>
                    <input type="text" placeholder="Add New Channel" value={channelName} onChange={changeChannelName}/>
                    <input type="submit" value="+" />
                </form>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {stateChannels.map((channel) => (
                        <li key={channel.id}>
                            <a href="#" onClick={() => setCurrentChannelId(channel.id)}>
                                {channel.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <br />
            </div>

            <div className="messages" style={{ display: "flex", flexDirection: "column", paddingLeft: 10 }}>
                <div>You are {username}</div>
                <br />
                <form onSubmit={sendMessage}>
                    <input type="text" placeholder="Type your message" value={messageText} onChange={changeMessageText}/>
                    <input type="submit" value="Send" />
                </form>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {stateMessages.filter(message => currentChannelId === message.channelId)
                                  .map(message => <li key={message.id}>{message.body}</li>)}
                </ul>
                <br />
            </div>
        </div>
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default MainPage;