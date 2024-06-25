import { useEffect, useState } from "react";
import RecencyAPI from "@/apis/recencyAPI";

export interface Transaction {
  name: string;
  sll_buy_dvsn_cd: "buy" | "sell";
  avg_prvs: number;
  tot_ccld_qty: number;
  tot_ccld_amt: number;
  user: string;
}

const TransactionCard = () => {
  const [recencyHistory, setRecencyHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchRecencyHistory = async () => {
      const recencyAPI = new RecencyAPI();
      const resp = await recencyAPI.getMyRecencyTradingHistory();
      const transactions = resp.map((item: Transaction) => ({
        name: item.name,
        sll_buy_dvsn_cd: (item.sll_buy_dvsn_cd as string) === "02" ? "buy" : ("sell" as string),
        avg_prvs: Number(item.avg_prvs),
        tot_ccld_qty: Number(item.tot_ccld_qty),
        tot_ccld_amt: Number(item.tot_ccld_amt),
        user: "투자자 이름 매핑", // 실제 투자자 이름 매핑 로직이 필요합니다.
      }));
      setRecencyHistory(transactions);
    };

    fetchRecencyHistory();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <span className="text-xl font-bold">최근 거래 내역</span>
        <span>전체 체결: {recencyHistory.length}건</span>
      </div>
      <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-300 overflow-auto">
        <div className="max-h-64 overflow-auto">
          {/* 헤더 추가 */}
          <div className="ml-2 mr-2 pl-4 pr-4 pb-1 rounded bg-white border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4 text-center">
              <div className="font-bold">종목명</div>
              <div className="font-bold">매수/매도</div>
              <div className="font-bold">체결평균가(원)</div>
              <div className="font-bold">총체결수량(주)</div>
              <div className="font-bold">총체결금액(원)</div>
              <div className="font-bold">투자자</div>
            </div>
          </div>
          {recencyHistory.map((transaction, index) => (
            <div
              key={index}
              className={`m-2 p-4 rounded-lg shadow-md ${
                transaction.sll_buy_dvsn_cd === "buy" ? "bg-red-200/50" : "bg-blue-200/50"
              }`}
            >
              <div className="grid grid-cols-6 gap-4 text-center">
                <div className="font-bold">{transaction.name}</div>
                <div
                  className={`font-bold ${transaction.sll_buy_dvsn_cd === "buy" ? "text-red-600" : "text-blue-600"}`}
                >
                  {transaction.sll_buy_dvsn_cd === "buy" ? "매수" : "매도"}
                </div>
                <div>{transaction.avg_prvs.toLocaleString()}원</div>
                <div>{transaction.tot_ccld_qty}주</div>
                <div>{transaction.tot_ccld_amt.toLocaleString()}원</div>
                <div>{transaction.user}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TransactionCard;
