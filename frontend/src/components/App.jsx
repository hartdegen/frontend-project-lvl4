import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment, incrementByAmount } from '../slices/counterSlice.js';

// eslint-disable-next-line import/no-anonymous-default-export
export default() => {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div>
            <div>
                <button aria-label="Increment value" onClick={() => dispatch(increment())}>
                    Прибавить
                </button>
                <span>{count}</span>
                <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
                    Отнять
                </button>
                <br/>
                <button onClick={() => dispatch(incrementByAmount(42))}>Прибавить 42</button>
            </div>
        </div>
    );
};