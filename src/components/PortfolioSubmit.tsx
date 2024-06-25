import { useState, FormEvent, useEffect } from "react";
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
import axios from "axios";
import { portfolioApi, Portfolio } from "@/apis/portfolioAPI";

interface PortfolioSubmitProps {
  selectedAccount: string;
  showSheet: boolean;
  setShowSheet: (show: boolean) => void;
  setIsPublished: (published: boolean) => void; // 상태 업데이트를 위한 함수 추가
}

export function PortfolioSubmit({ selectedAccount, showSheet, setShowSheet, setIsPublished }: PortfolioSubmitProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [detailDescription, setDetailDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(true);

  const isBlankValue = (val: string) => {
    return val.trim() === "";
  };

  const isFormValid = () => {
    //data가 안에 있어서 그냥 하나하나 정의 해줌
    return ![title, description, price, detailDescription].some(isBlankValue);
  };

  useEffect(() => {
    setDisableSubmit(!isFormValid());
    //뭔지 모르겠는데 노란 줄 떠서 그냥 fix눌러서 처리함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, price, detailDescription]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data: Portfolio = {
      account_id: selectedAccount,
      title,
      description,
      price,
      detailDescription,
      published: true, // 등록 시 published를 true로 설정
    };

    try {
      const response = await portfolioApi.addPortfolio(data);
      console.log("Portfolio saved successfully:", response);
      alert("포트폴리오가 등록되었습니다.");
      setShowSheet(false); // Sheet 닫기
      setIsPublished(true); // 상태 변경
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
        <form onSubmit={handleSubmit}>
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
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={disableSubmit}>
              등록하기
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default PortfolioSubmit;
