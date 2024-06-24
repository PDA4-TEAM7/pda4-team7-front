import userAPI, { ISetUserData, IUserInfo } from "@/apis/userAPI";

export default function useUser() {
  const service = new userAPI();
  // 회원정보 가져오기
  async function getUserInfo(): Promise<IUserInfo> {
    try {
      const res = await service.getUserInfo();
      console.log("user Info:", res);
      return {
        userId: res.user_id,
        userName: res.username,
        credit: res.credit,
        introduce: res.introduce,
      };
    } catch (err) {
      console.log("Error to signup", err);
      return {
        userId: "",
        introduce: "",
        credit: -1,
        userName: "",
      };
    }
  }
  // 충전하기
  async function charge(addCredit: number) {
    const res = await service.charge(addCredit);
    return res;
  }
  // 비밀번호 변경
  async function setPassword(password: string) {
    const res = await service.setPassword(password);
    return res;
  }
  // 회원정보업데이트
  async function submitUserInfo(userData: ISetUserData) {
    const res = await service.setUserInfo(userData);
    return res;
  }

  return { getUserInfo, charge, setPassword, submitUserInfo };
}
