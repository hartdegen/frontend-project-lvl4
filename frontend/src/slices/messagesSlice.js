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
    },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export const { addMessage, addMessages } = messagesSlice.actions;
export default messagesSlice.reducer;

