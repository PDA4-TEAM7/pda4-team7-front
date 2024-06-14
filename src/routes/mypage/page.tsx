import AccountPopup from "@/components/AccountPopup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function MyPage() {
  const name = "소연";
  const userId = "soyalattee";
  const introduce = "";
  const charge = 0;
  const [showModal, setShowModal] = useState(false);
  const handleAccountModal = () => {
    setShowModal(true);
  };
  return (
    <>
      <div className="my-page-container m-8 h-full">
        <p className="text-xl text-bold mb-8">{name}의 페이지</p>
        <div className="flex flex-col gap-2 border-2 rounded-md p-8 w-full py-10 max-w-[1043px]">
          <div className="submit-wrap b-4 flex flex-col gap-2 space-y-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="id" className="text-lg">
                ID
              </Label>
              <p>{userId}</p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name" className="text-lg">
                Name
              </Label>
              <Input type="string" id="name" placeholder="name" defaultValue={name} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password" className="text-lg">
                Password
              </Label>
              <div className="flex flex-row gap-1">
                <Input type="password" id="password" />
                <Button>변경하기</Button>
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="introduce" className="text-lg">
                Introduce
              </Label>
              <Textarea
                id="introduce"
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
                defaultValue={introduce}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="charge" className="text-lg">
                Charge
              </Label>
              <p className="w-1/3">{charge} 원</p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="account" className="text-lg">
                Account
              </Label>
              <Button variant="outline" onClick={handleAccountModal}>
                계좌 조회하기
              </Button>
            </div>
          </div>
          <Button className="mr-auto mt-12  w-full max-w-sm">저장하기</Button>
        </div>
      </div>
      <AccountPopup
        modalShow={showModal}
        modalClose={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}
