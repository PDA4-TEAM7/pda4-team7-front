import { BaseApi } from "./baseAPI";

export interface IAuth {
  user_id: string;
  username: string;
  password: string;
  confirm_password: string;
}

export default class authAPI extends BaseApi {
  async signUp(auth: IAuth): Promise<{ status: number; message: string }> {
    try {
      const resp = await this.fetcher.post("api/auth/signup", {
        auth: auth,
      });
      console.log(resp.data);
      console.log(resp.data.message);

      return resp.data;
    } catch (error) {
      console.error(error);
      return { status: 500, message: "회원가입 실패!!!" };
    }
  }
  async validateUserId(user_id: string) {
    try {
      const resp = await this.fetcher.post("api/validate/check-userid", {
        user_id: user_id,
      });
      return resp.data.available;
    } catch (error) {
      console.error(error);
    }
  }

  async validateUsername(username: string) {
    try {
      const resp = await this.fetcher.post("api/validate/check-username", {
        username: username,
      });
      return resp.data.available;
    } catch (error) {
      console.error(error);
    }
  }
}
