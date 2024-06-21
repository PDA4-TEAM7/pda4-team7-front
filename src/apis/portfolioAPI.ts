// apis/portfolioApi.ts
import { BaseApi } from "./baseAPI";

export interface IPortfolio {
  account_id: string;
  title: string;
  description: string;
  price: string;
  detailDescription: string;
}

class PortfolioApi extends BaseApi {
  // POST: 포트폴리오 추가
  async addPortfolio(portfolio: IPortfolio) {
    const resp = await this.fetcher.post("/portfolio/add", portfolio);
    return resp.data;
  }
}

export const portfolioApi = new PortfolioApi();
