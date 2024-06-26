import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import StockList from "../stockList";
import BackTest from "./BackTest";
import CommPage from "../comm_page";
import { portfolioApi } from "@/apis/portfolioAPI";

import useModal from "@/hooks/useModal";

// portfolio/detail/1
export default function DetailPage() {
  const [title, setTitle] = useState<string>();
  const [tab, setTab] = useState<"StockList" | "BackTest" | "Community">("StockList");
  const [accountId, setAccountId] = useState<string>();
  const { id } = useParams();
  const { close, open } = useModal();

  useEffect(() => {
    const AccountId = async (portfolioId: string) => {
      const port = await portfolioApi.getPortfolioByPortfolioId(portfolioId);
      setAccountId(port.account_id);
      setTitle(port.title);
    };
    if (id) {
      AccountId(id);
    }
  }, [id]);

  const modalContent = (
    <div className="text-left space-y-4">
      <h2 className="text-lg font-bold">과거 투자 성과란?</h2>
      <p>
        과거 투자 성과는 백테스팅 서비스를 의미하며, 2004년 1월부터 현재까지의 주식 시장 내역을 통해 현재 사용자가 보고
        있는 포트폴리오의 신뢰도를 판단하는 방법입니다. 날짜 별 종목 성과는 각 주식에 대해 사용자가 설정한 기간 동안의
        수익률을 월별로 나타내며, 상단에 그래프를 통해 간단하게 도식화합니다.
      </p>
      <h3 className="text-md font-semibold">주요 지표 설명</h3>
      <p>
        <strong>Sharpe Ratio (샤프 지수) :</strong> 포트폴리오 수익률에서 무위험 이자율을 뺀 값을 표준편차로 나눈
        값입니다.
        <br />
        (포트폴리오 수익률 - 무위험 이자율) / 표준편차
        <br />
        무위험 이자율: 한국 무위험 표준 금리 0.03을 사용하여 계산합니다.
        <br />
        숫자가 높을수록 적은 위험으로 높은 수익률을 내는 것을 의미합니다. 0 이상일 경우 고려할 만하고, 1 이상이면 좋은
        투자정보로 간주됩니다.
      </p>
      <p>
        <strong>MDD (최대 낙폭) :</strong> 포트폴리오 가치가 가장 큰 폭으로 하락한 비율을 나타냅니다.
        <br />
        MDD는 투자 기간 동안 가장 큰 손실을 측정하는 지표로, 값이 낮을수록 리스크가 적음을 의미합니다.
      </p>
      <p>
        <strong>STD (표준편차) :</strong> 포트폴리오 수익률의 변동성을 나타냅니다.
        <br />
        값이 클수록 수익률의 변동성이 크며, 이는 높은 리스크를 의미합니다.
      </p>
      <p>
        <strong>Annual Return (연간 이율) :</strong> 포트폴리오의 연평균 수익률을 나타냅니다.
        <br />
        투자 기간 동안 평균적으로 어느 정도의 수익을 올렸는지를 보여주는 지표로, 높을수록 좋습니다.
      </p>
      <p>
        <strong>Total Balance (총 자산) :</strong> 백테스팅 후 포트폴리오의 총 자산 규모를 나타냅니다.
        <br />
        초기 투자금 대비 얼마나 자산이 늘었는지를 보여주는 지표로, 투자의 성과를 평가하는 데 사용됩니다.
      </p>
      <p>
        이러한 지표들을 통해 과거 투자 성과를 분석하면 현재 보고 계신 포트폴리오의 신뢰도를 보다 정확하게 판단할 수
        있습니다.
      </p>
    </div>
  );

  // TODO: 이거 컴포넌트로 쓸거면 모달에서 받는 값 컴포넌트로 변경해주세요.
  const handleModalOpen = () => {
    open("과거 투자 성과란?", modalContent, close);
  };

  if (!id) return <div>param not found</div>;
  if (!accountId) return <div>loading...</div>;

  return (
    <div className="portfolio-detail-container h-screen flex flex-col ">
      <nav className="flex lg:flex-row items-center justify-end p-2 gap-4 h-22 box-border flex-row mr-4">
        <div
          className={`text-zinc-900 hover:text-zinc-700 box-border pb-[4px] ${
            tab === "StockList" && "active border-b-[3px] pb-[1px] font-semibold border-indigo-500/100"
          }`}
          onClick={() => {
            if (tab !== "StockList") setTab("StockList");
          }}
        >
          <span> 종목 리스트</span>
        </div>
        <div
          className={`text-zinc-900 hover:text-zinc-700 flex box-border flex-row items-center pb-[4px] ${
            tab === "BackTest" && "active border-b-[3px] pb-[1px] font-semibold border-indigo-500/100"
          }`}
          onClick={() => {
            if (tab !== "BackTest") setTab("BackTest");
          }}
        >
          <span>과거 투자 성과</span>
          <div className="ml-1 bg-transparent p-0 hover:bg-transparent " onClick={handleModalOpen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-4 h-4 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>
        <div
          className={`text-zinc-900 hover:text-zinc-700 box-border pb-[4px] ${
            tab === "Community" && "active border-b-[3px] pb-[1px] font-semibold border-indigo-500/100"
          }`}
          onClick={() => {
            if (tab !== "Community") setTab("Community");
          }}
        >
          <span> 질의응답</span>
        </div>
      </nav>
      <div className="tab-container sm:px-6 px-2 overflow-y-auto flex-1 ">
        {tab === "StockList" && <StockList id={accountId} title={title || ""} />}
        {tab === "BackTest" && <BackTest id={accountId} />}
        {tab === "Community" && <CommPage id={id} />}
      </div>
    </div>
  );
}
