import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import useModal from "@/hooks/useModal";

//TODO: userId 로 계좌 조회 해서 리스트 표시
export default function AddAccountPopup({ modalShow, modalClose }: { modalShow: boolean; modalClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { open, close } = useModal();

  const closeAddModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      modalClose();
    }
  };
  const handleModal = ({ title, text }: { title: string; text: string }) => {
    // DUMMY: 성공여부추가하기
    const success = true;
    //TODO: 성공하면 닫기
    open(title, text, () => {
      modalClose();
    });
    //TODO: 실패하면 공용모달만닫기.
    if (!success) {
      open(title, text, close);
    }
  };

  useEffect(() => {
    if (modalShow) {
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
  }, [modalShow]);

  if (!modalShow) return null;
  return (
    <div
      className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
      style={{ background: "rgba(0,0,0,.7)", zIndex: "10000" }}
      onClick={closeAddModal}
    >
      <div
        className="border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content py-4 text-left px-6 min-h-[400px] max-h-[80vh] flex flex-col justify-between">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold ">{"계좌 추가하기"}</p>
            <div className="modal-close cursor-pointer z-50" onClick={() => modalClose()}>
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
          <div className="py-4 space-y-4 overflow-scroll h-full pr-3 flex-1">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name" className="text-lg">
                App Key
              </Label>
              <Input type="string" id="name" placeholder="app key" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name" className="text-lg">
                App Secret Key
              </Label>
              <Input type="string" id="name" placeholder="app secret key" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name" className="text-lg">
                Account
              </Label>
              <Input type="string" id="name" placeholder="account" />
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => {
                // TODO: 계좌 추가 API연결
                handleModal({ title: "성공!", text: "성공했습니다!" });
              }}
              className="focus:outline-none px-4 bg-indigo-500 p-3 ml-3 rounded-lg text-white hover:bg-indigo-400 w-[120px]"
            >
              계좌 추가하기
            </Button>
            <Button
              onClick={() => modalClose()}
              variant="outline"
              className="focus:outline-none px-4 bg-white p-3 ml-3 rounded-lg hover:bg-slate-200  w-[120px]"
            >
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}