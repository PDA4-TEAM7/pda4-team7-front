import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AccountSelector from "@/components/AccountSelector";
import PortfolioSubmit from "@/components/PortfolioSubmit";
import { portfolioApi } from "@/apis/portfolioAPI";
import StockList from "./stockList";
import BackTest from "./detail/BackTest";
import CommPage from "./comm_page"; // CommPage import 추가
import accountAPI from "@/apis/accountAPI";

export function Myportfolio() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
  const [showSheet, setShowSheet] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [tab, setTab] = useState<"StockList" | "BackTest" | "Community">("StockList");
  const [accounts, setAccounts] = useState<string[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await new accountAPI().getAccountList();
        const accountList = response.accountList.map((account: { account_number: string }) => account.account_number);
        setAccounts(accountList);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const checkPortfolioStatus = async () => {
      if (selectedAccount) {
        console.log("Selected Account:", selectedAccount);
        try {
          const portfolio = await portfolioApi.getPortfolioByAccountId(selectedAccount);
          console.log("API Response:", portfolio);
          setIsPublished(portfolio?.published || false);
          setSelectedPortfolioId(portfolio?.portfolio_id || "");
        } catch (error) {
          console.error("Error checking portfolio status:", error);
          setIsPublished(false);
          setSelectedPortfolioId("");
        }
      }
    };
    checkPortfolioStatus();
  }, [selectedAccount]);

  const handleCancelRegistration = async () => {
    try {
      await portfolioApi.updatePortfolio(selectedAccount, { published: false });
      alert("포트폴리오가 취소되었습니다.");
      setIsPublished(false);
    } catch (error) {
      console.error("Error cancelling portfolio registration:", error);
    }
  };

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
          {isPublished && (
            <div
              className={`text-zinc-900 hover:text-zinc-700 py-2 text-nowrap ${
                tab === "Community" && "active border-b-[3px] border-indigo-500/100"
              }`}
              onClick={() => {
                if (tab !== "Community") setTab("Community");
              }}
            >
              질의응답
            </div>
          )}
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
            {tab === "StockList" && <StockList id={selectedAccount} title={null} />}
            {tab === "BackTest" && <BackTest id={selectedAccount} />}
            {tab === "Community" && isPublished && <CommPage id={selectedPortfolioId} />}
          </div>
        )
      )}
      <PortfolioSubmit
        selectedAccount={selectedAccount}
        showSheet={showSheet}
        setShowSheet={setShowSheet}
        setIsPublished={setIsPublished}
      />
    </div>
  );
}

export default Myportfolio;
