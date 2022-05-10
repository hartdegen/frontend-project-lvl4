import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();
// Начальное значение
// По умолчанию: { ids: [], entities: {} }
const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
    name: "channels",
    initialState,
    reducers: {
        addChannel: channelsAdapter.addOne,
        addChannels: channelsAdapter.addMany,
    },
});

export const selectors = channelsAdapter.getSelectors(
    (state) => state.channels
);
export const { addChannel, addChannels } = channelsSlice.actions;
export default channelsSlice.reducer;
