import { BaseApi } from "./baseAPI";

export interface IStockJoinRes {}

// {
//   "start_from_latest_stock": "false",
//   "portfolio": {
//       "stock_list": [
//           ["360750", "TIGER 나스닥100", 0.25],
//           ["133690", "TIGER 미국나스닥100", 0.25],
//           ["309230", "KINDEX 미국WideMoat가치주", 0.25],
//           ["381180", "TIGER 미국필라델피아반도체나스닥", 0.25]
//       ],
//       "balance": 1000000,
//       "interval_month": 1,
//       "start_date": "20100101",
//       "end_date": "20221231"
//   }
// }

export interface IBackTestReq {
  stock_list: string[][]; // [[pdno, stockName, num],..]
  balance: number;
  interval_month: number;
  start_date: string; // "20221231"
  end_date: string; // "20221231"
}

export default class StockApi extends BaseApi {
  // account_id
  async stockJoin(accountId: string) {
    const res = await this.fetcher.post("/stockjoin", { account_id: accountId });
    if (res.status >= 400) {
      throw Error;
    }
    return res.data;
  }

  //POST: 백테스팅
  async getBackTest(backTestReq: IBackTestReq) {
    const resp = await this.fetcher.post(`/backtest`, {
      start_from_latest_stock: "false",
      portfolio: backTestReq,
    });
    console.log(resp.data);
    return resp.data;
  }

  async getTradingHistory(accountId: string) {
    const resp = await this.fetcher.get(`/tradinghistory/${accountId}`);
    console.log("trd : ", resp.data);
    return resp.data;
  }
}
