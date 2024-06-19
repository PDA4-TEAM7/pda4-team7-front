import { BaseApi } from "./baseAPI";

export default class accountAPI extends BaseApi {
  // 계좌 추가. 로그인 한 유저의 계좌 추가
  async addAccount(appkey: string, appsecretkey: string, account: string) {
    const resp = await this.fetcher.post("/account", {
      appkey,
      appsecretkey,
      account,
    });
    console.log(resp.data);
    return resp.data;
  }
  //유저가 보유한 계좌 조회. 로그인 한 유저의 계좌
  async getAccountList() {
    const resp = await this.fetcher.get(`/accountList`);
    console.log(resp.data);
    return resp.data;
  }
  //특정 계좌 조회
  async getAccount(accountId: string) {
    const resp = await this.fetcher.get(`/account/${accountId}`);
    console.log(resp.data);
    return resp.data;
  }
}
