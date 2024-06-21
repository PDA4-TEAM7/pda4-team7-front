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
  }, []);

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(e.target.value);
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">계좌 선택</h1>
      <select value={selectedAccount} onChange={handleAccountChange} className="p-2 border rounded-md mb-4 w-64">
        {accounts.map((account) => (
          <option key={account.account_id} value={account.account_id}>
            {account.account_number}
          </option>
        ))}
      </select>
      <p className="text-gray-600">{`선택된 계좌 ID: ${selectedAccount}`}</p>
    </div>
  );
}

export default AccountSelector;
