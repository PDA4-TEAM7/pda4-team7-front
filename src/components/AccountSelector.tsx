// AccountSelector.tsx
import { useState, useEffect } from "react";
import accountAPI from "@/apis/accountAPI";

interface Account {
  account_id: string;
  account_number: string;
}

interface AccountSelectorProps {
  selectedAccount: string;
  setSelectedAccount: (accountId: string) => void;
}

export function AccountSelector({ selectedAccount, setSelectedAccount }: AccountSelectorProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const accountApi = new accountAPI();

  useEffect(() => {
    // 사용자 계정 목록 가져오기
    const fetchAccounts = async () => {
      try {
        const accountList = await accountApi.getAccountList();
        setAccounts(accountList.accountList);
        if (accountList.accountList.length > 0) {
          setSelectedAccount(accountList.accountList[0].account_id); // 첫 번째 계정을 기본 선택으로 설정
        }
      } catch (error) {
        console.error("Error fetching user accounts:", error);
      }
    };
    fetchAccounts();
  }, [selectedAccount]);

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(e.target.value);
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <h1 className="text-lg font-semibold text-nowrap pl-10 md:pl-0">계좌 선택</h1>
      <select value={selectedAccount} onChange={handleAccountChange} className="p-2 border rounded-md w-32">
        {accounts.map((account) => (
          <option key={account.account_id} value={account.account_id}>
            {account.account_number}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AccountSelector;
