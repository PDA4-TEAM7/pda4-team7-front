import { BaseApi } from "./baseAPI";

class SubscribeApi extends BaseApi {
  async subscribe(portfolio_id: number) {
    const response = await this.fetcher.post("/subscribe", { portfolio_id });
    return response.data;
  }

  async unsubscribe(portfolio_id: number) {
    const response = await this.fetcher.post("/unsubscribe", { portfolio_id });
    return response.data;
  }

  async getUserSubscriptions() {
    const response = await this.fetcher.get("/subscriptions");
    return response.data;
  }

  async getSubscriberCount(portfolio_id: number) {
    const response = await this.fetcher.get(`/subscriber/count/${portfolio_id}`);
    return response.data;
  }
}

export const subscribeApi = new SubscribeApi();
