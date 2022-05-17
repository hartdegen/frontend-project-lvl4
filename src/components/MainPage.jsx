import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import { useSelector, useDispatch, batch } from "react-redux";
import axios from "axios";
import _ from "lodash";

import UserContext from "./contexts/UserContext.js";
import { selectors as channelsSelectors } from "../slices/channelsSlice.js";
import { selectors as messagesSelectors } from "../slices/messagesSlice.js";
import { addChannels } from "../slices/channelsSlice.js";
import { addMessages, addMessage } from "../slices/messagesSlice.js";

const MainPage = (props) => {
    const dispatch = useDispatch();
    const [text, setText] = useState();
    const [currentChannelId, setCurrentChannelId] = useState();
    useEffect(() => {
        const updateData = async () => {
            try {
                const token = localStorage.getItem("token");
                const {
                    data: { channels, messages, currentChannelId },
                } = await axios.get("/api/v1/data", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                batch(() => {
                    dispatch(addChannels(channels));
                    dispatch(addMessages(messages));
                });
                setCurrentChannelId(currentChannelId);
                console.log(`useEffect, channels`, channels);
                console.log(`useEffect, messages`, messages);
            } catch (err) {
                console.error(`ERROR CATCH`, err);
            }
        };
        updateData();
    }, []);

    const stateChannels = useSelector(channelsSelectors.selectAll);
    const stateMessages = useSelector(messagesSelectors.selectAll);

    const onChange = (e) => setText(e.target.value);
    const onSubmit = (e) => {
        e.preventDefault();
        const message = {
            channelId: currentChannelId,
            id: _.uniqueId(),
            value: text,
        };
        dispatch(addMessage(message));
        setText("");
        console.log(`stateMessages`, stateMessages);
    };
    const onClick = (id) => async () => {
        setCurrentChannelId(id);
        // in process
    };
    const isAuth = useContext(UserContext);

    return isAuth() ? (
        <>
            <div className="channels">
                <ul>
                    {stateChannels.map((item) => (
                        <li key={item.id}>
                            <a
                                href="#"
                                className="todo-task"
                                onClick={onClick(item.id)}
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <br />
            </div>

            <div className="messages">
                here will be messages
                <ul>
                    {stateMessages.map((item) => (
                        <li key={item.id}>{item.value}</li>
                    ))}
                </ul>
                <br />
            </div>

            <Form onSubmit={onSubmit}>
                <InputGroup>
                    <FormControl
                        placeholder="Type your message"
                        value={text}
                        onChange={onChange}
                    />
                    <Button type="submit" variant="outline-secondary">
                        Send
                    </Button>
                </InputGroup>
            </Form>

            <br />
            <Link to="/login">authentication page</Link>
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default MainPage;
