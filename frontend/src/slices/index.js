import { configureStore } from "@reduxjs/toolkit";
import channelsReducer from "./channelsSlice.js";
import messagesReducer from "./messagesSlice.js";

export default configureStore({
    reducer: {
        // channels – имя внутри объекта состояния state.channels
        channels: channelsReducer,
        messages: messagesReducer,
    },
});

