// Myportfolio.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AccountSelector from "@/components/AccountSelector";
import PortfolioSubmit from "@/components/PortfolioSubmit";
import { portfolioApi } from "@/apis/portfolioAPI";

export function Myportfolio() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [showSheet, setShowSheet] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

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
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-end p-4">
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
      <AccountSelector selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
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
