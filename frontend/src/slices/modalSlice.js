import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: { whichModalShown: 'none', channelId: null },
  reducers: {
    openModal: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.channelId = action.payload.id || null;
      // eslint-disable-next-line no-param-reassign
      state.whichModalShown = action.payload.modalType;
    },
    closeModal: (state) => {
      // eslint-disable-next-line no-param-reassign
      state.whichModalShown = 'none';
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
