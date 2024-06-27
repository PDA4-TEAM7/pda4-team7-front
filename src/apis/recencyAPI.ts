import { BaseApi } from "./baseAPI";

export default class RecencyAPI extends BaseApi {
  async getMyRecencyTradingHistory() {
    const resp = await this.fetcher.get("/recency/getMyRecencyTradingHistory");
    if (resp.status >= 400) {
      throw Error;
    }
    return resp.data;
  }
  async getStockInfoByAccountId(accountId: number, name: string) {
    const resp = await this.fetcher.get(`/recency/getStockInfo/${accountId}/${name}`);
    if (resp.status >= 400) {
      throw Error;
    }
    return resp.data;
  }
  async getInvestIdstTop5() {
    const resp = await this.fetcher.get(`/recency/getInvestIdstTop5`);
    if (resp.status >= 400) {
      throw Error;
    }
    return resp.data;
  }

  async getStockListByIdst(name: string) {
    const resp = await this.fetcher.get(`/recency/getStockList/${name}"`);
    if (resp.status >= 400) {
      throw Error;
    }
    return resp.data;
  }

  async getInvestStockTop5() {
    const resp = await this.fetcher.get(`/recency/getInvestStockTop5`);
    if (resp.status >= 400) {
      throw Error;
    }
    return resp.data;
  }

  async getStockDetailListByStock(name: string) {
    const resp = await this.fetcher.get(`/recency/getStockDetailList/${name}"`);
    if (resp.status >= 400) {
      throw Error;
    }
    return resp.data;
  }
}
