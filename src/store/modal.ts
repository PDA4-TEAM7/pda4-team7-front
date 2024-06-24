import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IModal {
  show: boolean;
  title: string;
  message: string | React.ReactNode;
  onClick: () => void;
}

export interface IExtendedModal {
  show: boolean;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const initState: { basic: IModal; extended: IExtendedModal } = {
  basic: {
    show: false,
    title: "",
    message: "",
    onClick: () => {},
  },
  extended: {
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  },
};

const modalSlice = createSlice({
  name: "modal",
  initialState: initState,
  reducers: {
    showModal: (state, action: PayloadAction<IModal>) => {
      state.basic.show = true;
      state.basic.title = action.payload.title;
      state.basic.message = action.payload.message;
      state.basic.onClick = action.payload.onClick;
    },
    closeModal: (state) => {
      state.basic.show = false;
      state.basic.title = "";
      state.basic.message = "";
      state.basic.onClick = () => {};
    },
    showExtendedModal: (state, action: PayloadAction<IExtendedModal>) => {
      state.extended.show = true;
      state.extended.title = action.payload.title;
      state.extended.message = action.payload.message;
      state.extended.onConfirm = action.payload.onConfirm;
      state.extended.onCancel = action.payload.onCancel;
    },
    closeExtendedModal: (state) => {
      state.extended.show = false;
      state.extended.title = "";
      state.extended.message = "";
      state.extended.onConfirm = () => {};
      state.extended.onCancel = () => {};
    },
  },
});

export const { showModal, closeModal, showExtendedModal, closeExtendedModal } = modalSlice.actions;
export default modalSlice.reducer;
