// import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import { io } from "socket.io-client";

import { UserContext } from "../index.js";
import { selectors as channelsSelectors } from "../slices/channelsSlice.js";
import { selectors as messagesSelectors } from "../slices/messagesSlice.js";
import { addChannels } from "../slices/channelsSlice.js";
import { addMessages, addMessage } from "../slices/messagesSlice.js";

const socket = io();
const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
};

const MainPage = (props) => {
    const dispatch = useDispatch();
    const [text, setText] = useState();
    const [username, setUsername] = useState();
    const [currentChannelId, setCurrentChannelId] = useState();
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
                // batch(() => {
                //     dispatch(addChannels(channels));
                //     dispatch(addMessages(messages));
                // });
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

    socket.on("newMessage", (message) => {
        console.log(`SOCKET.ON newMessage`, message);
        dispatch(addMessage(message));
    });

    const stateChannels = useSelector(channelsSelectors.selectAll);
    const stateMessages = useSelector(messagesSelectors.selectAll);

    const onChange = (e) => setText(e.target.value);
    const onSubmit = (e) => {
        e.preventDefault();
        const time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        const message = {
            channelId: currentChannelId,
            id: _.uniqueId(),
            value: `${time} ${username}: ${text}`,
        };
        setText("");
        socket.emit("newMessage", message);
    };
    const onClick = (id) => async () => {
        setCurrentChannelId(id);
        // in process
    };
    const isAuth = useContext(UserContext);

    return isAuth() ? (
        <>
        <div className="chatPage" style={{ display: "flex" }}>
            <div
                className="channels"
                style={{ display: "flex", flexDirection: "column" }}
            >
                <Link onClick={logOut} to="/login">Log out</Link>
                <br />
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {stateChannels.map((item) => (
                        <li key={item.id}>
                            <a href="#" onClick={onClick(item.id)}>
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <br />
            </div>

            <div
                className="messages"
                style={{ display: "flex", flexDirection: "column", paddingLeft: 10 }}
            >
                <div>You are {username}</div>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {stateMessages.map((item) => (
                        <li key={item.id}>{item.value}</li>
                    ))}
                </ul>
                <br />
                <form onSubmit={onSubmit}>
                    <label>
                        <input
                            type="text"
                            placeholder="Type your message"
                            value={text}
                            onChange={onChange}
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default MainPage;

