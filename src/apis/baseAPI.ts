import axios from "axios";
const { VITE_BASE_URL } = import.meta.env;

//우리 서버랑 통신할 Api 세팅
export class BaseApi {
  fetcher;
  constructor() {
    axios.defaults.withCredentials = true;
    this.fetcher = axios.create({
      baseURL: VITE_BASE_URL,
      headers: {
        "Content-type": "application/json",
      },
      validateStatus: function (status) {
        return status >= 200 && status < 500;
        // 모든 응답을 성공으로 처리
      },
    });
  }
}
