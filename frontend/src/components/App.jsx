import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { decrement, increment, incrementByAmount } from '../slices/counterSlice.js';

// eslint-disable-next-line import/no-anonymous-default-export
export default() => {
    const [ value, setValue ] = useState(15);
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div>
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
        </div>
    );
};