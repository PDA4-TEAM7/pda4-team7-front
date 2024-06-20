import { BaseApi } from "./baseAPI";

interface Reply {
  description: string;
  comment_id: number;
}

interface UpdateReply {
  description: string;
}

class ReplyApi extends BaseApi {
  constructor() {
    super();
  }

  writeReply(data: Reply) {
    return this.fetcher.post("/reply/write", data);
  }

  readReplies(comment_id: number) {
    return this.fetcher.get(`/reply/read/${comment_id}`);
  }

  deleteReply(reply_id: number) {
    return this.fetcher.delete(`/reply/delete/${reply_id}`);
  }

  updateReply(reply_id: number, data: UpdateReply) {
    return this.fetcher.patch(`/reply/update/${reply_id}`, data);
  }
}

export const replyApi = new ReplyApi();
