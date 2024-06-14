import { BaseApi } from "./baseAPI";

export interface IAuth {
  user_id: string;
  username: string;
  password: string;
}

export default class authAPI extends BaseApi {
  //   async signUp(auth: IAuth) {
  //     const resp = await this.fetcher.post("/signup", {
  //       userid
  //     })
  //   }
  async validateUserId(user_id: string) {
    try {
      const resp = await this.fetcher.post("api/validate/check-userid", {
        user_id: user_id,
      });
      return resp.data;
    } catch (error) {
      console.error(error);
    }
  }

  async validateUsername(username: string) {
    try {
      const resp = await this.fetcher.post("api/validate/check-username", {
        username: username,
      });
      return resp.data;
    } catch (error) {
      console.error(error);
    }
  }
}
