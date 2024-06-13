import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MyPage() {
  const name = "소연";
  const userId = "soyalattee";
  const introduce = "";
  const charge = 0;

  return (
    <div className="my-page-container m-8 h-full">
      <p className="text-xl text-bold mb-8">{name}의 페이지</p>
      <div className="flex flex-col gap-2 border-2 rounded-md p-4 w-full py-10 max-w-[1043px] h-full">
        <div className="submit-wrap b-4 flex flex-col gap-2">
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
            <Label htmlFor="id">ID</Label>
            <p>{userId}</p>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input type="string" id="name" placeholder="name" defaultValue={name} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" />
            <Button>변경하기</Button>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="introduce">Introduce</Label>
            <Input type="string" id="introduce" placeholder="introduce" defaultValue={introduce} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="charge">Charge</Label>
            <p className="w-1/3">{charge} 원</p>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="account">Account</Label>
            <Button variant="outline">계좌 조회하기</Button>
          </div>
        </div>
        <Button>저장하기</Button>
      </div>
    </div>
  );
}
