// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import modalReducer from './modal';
const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware();
    return middlewares;
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
