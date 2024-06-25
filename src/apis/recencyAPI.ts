import { BaseApi } from "./baseAPI";

export default class RecencyAPI extends BaseApi {
  async getMyRecencyTradingHistory() {
    const resp = await this.fetcher.get("/recency/getMyRecencyTradingHistory");
    return resp.data;
  }
}
