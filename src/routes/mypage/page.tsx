import { IUserInfo } from "@/apis/userAPI";
import AccountPopup from "@/components/AccountPopup";
import AddAccountPopup from "@/components/AddAccountPopup";
import ChargePopup from "@/components/ChargePopup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import useUser from "@/hooks/useUser";
import { formatNumber } from "@/lib/nums";
import { useEffect, useRef, useState } from "react";
import loadingBtnAnim from "@/assets/lottie-btn-loading.json";
import Lottie from "lottie-react";
import loadingAnim from "@/assets/lottie-loading.json";
export default function MyPage() {
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    userId: "",
    userName: "",
    introduce: "",
    credit: 0,
  });
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pwRef = useRef<HTMLInputElement>(null);
  const { open, close } = useModal();
  const handleAccountModal = () => {
    setShowModal(true);
  };
  const { getUserInfo, setPassword, submitUserInfo } = useUser();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "userName" || name === "introduce") {
      setDisableSubmit(false);
      setUserInfo((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    if (disableSubmit) return;
    const res = await submitUserInfo({
      userName: userInfo.userName,
      introduce: userInfo.introduce,
      credit: userInfo.credit,
    });
    if (res) {
      open("알림", "회원정보가 변경되었습니다.", close);
    } else {
      open("알림", "회원정보가 변경에 실패했습니다.", close);
    }

    //수정완료되면 모달
    setIsLoading(false);
  };
  useEffect(() => {
    async function init() {
      const res = await getUserInfo();
      if (res) setUserInfo({ ...res });
    }
    init();
  }, []);

  if (!userInfo) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-[64px]"></div>
        <Lottie animationData={loadingAnim} />
      </div>
    );
  }
  return (
    <>
      <div className="my-page-container md:my-4 md:mx-4 m-4 h-full">
        <p className="text-xl mb-8 pl-10 md:pl-0">{user.userName}의 페이지</p>
        <div className="flex flex-col gap-2 border-2 rounded-md p-8 w-full py-10 max-w-[1043px]">
          <div className="submit-wrap b-4 flex flex-col gap-2 space-y-2 justify-center items-center">
            <div className="profile-photo w-16 h-16">
              <img
                src={`https://source.boringavatars.com/beam/500/${user.userName}`}
                alt="프로필 이미지"
                className="w-full h-full"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="id" className="text-lg">
                ID
              </Label>
              <p>{userInfo.userId}</p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name" className="text-lg">
                Name
              </Label>
              <Input
                type="string"
                id="userName"
                name="userName"
                placeholder="name"
                defaultValue={userInfo.userName}
                onChange={handleChange}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password" className="text-lg">
                Password
              </Label>
              <div className="flex flex-row gap-1">
                <Input type="password" id="password" placeholder="enter password" ref={pwRef} />
                <Button
                  onClick={async () => {
                    setIsLoading(true);
                    if (pwRef.current && pwRef.current.value && !isLoading) {
                      try {
                        const res = await setPassword(pwRef.current.value);
                        if (res) {
                          open("알림", "비밀번호가 변경되었습니다.", close);
                        } else {
                          open("알림", "비밀번호 변경에 실패했습니다!", close);
                        }
                      } finally {
                        pwRef.current.value = "";
                      }
                    }
                    setIsLoading(false);
                  }}
                >
                  {isLoading ? (
                    <div className="w-[42px]">
                      <Lottie animationData={loadingBtnAnim} />
                    </div>
                  ) : (
                    <p>변경하기</p>
                  )}
                </Button>
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="introduce" className="text-lg">
                Introduce
              </Label>
              <Textarea
                id="introduce"
                name="introduce"
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
                defaultValue={userInfo.introduce}
                onChange={handleChange}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="charge" className="text-lg">
                Charge
              </Label>
              <div className="flex flex-row gap-1 justify-between">
                <p className="w-2/3">{formatNumber(userInfo.credit)} 원</p>
                <Button
                  onClick={() => {
                    setShowChargeModal(true);
                  }}
                >
                  충전하기
                </Button>
              </div>
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
          <Button
            className="m-auto mt-12  w-full max-w-sm disabled:opacity-75"
            disabled={disableSubmit}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <div className="w-[42px]">
                <Lottie animationData={loadingBtnAnim} />
              </div>
            ) : (
              <p>저장하기</p>
            )}
          </Button>
        </div>
      </div>
      <AccountPopup
        modalShow={showModal}
        modalClose={() => {
          setShowModal(false);
        }}
        openAddAccountModal={() => {
          setShowModal(false);
          setShowAddAccountModal(true);
        }}
      />
      <AddAccountPopup
        modalShow={showAddAccountModal}
        modalClose={() => {
          setShowAddAccountModal(false);
        }}
      />
      <ChargePopup
        modalShow={showChargeModal}
        setCredit={(addCredit: number): void => {
          setUserInfo((prev) => {
            return { ...prev, credit: prev.credit + addCredit };
          });
        }}
        modalClose={() => {
          setShowChargeModal(false);
        }}
      />
    </>
  );
}
