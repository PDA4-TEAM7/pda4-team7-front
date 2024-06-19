import { BaseApi } from "./baseAPI";

interface Comment {
  description: string;
  portfolioId: number;
}

interface UpdateComment {
  description: string;
}

class CommentApi extends BaseApi {
  constructor() {
    super();
  }

  writeComment(data: Comment) {
    return this.fetcher.post("/comment/write", data);
  }

  readComments(portfolio_id: number) {
    return this.fetcher.get(`/comment/read/${portfolio_id}`);
  }

  deleteComment(comment_id: number) {
    return this.fetcher.delete(`/comment/delete/${comment_id}`);
  }

  updateComment(comment_id: number, data: UpdateComment) {
    return this.fetcher.patch(`/comment/update/${comment_id}`, data);
  }
}

export const commentApi = new CommentApi();
