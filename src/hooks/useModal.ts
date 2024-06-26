import { showModal, closeModal, showExtendedModal, closeExtendedModal } from "@/store/modal";
import { useDispatch } from "react-redux";

export default function useModal() {
  const dispatch = useDispatch();

  const close = () => {
    dispatch(closeModal());
  };

  const open = (title: string, message: string | JSX.Element, onClick: () => void) => {
    dispatch(
      showModal({
        title: title,
        message: message,
        onClick: onClick,
        show: true,
      })
    );
  };

  const closeExtended = () => {
    dispatch(closeExtendedModal());
  };

  const openExtended = (
    title: string,
    message: string | React.ReactNode,
    onConfirm: () => void,
    onCancel: () => void
  ) => {
    dispatch(
      showExtendedModal({
        title: title,
        message: message,
        onConfirm: onConfirm,
        onCancel: onCancel,
        show: true,
      })
    );
  };

  return { open, close, openExtended, closeExtended };
}
