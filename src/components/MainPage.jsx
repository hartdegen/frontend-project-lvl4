import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch, batch } from "react-redux";
import UserContext from "./contexts/UserContext.js";

import { selectors as channelsSelectors } from "../slices/channelsSlice.js";
import { selectors as messagesSelectors } from "../slices/messagesSlice.js";

const MainPage = (props) => {
    const stateChannels = useSelector(channelsSelectors.selectAll);
    const stateMessages = useSelector(messagesSelectors.selectAll);

    const isAuth = useContext(UserContext);
    console.log(888, stateChannels);
    console.log(999, stateMessages);
    return isAuth() ? (
        <div className="channels">
            <ul>
                {stateChannels.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
            <br />
            <Link to="/login">authentication page</Link>
            <br />
        </div>
    ) : (
        <Navigate to="/login" />
    );
};

export default MainPage;
