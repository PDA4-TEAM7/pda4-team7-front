/* eslint-disable @typescript-eslint/no-explicit-any */
import { SVGProps, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { JSX } from "react/jsx-runtime";
import useAccount from "@/hooks/useAccount";
type Props = {
  modalShow: boolean;
  modalClose: () => void;
  openAddAccountModal: () => void;
};

//TODO: userId 로 계좌 조회 해서 리스트 표시
export default function AccountPopup({ modalShow, modalClose, openAddAccountModal }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [accountList, setAccountList] = useState<any[]>([]);
  const { getAccountList, deleteMyAccount } = useAccount();
  const close = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      modalClose();
    }
  };

  useEffect(() => {
    async function init() {
      const res = await getAccountList();
      if (res) {
        setAccountList(res);
      }
    }

    if (modalShow) {
      // 모달이 열리면 body의 overflow를 hidden으로 설정하여 배경 스크롤을 막음
      init();
      document.body.style.overflow = "hidden";
    } else {
      // 모달이 닫히면 body의 overflow를 auto로 설정하여 배경 스크롤을 허용함
      document.body.style.overflow = "auto";
    }

    // 클린업 함수: 모달이 언마운트될 때 overflow를 auto로 설정하여 배경 스크롤을 허용함
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalShow, accountList]);

  if (!modalShow) return null;

  const handleDelete = async (account_id: string) => {
    try {
      const res = await deleteMyAccount(account_id);
      alert("계좌가 삭제되었습니다.");
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (typeof error === "object" && error !== null) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        if (response && response.data && typeof response.data.message === "string") {
          errorMessage = response.data.message;
        }
      }
      alert(errorMessage);
    }
  };

  return (
    <div
      className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
      style={{ background: "rgba(0,0,0,.7)", zIndex: "10000" }}
      onClick={close}
    >
      <div
        className="border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content py-4 text-left px-6 min-h-[400px] max-h-[80vh] flex flex-col justify-between">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold ">{"계좌 조회"}</p>
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
          {accountList && accountList.length > 0 && (
            <div className="py-4 space-y-4 overflow-scroll h-full pr-3 flex-1">
              {accountList.map((value) => {
                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
                      <div>
                        <p className="font-medium">{value.account_number}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(value.account_id)}>
                          <Trash2Icon className="h-5 w-5" />
                          <span className="sr-only">Delete Address</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {accountList?.length === 0 && (
            <div>
              <p className="text-center text-slate-600">{"계좌가 없습니다. 등록해주세요!"}</p>
            </div>
          )}
          <div className="flex justify-center pt-2">
            <Button
              onClick={() => openAddAccountModal()}
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

function Trash2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
