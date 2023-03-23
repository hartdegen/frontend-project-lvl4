import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();
// default state be like: { ids: [], entities: {} }
const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
    name: "channels",
    initialState,
    reducers: {
        addChannel: channelsAdapter.addOne,
        addChannels: channelsAdapter.addMany,
        removeChannel: channelsAdapter.removeOne,
    },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const { addChannel, addChannels, removeChannel } = channelsSlice.actions;
export default channelsSlice.reducer;

