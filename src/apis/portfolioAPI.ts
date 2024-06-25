// apis/portfolioAPI.ts
import { BaseApi } from "./baseAPI";

export interface Portfolio {
  account_id: string;
  title: string;
  description: string;
  price: string;
  detailDescription: string;
  published?: boolean; // published 속성 추가
}

class PortfolioApi extends BaseApi {
  // POST: 포트폴리오 추가
  async addPortfolio(portfolio: Portfolio) {
    const resp = await this.fetcher.post("/portfolio/add", portfolio);
    return resp.data;
  }

  // PATCH: 포트폴리오 업데이트
  async updatePortfolio(account_id: string, data: Partial<Portfolio>) {
    const resp = await this.fetcher.patch(`/portfolio/${account_id}`, data);
    return resp.data;
  }

  // GET: 계좌 ID로 포트폴리오 가져오기
  async getPortfolioByAccountId(account_id: string) {
    const resp = await this.fetcher.get(`/portfolio/account/${account_id}`);
    return resp.data;
  }

  // GET: 모든 포트폴리오 가져오기
  async getAllPortfolios() {
    const resp = await this.fetcher.get("/portfolios");
    return resp.data;
  }

  // 커뮤니티 페이지를 위한 정보들.
  async getPortfolioComm(account_id: string) {
    const resp = await this.fetcher.get(`/portfolio/comm/${account_id}`);
    return resp.data;
  }

  //get : portfolioId도 포트폴리오 가져오기
  async getPortfolioByPortfolioId(portfolio_id: string) {
    const resp = await this.fetcher.get(`/portfolio/pid/${portfolio_id}`);
    return resp.data;
  }
}

export const portfolioApi = new PortfolioApi();
