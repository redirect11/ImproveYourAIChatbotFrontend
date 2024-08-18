import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    handover: window?.ChatbotData?.messages?.data?.is_handover_thread ? window.ChatbotData.messages.data.is_handover_thread : false,
};


export const handoverSlice = createSlice({
  name: 'handover',
  initialState,
  reducers: {
    setHandover: (state, action) => {
      state.handover = action.payload;
    },

  },
})

// Action creators are generated for each case reducer function
export const { setHandover } = handoverSlice.actions

export default handoverSlice.reducer