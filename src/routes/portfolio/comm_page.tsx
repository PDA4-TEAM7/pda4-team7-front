/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { IComment, commentApi } from "@/apis/commentAPI";
import { replyApi } from "@/apis/replyAPI";
import axios from "axios";

type Reply = {
  author: string;
  user_id: number;
  role: string;
  date: string;
  text: string;
  create_dt: Date;
  description: string;
};
type Comment = {
  comment_id: number;
  author: string;
  user_id: number;
  description: string;
  create_dt: string;
  replies: Reply[];
  replyText?: string;
};

type OwnerInfo = {
  name: string;
  updateDate: string;
  profileImage: string;
  uid: number;
};
type Props = {
  id: string;
};
const CommPage = ({ id }: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [portfolioId] = useState(id); // 실제 포트폴리오 ID로 대체하세요.
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>({
    name: "",
    updateDate: "",
    uid: 0,
    profileImage: "",
  });

  useEffect(() => {
    // 포트폴리오의 오너 정보를 가져옵니다.
    const fetchOwnerInfo = async () => {
      try {
        const response = await axios.get<OwnerInfo>(`http://localhost:3000/api/portfolio/user/${portfolioId}`);
        setOwnerInfo(response.data);
        console.log("가져왔다.", response.data);
      } catch (error) {
        console.error("오너 정보를 가져오는 중 오류 발생:", error);
      }
    };

    fetchOwnerInfo();
  }, [portfolioId]);

  useEffect(() => {
    // 초기 로드 시 포트폴리오의 댓글을 가져옵니다.
    const fetchComments = async () => {
      try {
        const response = await commentApi.readComments(+portfolioId);
        console.log("Comments API response:", response.data); // Debugging line

        const commentsData = await Promise.all(
          response.data.comments.map(async (comment: Comment) => {
            console.log("Fetching replies for comment_id:", comment.comment_id); // Debugging line
            const repliesResponse = await replyApi.readReplies(comment.comment_id);
            console.log("Replies API response for comment_id:", comment.comment_id, repliesResponse.data); // Debugging line
            return {
              ...comment,
              replies: repliesResponse.data.replies.map((reply: Reply) => ({
                author: reply.author,
                user_id: reply.user_id,
                role: reply.user_id === ownerInfo.uid ? "작성자" : "",
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

    if (ownerInfo.uid !== 0) {
      fetchComments();
    }
  }, [portfolioId, ownerInfo.uid]);

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      try {
        const newCommentData: IComment = {
          // DUMMY: 더미로 넣어놨어용
          userId: 1,
          description: comment,
          portfolioId: +portfolioId,
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
          // DUMMY: 더미로 넣어놨어용
          userId: 1,
          comment_id: commentId,
        };

        // 백엔드 API 호출
        const response = await replyApi.writeReply(newReplyData);

        const newReply = {
          author: response.data.newReply.username,
          user_id: response.data.newReply.user_id,
          role: response.data.newReply.user_id === ownerInfo.uid ? "작성자" : "",
          date: new Date(response.data.newReply.create_dt).toISOString().split("T")[0],
          text: response.data.newReply.description,
        };
        const newComments = comments.map((comment) => {
          if (comment.comment_id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply],
              replyText: "",
            } as Comment;
          }
          return comment;
        });
        setComments(newComments);
      } catch (error: any) {
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
            </div>
          ))}
        </div>
        <div>
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <div className="text-lg font-semibold mb-4">포트폴리오 오너 소개</div>
            <div className="mb-4">
              <div className="mx-auto profile-photo w-16 h-16 ">
                <img
                  src={`https://source.boringavatars.com/beam/500/${ownerInfo.name}`}
                  alt="프로필 이미지"
                  className="w-full h-full"
                />
              </div>
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
