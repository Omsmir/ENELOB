import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/usersReducer";
import authReducer from "./slices/AuthReducer";
import { persistReducer } from "redux-persist";
import storage from "./storage";

const persistConfig = {
  key: "root",
  storage,
};

const reducers = combineReducers({
  users: userReducer,
  auth: authReducer,
});

const persistedReducers = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist requires this
    }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
