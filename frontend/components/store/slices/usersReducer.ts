import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface initialState {
  onlineUsers: string[];
}

const initialState: initialState = { onlineUsers: [] };

const UserSlicer = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<string>) => {
       if (!Array.isArray(state.onlineUsers)) {
        state.onlineUsers = [];
      }
      const id = state.onlineUsers.indexOf(action.payload);
      if (id === -1) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {

        if (!Array.isArray(state.onlineUsers)) {
        state.onlineUsers = [];
      }
      const id = state.onlineUsers.indexOf(action.payload);

      if (id === -1) return;
      state.onlineUsers.splice(id, 1);
    },
  },
});

export const { addUser, removeUser } = UserSlicer.actions;

export default UserSlicer.reducer;
