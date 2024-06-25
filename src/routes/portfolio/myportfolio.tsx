// Myportfolio.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AccountSelector from "@/components/AccountSelector";
import PortfolioSubmit from "@/components/PortfolioSubmit";
import { portfolioApi } from "@/apis/portfolioAPI";
import StockList from "./stockList";
import BackTest from "./detail/BackTest";
import accountAPI from "@/apis/accountAPI";

export function Myportfolio() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [showSheet, setShowSheet] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [tab, setTab] = useState<"StockList" | "BackTest">("StockList");
  const [accounts, setAccounts] = useState<string[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        //연결된 어카운트 다 가져옴
        const response = await new accountAPI().getAccountList();
        //response에 메시지 포함이라 리스트만 가져옴
        const accountList = response.accountList.map((account: { account_number: string }) => account.account_number);
        // 같은 string으로 넣어줘야함
        setAccounts(accountList);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  // 계좌 선택 시 포트폴리오 상태 체크
  useEffect(() => {
    const checkPortfolioStatus = async () => {
      if (selectedAccount) {
        console.log("Selected Account:", selectedAccount); // 디버깅용 로그
        try {
          const portfolio = await portfolioApi.getPortfolioByAccountId(selectedAccount);
          console.log("API Response:", portfolio); // 디버깅용 로그
          setIsPublished(portfolio?.published || false);
        } catch (error) {
          console.error("Error checking portfolio status:", error);
          setIsPublished(false);
        }
      }
    };
    checkPortfolioStatus();
  }, [selectedAccount]);

  // 등록 취소 핸들러
  const handleCancelRegistration = async () => {
    try {
      await portfolioApi.updatePortfolio(selectedAccount, { published: false });
      alert("포트폴리오가 취소되었습니다.");
      setIsPublished(false);
    } catch (error) {
      console.error("Error cancelling portfolio registration:", error);
    }
  };

  // 등록 핸들러
  const handleRegister = () => {
    setShowSheet(true);
  };

  return (
    <div className="my-portfolio-container flex flex-col h-screen min-h-screen">
      <nav className="flex flex-row justify-between p-2 h-14 items-center box-border">
        <AccountSelector selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
        <div className="flex flex-row justify-between gap-2">
          <div
            className={`text-zinc-900 hover:text-zinc-700 py-2 text-nowrap ${
              tab === "StockList" && "active border-b-[3px] border-indigo-500/100"
            } `}
            onClick={() => {
              if (tab !== "StockList") setTab("StockList");
            }}
          >
            종목 리스트
          </div>
          <div
            className={`text-zinc-900 hover:text-zinc-700 py-2 text-nowrap ${
              tab === "BackTest" && "active border-b-[3px] border-indigo-500/100"
            }`}
            onClick={() => {
              if (tab !== "BackTest") setTab("BackTest");
            }}
          >
            과거 투자 성과
          </div>
          <div className="flex justify-end">
            {isPublished ? (
              <Button
                variant="outline"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleCancelRegistration}
              >
                등록 취소
              </Button>
            ) : (
              <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleRegister}>
                등록
              </Button>
            )}
          </div>
        </div>
      </nav>
      {!accounts.length ? (
        <div className="flex flex-1 justify-center items-center">
          <p>연결된 계좌가 없습니다.</p>
        </div>
      ) : (
        selectedAccount && (
          <div className="tab-container px-6 overflow-y-auto flex-1">
            {tab === "StockList" && <StockList id={selectedAccount} />}
            {tab === "BackTest" && <BackTest id={selectedAccount} />}
          </div>
        )
      )}
      <PortfolioSubmit
        selectedAccount={selectedAccount}
        showSheet={showSheet}
        setShowSheet={setShowSheet}
        setIsPublished={setIsPublished} // 포트폴리오 상태 업데이트를 위해 추가
      />
    </div>
  );
}

export default Myportfolio;
