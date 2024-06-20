import { BaseApi } from "./baseAPI";

export interface IAccountInfo {
  appkey: string;
  appsecretkey: string;
  accountNo: string;
}
export default class accountAPI extends BaseApi {
  //POST : 계좌 추가. 로그인 한 유저의 계좌 추가
  async addAccount(accountInfo: IAccountInfo) {
    const resp = await this.fetcher.post("/account", accountInfo);
    console.log(resp.data);
    return resp.data;
  }
  //GET : user의 account조회
  async getAccountList() {
    const resp = await this.fetcher.get(`/accountlist`);
    console.log(resp.data);
    return resp.data;
  }
  // GET : 특정 account조회
  async getAccount(accountId: string) {
    const resp = await this.fetcher.get(`/account/${accountId}`);
    console.log(resp.data);
    return resp.data;
  }
}
