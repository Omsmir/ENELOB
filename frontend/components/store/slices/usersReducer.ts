import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface initialState {
  onlineUsers: string[];
  conversationId: string;
  lastSeenMap: Record<string, unknown>;
}

const initialState: initialState = {
  onlineUsers: [],
  conversationId: "",
  lastSeenMap: {},
};

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

    updateConversationId: (state, action: PayloadAction<string>) => {
      state.conversationId = action.payload;
    },
    updateLastSeen: (
      state,
      action: PayloadAction<{ key: string; value: unknown }>
    ) => {
      if (!state.lastSeenMap) {
        state.lastSeenMap = {};
      }
      state.lastSeenMap[action.payload.key] = action.payload.value;
    },
  },
});

export const { addUser, removeUser, updateConversationId, updateLastSeen } =
  UserSlicer.actions;

export default UserSlicer.reducer;
