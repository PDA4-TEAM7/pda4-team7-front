// src/store/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  userName: string | null;
  userId: string | null;
}

const initialState: UserState = {
  userId: null,
  userName: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      (state.userId = action.payload.userId), (state.userName = action.payload.userName);
    },
    clearUser: (state) => {
      (state.userId = null), (state.userName = null);
    },
  },
});

export default userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;
