/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApi } from "./baseAPI";

class SubscribeApi extends BaseApi {
  async subscribe(portfolio_id: number) {
    try {
      const response = await this.fetcher.post("/subscribe", { portfolio_id });
      if (response.status >= 400) {
        throw Error;
      }
      return response.data;
    } catch (e: any) {
      console.error("error:", e);
    }
  }

  async unsubscribe(portfolio_id: number) {
    try {
      const response = await this.fetcher.post("/unsubscribe", { portfolio_id });
      if (response.status >= 400) {
        throw Error;
      }
      return response.data;
    } catch (e: any) {
      console.error("error:", e);
    }
  }

  async getUserSubscriptions() {
    try {
      const response = await this.fetcher.get("/subscriptions");
      if (response.status >= 400) {
        throw Error;
      }
      return response.data;
    } catch (e: any) {
      console.error("error:", e);
    }
  }

  async getSubscriberCount(portfolio_id: number) {
    try {
      const response = await this.fetcher.get(`/subscriber/count/${portfolio_id}`);
      if (response.status >= 400) {
        throw Error;
      }
      return response.data;
    } catch (e: any) {
      console.error("error:", e);
    }
  }
}

export const subscribeApi = new SubscribeApi();
