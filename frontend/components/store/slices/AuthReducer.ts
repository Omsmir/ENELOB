import { UserAuth } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";

interface InitialState {
  session: UserAuth;
}

const initialState: InitialState = {
  session: {
    _id: "",
    full_name: "",
    email: "",
    verified: false,
    profileImg: "",
    coverImg: "",
    accessToken: "",
    refreshToken: "",
    friends:[],
    expiresAt: undefined,
    lastSeenAt: undefined,
  },
};

type updateSession = { key: keyof UserAuth; value: unknown };

const AuthSlicer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserSession: (state, action: PayloadAction<UserAuth>) => {
      state.session = action.payload;
    },
    logout: () => {
      return initialState;
    },
    updateUserSession: (state, action: PayloadAction<updateSession>) => {
      state.session[action.payload.key] = action.payload.value;
    },
  },
});

export const { logout, setUserSession, updateUserSession } = AuthSlicer.actions;


export const signOut = () => {
  const dispatch = useDispatch();
  return dispatch(logout());
};

export const useSession = (): {
  session: UserAuth;
} => {
  const state = useSelector((state: RootState) => state.auth);
  const session = state.session;

  
  return { session };
};

export default AuthSlicer.reducer;
