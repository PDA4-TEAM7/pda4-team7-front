/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import StockList from "../stockList";
import BackTest from "./BackTest";
import CommPage from "../comm_page";
// portfolio/detail/1
export default function DetailPage() {
  const [title, setTitle] = useState<string>();
  const [tab, setTab] = useState<"StockList" | "BackTest" | "Community">("StockList");
  const { id } = useParams();

  useEffect(() => {
    setTitle("제목");
  }, []);
  if (!id) return <div>param not found</div>;
  return (
    <div className="portfolio-detail-container">
      <nav className="flex flex-row items-center justify-between">
        <div>
          <h1>{title}</h1>
        </div>
        <div className="space-x-4 flex flex-row">
          <div
            className={`text-zinc-900 hover:text-zinc-700 ${tab === "StockList" && "active"}`}
            onClick={() => {
              if (tab !== "StockList") setTab("StockList");
            }}
          >
            종목 리스트
          </div>
          <div
            className={`text-zinc-900 hover:text-zinc-700 ${tab === "BackTest" && "active"}`}
            onClick={() => {
              if (tab !== "BackTest") setTab("BackTest");
            }}
          >
            과거 투자 성과
          </div>
          <div
            className={`text-zinc-900 hover:text-zinc-700 ${tab === "Community" && "active"}`}
            onClick={() => {
              if (tab !== "Community") setTab("Community");
            }}
          >
            질의응답
          </div>
        </div>
      </nav>
      <div className="tab-container">
        {tab === "StockList" && <StockList id={id} />}
        {tab === "BackTest" && <BackTest id={id} />}
        {tab === "Community" && <CommPage id={id} />}
      </div>
    </div>
  );
}
