import accountAPI, { IAccountInfo } from "@/apis/accountAPI";

export default function useAccount() {
  const service = new accountAPI();
  // GET : 특정 account조회
  async function getAccount(accountId: string) {
    try {
      const res = await service.getAccount(accountId);
      console.log("account Info:", res);
      return res;
    } catch (err) {
      console.log("Error to signup", err);
    }
  }

  //GET : user의 account조회
  async function getAccountList() {
    const res = await service.getAccountList();
    return res.accountList;
  }
  //POST : account 추가
  async function addAccount(accountInfo: IAccountInfo) {
    const res = await service.addAccount(accountInfo);
    return res;
  }

  return { getAccount, addAccount, getAccountList };
}
