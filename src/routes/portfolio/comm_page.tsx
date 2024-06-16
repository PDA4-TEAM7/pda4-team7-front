import React, { useState, useEffect } from "react";
import { commentApi } from "@/apis/commentAPI";
import { replyApi } from "@/apis/replyAPI";

type Comment = {
  comment_id: number;
  author: string;
  user_id: number;
  description: string;
  create_dt: string;
  replies: {
    author: string;
    user_id: number;
    role: string;
    date: string;
    text: string;
  }[];
  replyText?: string;
};

const CommPage = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [portfolioId, setPortfolioId] = useState(2); // 실제 포트폴리오 ID로 대체하세요.
  const [userId, setUserId] = useState(2); // 실제 사용자 ID로 대체하세요.
  const [ownerInfo, setOwnerInfo] = useState({
    name: "박소연",
    updateDate: "3일 전",
    profileImage: "/img/soya_profile.png",
  });

  useEffect(() => {
    // 초기 로드 시 포트폴리오의 댓글을 가져옵니다.
    const fetchComments = async () => {
      try {
        const response = await commentApi.readComments(portfolioId);
        console.log("Comments API response:", response.data); // Debugging line

        const commentsData = await Promise.all(
          response.data.comments.map(async (comment: any) => {
            console.log("Fetching replies for comment_id:", comment.comment_id); // Debugging line
            const repliesResponse = await replyApi.readReplies(comment.comment_id);
            console.log("Replies API response for comment_id:", comment.comment_id, repliesResponse.data); // Debugging line
            return {
              ...comment,
              replies: repliesResponse.data.replies.map((reply: any) => ({
                author: reply.username,
                user_id: reply.user_id,
                role: "작성자",
                date: new Date(reply.create_dt).toISOString().split("T")[0],
                text: reply.description,
              })),
              replyText: "",
            };
          })
        );
        setComments(commentsData);
      } catch (error) {
        console.error("댓글을 가져오는 중 오류 발생:", error);
      }
    };

    fetchComments();
  }, [portfolioId]);

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      try {
        const newCommentData = {
          description: comment,
          userId: userId,
          portfolioId: portfolioId,
        };
        const response = await commentApi.writeComment(newCommentData);
        const newCommentResponse = response.data.newComment;

        if (!newCommentResponse || !newCommentResponse.user) {
          throw new Error("댓글 작성 응답에서 사용자 정보가 없습니다.");
        }

        const newComment: Comment = {
          comment_id: newCommentResponse.comment_id,
          author: newCommentResponse.user.username,
          user_id: newCommentResponse.user.uid,
          description: newCommentResponse.description,
          create_dt: new Date(newCommentResponse.create_dt).toISOString().split("T")[0],
          replies: [],
          replyText: "",
        };

        setComments([...comments, newComment]);
        setComment("");
      } catch (error) {
        console.error("댓글 작성 중 오류 발생:", error);
      }
    }
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>, commentId: number) => {
    const newComments = comments.map((comment) => {
      if (comment.comment_id === commentId) {
        return {
          ...comment,
          replyText: e.target.value,
        };
      }
      return comment;
    });
    setComments(newComments);
  };

  const handleReplySubmit = async (commentId: number) => {
    const comment = comments.find((comment) => comment.comment_id === commentId);
    if (comment && comment.replyText?.trim()) {
      try {
        const newReplyData = {
          description: comment.replyText,
          comment_id: commentId,
          userId: userId, // 실제 사용자 ID로 대체하세요.
        };

        // 백엔드 API 호출
        const response = await replyApi.writeReply(newReplyData);

        // API 응답에서 userId와 포트폴리오 ownerId를 비교
        if (response.data.newReply.user_id !== userId) {
          alert("작성자만 답글을 쓸 수 있습니다.");
          return;
        }

        const newReply = {
          author: response.data.newReply.username,
          user_id: response.data.newReply.user_id,
          role: "작성자",
          date: new Date(response.data.newReply.create_dt).toISOString().split("T")[0],
          text: response.data.newReply.description,
        };
        const newComments = comments.map((comment) => {
          if (comment.comment_id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply],
              replyText: "",
            };
          }
          return comment;
        });
        setComments(newComments);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert("작성자만 답글을 쓸 수 있습니다.");
        } else {
          console.error("답글 작성 중 오류 발생:", error);
        }
      }
    }
  };

  const activeCommentEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommentSubmit();
    }
  };

  const activeReplyEnter = (e: React.KeyboardEvent<HTMLInputElement>, commentId: number) => {
    if (e.key === "Enter") {
      handleReplySubmit(commentId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-6">PORTFOLIO TITLE</h1>
          <div className="mb-4 flex items-stretch gap-1">
            <input
              type="text"
              placeholder="의견을 남겨주세요 :)"
              value={comment}
              onChange={handleCommentChange}
              onKeyDown={activeCommentEnter}
              className="w-full p-2 border border-gray-300 rounded outline-none"
            />
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded whitespace-nowrap"
            >
              댓글 작성
            </button>
          </div>
          {comments.map((comment) => (
            <div key={comment.comment_id} className="mb-6 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="font-semibold">{comment.author}</div>
                <div className="ml-4 text-gray-500">{new Date(comment.create_dt).toISOString().split("T")[0]}</div>
              </div>
              <p className="mb-2">{comment.description}</p>
              {comment.replies.map((reply, index) => (
                <div key={index} className="ml-8 mt-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="font-semibold">{reply.author}</div>
                    {reply.role && <div className="ml-4 text-red-500 font-semibold">{reply.role}</div>}
                    <div className="ml-4 text-gray-500">{reply.date}</div>
                  </div>
                  <p className="mb-2">{reply.text}</p>
                </div>
              ))}
              {ownerInfo.name === "박소연" && (
                <div className="ml-8 mt-4 flex flex-row gap-1">
                  <input
                    type="text"
                    placeholder="답글을 입력하세요 :)"
                    value={comment.replyText || ""}
                    onChange={(e) => handleReplyChange(e, comment.comment_id)}
                    onKeyDown={(e) => activeReplyEnter(e, comment.comment_id)}
                    className="w-full p-2 border border-gray-300 rounded outline-none"
                  />
                  <button
                    onClick={() => handleReplySubmit(comment.comment_id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded whitespace-nowrap"
                  >
                    답글 작성
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div>
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <div className="text-lg font-semibold mb-4">포트폴리오 오너 소개</div>
            <div className="mb-4">
              <img className="mx-auto w-16 h-16 rounded-full" src={`${ownerInfo.profileImage}`} alt="profile" />
            </div>
            <div className="font-bold mb-2">{ownerInfo.name}</div>
            <div className="text-sm text-gray-500 mb-4">마지막 업데이트: {ownerInfo.updateDate}</div>
            <button
              onClick={handleSubscribe}
              className={`px-4 py-2 text-white rounded ${isSubscribed ? "bg-red-500" : "bg-blue-500"}`}
            >
              {isSubscribed ? "구독 취소" : "구독하기"}
            </button>
            <div className="mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded">다른 포트폴리오 보기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommPage;