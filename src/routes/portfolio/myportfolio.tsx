import React, { useState, useEffect } from "react";
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
  SheetTrigger,
} from "@/components/ui/sheet";

export function Myportfolio() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
          등록
        </Button>
      </SheetTrigger>
      <SheetContent style={{ maxWidth: "45rem" }}>
        <SheetHeader>
          <SheetTitle style={{ fontSize: 30 }}>포트폴리오 공유하기</SheetTitle>
          <SheetDescription>포트폴리오에 대한 설명을 적어주세요</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              제목
            </Label>
            <Input id="title" className="col-span-3" placeholder="제목을 입력 해주세요." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              포트폴리오 소개
            </Label>
            <Input id="description" className="col-span-3" placeholder="포트폴리오에 대한 소개를 간단히 적어주세요" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              포트폴리오 판매 가격
            </Label>
            <div className="col-span-3 flex justify-end">
              <Input id="price" className="max-w-xs text-right" style={{ maxWidth: "10rem" }} placeholder="원" />
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
            />
          </div>
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
          <SheetClose asChild>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              등록하기
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default Myportfolio;
