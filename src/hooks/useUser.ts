import userAPI, { ISetUserData, IUserInfo } from "@/apis/userAPI";

export default function useUser() {
  const service = new userAPI();
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

  async function charge(addCredit: number) {
    const res = await service.charge(addCredit);
    return res;
  }
  async function setPassword(password: string) {
    const res = await service.setPassword(password);
    return res;
  }
  async function submitUserInfo(userData: ISetUserData) {
    const res = await service.setUserInfo(userData);
    return res;
  }

  return { getUserInfo, charge, setPassword, submitUserInfo };
}
