import { BaseApi } from "./baseAPI";

export default class RecencyAPI extends BaseApi {
  async getMyRecencyTradingHistory() {
    const resp = await this.fetcher.get("/recency/getMyRecencyTradingHistory");
    return resp.data;
  }
  async getStockInfoByAccountId(accountId: number, name: string) {
    const resp = await this.fetcher.get(`/recency/getStockInfo/${accountId}/${name}`);
    return resp.data;
  }
  async getInvestIdstTop5() {
    const resp = await this.fetcher.get(`/recency/getInvestIdstTop5`);
    return resp.data;
  }

  async getStockListByIdst(name: string) {
    const resp = await this.fetcher.get(`/recency/getStockList/${name}"`);
    return resp.data;
  }
}
