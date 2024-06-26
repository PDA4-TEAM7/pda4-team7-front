import { useEffect, useState } from "react";
import RecencyAPI from "@/apis/recencyAPI";
import { Tooltip } from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/nums";
import { useNavigate } from "react-router-dom";
export interface Transaction {
  name: string;
  sll_buy_dvsn_cd: "buy" | "sell";
  avg_prvs: number;
  tot_ccld_qty: number;
  tot_ccld_amt: number;
  uid: number;
  account_id: number;
  portfolio_id: number;
}

export interface balanceAttributes {
  holdings_id?: number;
  account_id?: number;
  stock_id?: number;
  market_id?: number;
  hldg_qty?: string;
  // 매입 금액
  pchs_amt?: string;
  // 평가 금액
  evlu_amt?: string;
  // 평가 손익 금액
  evlu_pfls_amt?: string;
  // 손익률
  evlu_pfls_rt?: string;
}
export interface RecencyHoldingsAttributes {
  portfolio_id: number;
  account_id?: number;
  uid?: number;
  name?: string;
  hldg_qty: string;
  pchs_amt: string;
  evlu_amt: string;
  evlu_pfls_amt: string;
  evlu_pfls_rt: string;
  std_idst_clsf_cd_name?: string;
  closing_price?: number;
}
function formatDate(date: Date) {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
const TransactionCard = () => {
  const [recencyHistory, setRecencyHistory] = useState<Transaction[]>([]);
  const [hoverInfo, setHoverInfo] = useState<(RecencyHoldingsAttributes | null)[]>([]);
  const navigate = useNavigate();
  const currentDate = new Date();
  const yesterday = new Date(currentDate.setDate(currentDate.getDate() - 1));
  const formattedYesterday = formatDate(yesterday);

  useEffect(() => {
    const fetchRecencyHistory = async () => {
      const recencyAPI = new RecencyAPI();
      const resp = await recencyAPI.getMyRecencyTradingHistory();
      const transactions = resp.map((item: Transaction) => ({
        name: item.name,
        sll_buy_dvsn_cd: (item.sll_buy_dvsn_cd as string) === "02" ? "buy" : "sell",
        avg_prvs: Number(item.avg_prvs),
        tot_ccld_qty: Number(item.tot_ccld_qty),
        tot_ccld_amt: Number(item.tot_ccld_amt),
        uid: item.uid,
        account_id: item.account_id,
        portfolio_id: item.portfolio_id,
      }));
      setRecencyHistory(transactions);
      setHoverInfo(new Array(transactions.length).fill(null));
    };

    fetchRecencyHistory();
  }, []);

  const handleMovePortfolioClick = (portfolio_id: number) => {
    navigate(`/portfolio/detail/${portfolio_id}`);
  };
  const handleCardClick = async (index: number, accountId: number, name: string) => {
    if (hoverInfo[index] !== null) {
      // 이미 열려있으면 닫기
      const newHoverInfo = [...hoverInfo];
      newHoverInfo[index] = null;
      setHoverInfo(newHoverInfo);
    } else {
      // 열려있지 않으면 데이터 불러오기
      const recencyAPI = new RecencyAPI();
      const data = await recencyAPI.getStockInfoByAccountId(accountId, name);
      const newHoverInfo = [...hoverInfo];
      newHoverInfo[index] = data;
      setHoverInfo(newHoverInfo);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-800">최근 포트폴리오 변동 현황</span>
          <span className="text-base text-gray-600">{formattedYesterday}(어제) 기준</span>
        </div>
        <span className="text-gray-600">전체 체결: {recencyHistory.length}건</span>
      </div>
      <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-300 overflow-auto">
        <div className="max-h-64 overflow-auto">
          {/* 헤더 추가 */}
          <div className="ml-2 mr-2 pl-4 pr-4 pb-1 rounded bg-white border-b border-gray-200">
            <div className="grid grid-cols-5 gap-4 text-center">
              <div className="font-bold">종목명</div>
              <div className="font-bold">매수/매도</div>
              <div className="font-bold">체결 평균가(원)</div>
              <div className="font-bold">총 체결 수량(주)</div>
              <div className="font-bold">총 체결 금액(원)</div>
            </div>
          </div>

          {recencyHistory.map((transaction, index) => (
            <div
              key={index}
              className={`m-2 p-4 rounded-lg shadow-md ${
                transaction.sll_buy_dvsn_cd === "buy" ? "bg-red-200/50" : "bg-blue-200/50"
              }`}
              onClick={() => handleCardClick(index, transaction.account_id, transaction.name)}
            >
              <div className="grid grid-cols-5 gap-4 text-center">
                <div className="font-bold">{transaction.name}</div>
                <div
                  className={`font-bold ${transaction.sll_buy_dvsn_cd === "buy" ? "text-red-600" : "text-blue-600"}`}
                >
                  {transaction.sll_buy_dvsn_cd === "buy" ? "매수" : "매도"}
                </div>
                <div>{transaction.avg_prvs.toLocaleString()}원</div>
                <div>{transaction.tot_ccld_qty}주</div>
                <div>{transaction.tot_ccld_amt.toLocaleString()}원</div>
              </div>
              <div className="mt-4 ml-10">
                {hoverInfo[index] && (
                  <Tooltip>
                    <p>
                      {transaction.sll_buy_dvsn_cd === "buy" ? "매수" : "매도"} 후 보유 수량:{" "}
                      {formatNumber(Number(hoverInfo[index]?.hldg_qty))}주
                    </p>
                    <p>평가 금액: {formatNumber(Number(hoverInfo[index]?.evlu_amt))}원</p>
                    <p>
                      평가 손익 금액:{" "}
                      {(() => {
                        const profit = Number(hoverInfo[index]?.evlu_amt) - Number(hoverInfo[index]?.pchs_amt);
                        return profit < 0 ? (
                          <span className="text-blue-500">{formatNumber(profit)}원</span>
                        ) : (
                          <span className="text-red-500">+{formatNumber(profit)}원</span>
                        );
                      })()}
                    </p>
                    <div className="flex justify-end">
                      <span
                        className="mr-6 mt-4 cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={() => handleMovePortfolioClick(transaction.portfolio_id)}
                      >
                        포트폴리오 바로 보기
                      </span>
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TransactionCard;
