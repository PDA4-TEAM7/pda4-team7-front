/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import StockList from "../stockList";
import BackTest from "./BackTest";
import CommPage from "../comm_page";
// portfolio/detail/1
export default function DetailPage() {
  const [title, setTitle] = useState<string>();
  const [tab, setTab] = useState<"StockList" | "BackTest" | "Community">("BackTest");
  //TODO: portfolio id를 받아와서 portfolio조회하고, accountID 값을 받고 다시 조회하기
  const { id } = useParams();

  useEffect(() => {
    setTitle("제목");
  }, []);
  if (!id) return <div>param not found</div>;
  return (
    <div className="portfolio-detail-container">
      <nav className="flex flex-row items-center justify-between m-6 text-3xl ">
        <div>
          <p className="text-3xl font-bold">{title}</p>
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
      <div className="tab-container mx-6">
        {tab === "StockList" && <StockList id={id} />}
        {tab === "BackTest" && <BackTest id={id} />}
        {tab === "Community" && <CommPage id={id} />}
      </div>
    </div>
  );
}
