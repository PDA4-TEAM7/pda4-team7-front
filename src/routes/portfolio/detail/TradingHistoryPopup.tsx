/* eslint-disable @typescript-eslint/no-explicit-any */
import StockApi from "@/apis/stockAPI";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/nums";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
type Props = { modalShow: boolean; modalClose: () => void; accountId: string };

export default function TradingHistoryPopup({ modalShow, modalClose, accountId }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [tradingData, setTradingData] = useState<any[]>([]);

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

  useEffect(() => {
    async function fetchData() {
      try {
        const service = new StockApi();
        const data = await service.getTradingHistory(accountId);
        console.log("data:", data);
        setTradingData(data);
      } catch {
        console.log("error to trading");
      }
    }
    fetchData();
  }, []);

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
            {tradingData &&
              tradingData.map((his, i, array) => {
                //array[i-1]확인해서, 전에꺼랑 날짜가 다르면 true 같으면 false
                const showDay =
                  i > 0 &&
                  dayjs(array[i - 1].trade_dt).isSame(his.trade_dt, "month") &&
                  dayjs(array[i - 1].trade_dt).isSame(his.trade_dt, "day")
                    ? false
                    : true;
                return (
                  <>
                    <div>{showDay && <p className="pt-2">{dayjs(his.trade_dt).format("MM월 DD일")}</p>}</div>
                    <div key={i} className="flex justify-between items-center mb-2 p-3 bg-gray-100 rounded-lg shadow">
                      <div className="text-left">
                        <p>
                          <span className="">{his.stock.name} </span>
                          <span className="font-semibold">{formatNumber(his.tot_ccld_qty)}주 </span>
                          <span>
                            {his.sll_buy_dvsn_cd == "02" && "구매"}
                            {his.sll_buy_dvsn_cd == "01" && "판매"}
                          </span>
                        </p>
                        <p className="text-slate-600 text-xs">
                          {dayjs(his.trade_dt).format("HH:mm")}
                          <span> 주당 {formatNumber(+his.tot_ccld_amt / +his.tot_ccld_qty)}원</span>
                        </p>
                      </div>

                      <div className="text-right flex flex-col">
                        <span className="text-sm font-medium">{formatNumber(his.tot_ccld_amt)}원</span>
                        {his.sll_buy_dvsn_cd == "01" && (
                          <span className={` ${his.evlu_pfls_rt >= 0 ? "text-red-600" : "text-blue-600"} text-sm`}>
                            {his.evlu_pfls_rt >= 0
                              ? `+${formatNumber(his.evlu_pfls_amt)}원`
                              : `${formatNumber(his.evlu_pfls_amt)}원`}
                            <span className="">({formatNumber(Math.abs(his.evlu_pfls_rt), 2)}%)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
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
