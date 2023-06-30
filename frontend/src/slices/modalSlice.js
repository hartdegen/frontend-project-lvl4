import { createSlice, current } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: { whichModalShown: 'none', channelId: null },
  reducers: {
    toggleModalRemove: (state, action) => {
      console.log('isModalRemoveShown', action, current(state));
      // eslint-disable-next-line no-param-reassign
      state.channelId = action.payload || null;
      // eslint-disable-next-line no-param-reassign
      state.whichModalShown = state.whichModalShown === 'none' ? 'remove' : 'none';
    },
    toggleModalRename: (state, action) => {
      console.log('isModalRenameShown', action, current(state));
      // eslint-disable-next-line no-param-reassign
      state.channelId = action.payload || null;
      // eslint-disable-next-line no-param-reassign
      state.whichModalShown = state.whichModalShown === 'none' ? 'rename' : 'none';
    },
    toggleModalAddChannel: (state, action) => {
      console.log('isModalAddChannelShown', action, current(state));
      // eslint-disable-next-line no-param-reassign
      state.whichModalShown = state.whichModalShown === 'none' ? 'addChannel' : 'none';
    },
  },
});

export const { toggleModalRemove, toggleModalRename, toggleModalAddChannel } = modalSlice.actions;
export default modalSlice.reducer;
