import { BaseApi } from "./baseAPI";

export default class userAPI extends BaseApi {
  //post credit충전
  async charge(addCredit: number) {
    const resp = await this.fetcher.post("/user/charge", {
      addCredit,
    });
    console.log(resp.data);
    return resp.data;
  }
  //post 유저 정보 수정
  async setUserInfo() {
    const resp = await this.fetcher.post(`/user`, {});
    console.log(resp.data);
    return resp.data;
  }
  //post 비밀번호변경
  async setPassword(password: string) {
    const resp = await this.fetcher.post(`/user/password`, {
      password,
    });
    console.log(resp.data);
    return resp.data;
  }
}
