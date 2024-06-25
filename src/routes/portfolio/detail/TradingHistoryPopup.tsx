/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/nums";
import { useEffect, useRef } from "react";
type Props = { modalShow: boolean; modalClose: () => void; data: any[] };

export default function TradingHistoryPopup({ modalShow, modalClose, data }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

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
      onClick={modalClose}
    >
      <div
        className="border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content py-4 text-left px-6 min-h-[400px] max-h-[80vh] flex flex-col justify-between">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold"> 거래 내역 조회</p>
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
          <div className="py-4 space-y-3 overflow-scroll h-full pr-3 flex-1">
            {data &&
              data.map((stock, i) => (
                <div key={i} className="flex justify-between items-center mb-2 p-3 bg-gray-100 rounded-lg shadow">
                  <div className="text-left">
                    <span className="block ">{stock.stock_name}</span>
                    <span className="block text-sm text-zinc-600">{formatNumber(stock.hldg_qty)}주</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm ">{formatNumber(stock.evlu_amt)}원</span>
                    <span className={`block ${stock.evlu_pfls_rt >= 0 ? "text-red-600" : "text-blue-600"} text-sm`}>
                      {stock.evlu_pfls_rt >= 0
                        ? `+${formatNumber(stock.evlu_amt)}원`
                        : `-${formatNumber(stock.evlu_amt)}원`}{" "}
                      ({formatNumber(stock.evlu_pfls_rt, 2)}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-center pt-4">
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
