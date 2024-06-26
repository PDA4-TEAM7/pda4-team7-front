/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import StockList from "../stockList";
import BackTest from "./BackTest";
import CommPage from "../comm_page";
import { portfolioApi } from "@/apis/portfolioAPI";
// portfolio/detail/1
export default function DetailPage() {
  const [title, setTitle] = useState<string>();
  const [tab, setTab] = useState<"StockList" | "BackTest" | "Community">("StockList");
  const [accountId, setAccountId] = useState<string>();
  //TODO: portfolio id를 받아와서 portfolio조회하고, accountID 값을 받고 다시 조회하기
  const { id } = useParams();

  useEffect(() => {
    const AccountId = async (portfolioId: string) => {
      const port = await portfolioApi.getPortfolioByPortfolioId(portfolioId);
      setAccountId(port.account_id); // account_id를 상태로 설정
      setTitle(port.title);
    };
    if (id) {
      AccountId(id);
    }
  }, [id]);

  if (!id) return <div>param not found</div>;
  if (!accountId) return <div>loading...</div>;
  return (
    <div className="portfolio-detail-container h-screen flex flex-col">
      <nav className="flex flex-row items-center justify-between p-2 text-2xl h-14 box-border">
        <div>
          <p className="text-2xl font-bold pb-2 pl-4">{title}</p>
        </div>
        <div className="space-x-4 flex flex-row gap-4 pr-12">
          <div
            className={`text-zinc-900 hover:text-zinc-700 pb-2 ${
              tab === "StockList" && "active border-b-[3px] border-indigo-500/100"
            } `}
            onClick={() => {
              if (tab !== "StockList") setTab("StockList");
            }}
          >
            종목 리스트
          </div>
          <div
            className={`text-zinc-900 hover:text-zinc-700 pb-2 ${
              tab === "BackTest" && "active border-b-[3px] border-indigo-500/100"
            }`}
            onClick={() => {
              if (tab !== "BackTest") setTab("BackTest");
            }}
          >
            과거 투자 성과
          </div>
          <div
            className={`text-zinc-900 hover:text-zinc-700 pb-2 ${
              tab === "Community" && "active border-b-[3px] border-indigo-500/100"
            }`}
            onClick={() => {
              if (tab !== "Community") setTab("Community");
            }}
          >
            질의응답
          </div>
        </div>
      </nav>
      <div className="tab-container px-6 overflow-y-auto flex-1">
        {tab === "StockList" && <StockList id={accountId} />}
        {tab === "BackTest" && <BackTest id={accountId} />}
        {tab === "Community" && <CommPage id={id} />}
      </div>
    </div>
  );
}
