import { RootState } from "@/store/store";
import { useEffect } from "react";
import { closeModal, closeExtendedModal } from "@/store/modal";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import "./modal.css";

export default function CommonPopup() {
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.modal);

  const close = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.currentTarget.classList.contains("main-modal")) {
      if (modal.basic.show) {
        dispatch(closeModal());
      } else if (modal.extended.show) {
        dispatch(closeExtendedModal());
      }
    }
  };

  useEffect(() => {
    if (modal.basic.show || modal.extended.show) {
      // 모달이 열리면 body의 overflow를 hidden으로 설정하여 배경 스크롤을 막음
      document.body.style.overflow = "hidden";
    } else {
      // 모달이 닫히면 body의 overflow를 auto로 설정하여 배경 스크롤을 허용함
      document.body.style.overflow = "auto";
    }

    // 클린업 함수: 모달이 언마운트될 때 overflow를 auto로 설정하여 배경 스크롤을 허용함
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modal.basic.show, modal.extended.show]);

  if (!modal.basic.show && !modal.extended.show) return null;

  return (
    <div
      className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
      style={{ background: "rgba(0,0,0,.7)", zIndex: "10000" }}
      onClick={(e) => close(e)}
    >
      <div
        className={`border border-teal-500 shadow-lg modal-container bg-white w-11/12 ${
          modal.extended.show ? "md:max-w-4xl" : "md:max-w-md"
        } mx-auto rounded shadow-lg z-50 overflow-y-auto`}
        style={{ maxHeight: "80vh" }} // 최대 높이 설정
      >
        <div className="modal-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">{modal.basic.show ? modal.basic.title : modal.extended.title}</p>
            <div
              className="modal-close cursor-pointer z-50"
              onClick={() => {
                if (modal.basic.show) {
                  dispatch(closeModal());
                } else if (modal.extended.show) {
                  dispatch(closeExtendedModal());
                }
              }}
            >
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="my-3 text-center overflow-y-auto" style={{ maxHeight: "50vh" }}>
            <p>{modal.basic.show ? modal.basic.message : modal.extended.message}</p>
          </div>

          <div className="flex justify-center pt-2">
            {modal.basic.show ? (
              <button
                onClick={() => {
                  modal.basic.onClick();
                  dispatch(closeModal());
                }}
                className="focus:outline-none px-4 bg-indigo-500 p-3 ml-3 rounded-lg text-white hover:bg-indigo-400"
              >
                확인
              </button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    modal.extended.onConfirm();
                    dispatch(closeExtendedModal());
                  }}
                  className="focus:outline-none px-4 bg-blue-500 p-3 ml-3 rounded-lg text-white hover:bg-blue-400"
                >
                  동의
                </Button>
                <Button
                  onClick={() => {
                    modal.extended.onCancel();
                    dispatch(closeExtendedModal());
                  }}
                  className="focus:outline-none px-4 bg-gray-500 p-3 ml-3 rounded-lg text-white hover:bg-gray-400"
                >
                  동의하지 않음
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
