import axios from 'axios';
const { VITE_SHIN_HAN_URL } = import.meta.env;

export interface IStockData {
  incpPrc: number;
  incpYmd: Date;
  reveRt: number;
  stbdName: string;
  stockCode: string;
}

interface IShinhanRecommendPortfolioRes {
  dataHeader: {
    category: string;
    resultCode: number;
    resultMessage: string;
    successCode: number;
  };
  dataBody: {
    list: IStockData[];
  };
}

//신한API
export class ShinhanApi {
  fetcher;
  constructor() {
    axios.defaults.withCredentials = true;
    this.fetcher = axios.create({
      baseURL: VITE_SHIN_HAN_URL,
      headers: {
        'Content-type': 'application/json',
        apiKey: 'apiKey-value',
      },
    });
  }
  //GET: 신한 추천포트폴리오
  async getRecommendPortfolio(): Promise<IStockData[]> {
    try {
      const resp: IShinhanRecommendPortfolioRes = await this.fetcher.get('recommend/portfolio').then((res) => res.data);
      return resp.dataBody.list;
    } catch (e) {
      console.log('error getRecommendPortfolio :', e);
      return [];
    }
  }
}
