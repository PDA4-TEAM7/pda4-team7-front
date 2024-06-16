import axios from "axios";
const { VITE_BASE_URL } = import.meta.env;

//우리 서버랑 통신할 Api 세팅
export class BaseApi {
  fetcher;
  constructor() {
    //미리생성
    axios.defaults.withCredentials = true;
    this.fetcher = axios.create({
      baseURL: VITE_BASE_URL,
      headers: {
        "Content-type": "application/json",
      },
    });
  }
}
