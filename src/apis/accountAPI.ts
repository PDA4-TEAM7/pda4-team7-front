/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApi } from "./baseAPI";

export interface IAccountInfo {
  appkey: string;
  appsecretkey: string;
  accountNo: string;
}

export default class accountAPI extends BaseApi {
  //POST : 계좌 추가. 로그인 한 유저의 계좌 추가
  async addAccount(accountInfo: IAccountInfo) {
    try {
      const resp = await this.fetcher.post("/account", accountInfo);
      console.log(resp.data);
      if (resp.status >= 400) {
        throw Error;
      }
      return resp.data;
    } catch (e: any) {
      console.error("fail to add Account");
    }
  }
  //GET : user의 account조회
  async getAccountList() {
    const resp = await this.fetcher.get(`/accountlist`);
    if (resp.status) console.log(resp.data);
    return resp.data;
  }
  // GET : 특정 account조회
  async getAccount(accountId: string) {
    const resp = await this.fetcher.get(`/account/${accountId}`);
    console.log(resp.data);
    return resp.data;
  }

  // DELETE : 내 계좌 삭제
  async deleteMyAccount(accountId: string) {
    const resp = await this.fetcher.delete(`/account/${accountId}`);
    console.log(resp.data);
    return resp.data;
  }
}
