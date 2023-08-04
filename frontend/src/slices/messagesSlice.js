import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    removeMessage: messagesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      // state is proxy object, `current()` from "@reduxjs/toolkit" make it fine
      // import { current } from '@reduxjs/toolkit';
      // console.log(action.payload, current(state), 'updating');
      const channelId = action.payload;
      const messagesNotFromRemovedChannel = Object.values(state.entities)
        .filter((e) => e.channelId !== channelId);
      messagesAdapter.setAll(state, messagesNotFromRemovedChannel);
    });
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export const { addMessage, addMessages, removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
