import { BaseApi } from "./baseAPI";

export interface IStockJoinRes {}
export default class StockApi extends BaseApi {
  // account_id
  async stockJoin(accountId: string) {
    const res = await this.fetcher.post("/stockjoin", { account_id: accountId });
    return res.data;
  }
}
