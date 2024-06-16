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
      const resp = await this.fetcher.post("auth/signup", {
        ...auth,
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
      const resp = await this.fetcher.post("validate/check-userid", {
        user_id: user_id,
      });
      return resp.data.available;
    } catch (error) {
      console.error(error);
    }
  }

  async validateUsername(username: string) {
    try {
      const resp = await this.fetcher.post("validate/check-username", {
        username: username,
      });
      return resp.data.available;
    } catch (error) {
      console.error(error);
    }
  }

  async signIn(auth: { user_id: string; password: string }): Promise<{ status: number; message: string }> {
    try {
      const response = await this.fetcher.post("auth/signin", {
        ...auth,
      });

      if (response.status === 200) {
        // 로그인 성공
        return {
          status: 200,
          message: "로그인 성공",
        };
      } else {
        // 로그인 실패 시의 처리
        return {
          status: response.status,
          message: response.data.message,
        };
      }
    } catch (error) {
      return { status: 500, message: "로그인 처리 중 오류 발생" };
    }
  }
}
