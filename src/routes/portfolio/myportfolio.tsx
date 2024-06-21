import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Myportfolio() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [detailDescription, setDetailDescription] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSheet, setShowSheet] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 계정 목록 가져오기
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/accountlist");
        setAccounts(response.data.accountList);
        if (response.data.accountList.length > 0) {
          setSelectedAccount(response.data.accountList[0].account_id); // 첫 번째 계정을 기본 선택으로 설정
          setAccountMessage(`선택된 계좌 ID: ${response.data.accountList[0].account_id}`);
        }
      } catch (error) {
        console.error("Error fetching user accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(e.target.value);
    setAccountMessage(`선택된 계좌 ID: ${e.target.value}`);
  };

  const handleSubmit = async () => {
    const data = {
      account_id: selectedAccount,
      title,
      description,
      price,
      detailDescription,
    };

    try {
      const response = await axios.post("http://localhost:3000/api/portfolio/add", data);
      console.log("Portfolio saved successfully:", response.data);
      alert("포트폴리오가 등록되었습니다.");
      setShowSheet(false); // Sheet 닫기
      navigate("/portfolio/myportfolio");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        alert("이미 이 계정에 대한 포트폴리오가 존재합니다.");
      } else {
        console.error("Error saving portfolio:", error);
      }
    }
  };

  const handleClose = () => {
    setErrorMessage(""); // 에러 메시지 초기화
    setShowSheet(false); // Sheet 닫기
  };

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
      <div className="p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">계좌 선택</h1>
        <select value={selectedAccount} onChange={handleAccountChange} className="p-2 border rounded-md mb-4 w-64">
          {accounts.map((account) => (
            <option key={account.account_id} value={account.account_id}>
              {account.account_number}
            </option>
          ))}
        </select>
        <p className="text-gray-600">{accountMessage}</p>
      </div>
      <Sheet
        open={showSheet}
        onOpenChange={(open) => {
          if (!open) handleClose();
          else setShowSheet(true);
        }}
      >
        <SheetContent style={{ maxWidth: "45rem" }}>
          <SheetHeader>
            <SheetTitle style={{ fontSize: 30 }}>포트폴리오 게시하기</SheetTitle>
            <SheetDescription>포트폴리오에 대한 설명을 적어주세요</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                제목
              </Label>
              <Input
                id="title"
                className="col-span-3"
                placeholder="제목을 입력 해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                포트폴리오 소개
              </Label>
              <Input
                id="description"
                className="col-span-3"
                placeholder="포트폴리오에 대한 소개를 간단히 적어주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                포트폴리오 판매 가격
              </Label>
              <div className="col-span-3 flex justify-end">
                <Input
                  id="price"
                  className="max-w-xs text-right"
                  style={{ maxWidth: "10rem" }}
                  placeholder="원"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="detail_description" className="text-right">
                포트폴리오 상세 설명
              </Label>
              <textarea
                id="detail_description"
                className="col-span-3 p-2 border rounded-md"
                style={{
                  minHeight: "15rem",
                  textAlign: "start",
                  resize: "vertical",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                }}
                placeholder="포트폴리오의 구성 이유나 매매시점등의 이유를 적어주세요"
                value={detailDescription}
                onChange={(e) => setDetailDescription(e.target.value)}
              />
            </div>
            {errorMessage && <div className="col-span-4 text-red-500 text-center">{errorMessage}</div>}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="button"
                className="bg-blue-100 text-blue-600 hover:bg-blue-200"
                style={{ marginRight: "0.5rem" }}
              >
                Cancel
              </Button>
            </SheetClose>
            <Button type="button" className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleSubmit}>
              등록하기
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Myportfolio;
