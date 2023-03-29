import { removeChannel } from "./channelsSlice.js";
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const messagesAdapter = createEntityAdapter();
// default state be like: { ids: [], entities: {} }
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage: messagesAdapter.addOne,
        addMessages: messagesAdapter.addMany,
        removeMessage: messagesAdapter.removeOne,
    },
    extraReducers: (builder) => {
        builder.addCase(removeChannel, (state, action) => {
            // console.log(11111, current(state)); // state is proxy object, `current()` from "@reduxjs/toolkit" make it fine
            // console.log(22222, action);
            const channelId = action.payload;
            const messagesNotFromRemovedChannel = Object.values(state.entities).filter((e) => e.channelId !== channelId);
            messagesAdapter.setAll(state, messagesNotFromRemovedChannel);
        });
    },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export const { addMessage, addMessages, removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
