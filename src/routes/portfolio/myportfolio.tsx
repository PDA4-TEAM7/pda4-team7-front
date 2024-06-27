import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AccountSelector from "@/components/AccountSelector";
import PortfolioSubmit from "@/components/PortfolioSubmit";
import { portfolioApi } from "@/apis/portfolioAPI";
import StockList from "./stockList";
import BackTest from "./detail/BackTest";
import CommPage from "./comm_page"; // CommPage import 추가
import accountAPI from "@/apis/accountAPI";
import AddAccountPopup from "@/components/AddAccountPopup";

export function Myportfolio() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
  const [showSheet, setShowSheet] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [tab, setTab] = useState<"StockList" | "BackTest" | "Community">("StockList");
  const [accounts, setAccounts] = useState<string[]>([]);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  const fetchAccounts = async () => {
    try {
      const response = await new accountAPI().getAccountList();
      const accountList = response.accountList.map((account: { account_number: string }) => account.account_number);
      setAccounts(accountList);
      if (accountList > 0) {
        setSelectedAccount(response.accountList[0].account_id);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };
  useEffect(() => {
    fetchAccounts();
  }, [showAddAccountModal]);

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
    <>
      <div className="my-portfolio-container flex flex-col h-screen min-h-screen">
        <nav
          className="flex md:flex-row justify-between p-2 md:h-14 h-24 md:items-center box-border flex-col fixed md:relative w-full md:w-auto bg-white"
          style={{ zIndex: 1000 }}
        >
          <AccountSelector selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
          <div className="flex flex-row md:justify-between justify-around gap-2">
            <div
              className={`text-zinc-900 hover:text-zinc-700 py-2 text-nowrap cursor-pointer ${
                tab === "StockList" && "active border-b-[3px] border-indigo-500/100"
              } `}
              onClick={() => {
                if (tab !== "StockList") setTab("StockList");
              }}
            >
              종목 리스트
            </div>
            <div
              className={`text-zinc-900 hover:text-zinc-700 py-2 text-nowrap cursor-pointer  ${
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
                className={`text-zinc-900 hover:text-zinc-700 py-2 text-nowrap box-border cursor-pointer ${
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
                  className="bg-red-600 text-white hover:bg-red-700 px-4"
                  onClick={handleCancelRegistration}
                >
                  등록 취소
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-2"
                  onClick={handleRegister}
                >
                  등록
                </Button>
              )}
            </div>
          </div>
        </nav>
        {!accounts.length ? (
          <div className="flex flex-col flex-1 justify-center items-center pt-8">
            <p>연결된 계좌가 없습니다. </p>
            <p> 계좌를 추가해볼까요?</p>
            <Button
              onClick={() => setShowAddAccountModal(true)}
              className="focus:outline-none mt-4 px-4 bg-indigo-500 p-3 ml-3 rounded-lg text-white hover:bg-indigo-400 w-[120px]"
            >
              계좌 추가하기
            </Button>
          </div>
        ) : (
          selectedAccount && (
            <div className="tab-container md:px-6 px-2 overflow-y-auto flex-1 md:pt-12 pt-24">
              {tab === "StockList" && <StockList id={selectedAccount} />}
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
      <AddAccountPopup
        modalShow={showAddAccountModal}
        modalClose={() => {
          setShowAddAccountModal(false);
        }}
      />
    </>
  );
}

export default Myportfolio;
