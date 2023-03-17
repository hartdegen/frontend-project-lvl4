import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { decrement, incrementByAmount } from '../slices/counterSlice.js';
import {UserContext} from "../index.js";

// eslint-disable-next-line import/no-anonymous-default-export
export default() => {
    const [ value, setValue ] = useState(15);
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();
    const isAuth = useContext(UserContext);

    return !isAuth() ? (
        <><p>you not authorized</p><Link to="/login">Go to login page</Link></>
    ) : (
        <div>
            <button onClick={() => dispatch(incrementByAmount(Number(value)))}>Прибавить</button>
            <input type="number" value={value} onChange={e => setValue(e.target.value)}/>
            <br/>
            <span>{count}</span>
            <br/>
            <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>Отнять</button>
            <br/>
            <p><Link to="/login">Go to login page</Link></p>
        </div>
    );
};