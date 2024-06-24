import { BaseApi } from "./baseAPI";

export interface IUserInfo {
  userId: string;
  userName: string;
  introduce: string;
  credit: number;
}

export interface ISetUserData {
  userName: string;
  introduce: string;
  credit: number;
}
export default class userAPI extends BaseApi {
  async getUserInfo() {
    const resp = await this.fetcher.get("/user/me");
    return resp.data;
  }
  //post credit충전
  async charge(addCredit: number) {
    const resp = await this.fetcher.post("/user/charge", {
      addCredit,
    });
    console.log(resp.data);
    return resp.data;
  }
  //post 유저 정보 수정
  async setUserInfo(userData: ISetUserData) {
    const resp = await this.fetcher.post(`/user`, { username: userData.userName, introduce: userData.introduce });
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
