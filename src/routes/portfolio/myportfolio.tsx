// Myportfolio.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AccountSelector from "@/components/AccountSelector";
import PortfolioSubmit from "@/components/PortfolioSubmit";

export function Myportfolio() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [showSheet, setShowSheet] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-end p-4">
        <Button
          variant="outline"
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setShowSheet(true)}
        >
          등록
        </Button>
      </div>
      <AccountSelector selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
      <PortfolioSubmit selectedAccount={selectedAccount} showSheet={showSheet} setShowSheet={setShowSheet} />
    </div>
  );
}

export default Myportfolio;
