import React, { useState, useEffect } from "react";
import { IComment, commentApi } from "@/apis/commentAPI";
import { replyApi } from "@/apis/replyAPI";
import { portfolioApi } from "@/apis/portfolioAPI";
import Lottie from "lottie-react";
import loadingAnim from "@/assets/lottie-loading.json";

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
  title: string;
  description: string;
  updateDate: string;
  owner: {
    name: string;
    uid: number;
    profileImage: string;
    introduce: string;
  };
};

type Props = {
  id: string;
};

const CommPage = ({ id }: Props) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null); // 초기값을 null로 설정
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [sending, setSending] = useState(false); //댓글 작성 중복안되게
  useEffect(() => {
    // 포트폴리오의 오너 정보를 가져옵니다.
    const fetchOwnerInfo = async () => {
      try {
        const portfolioResponse = await portfolioApi.getPortfolioByPortfolioId(id);
        const accountId = portfolioResponse.account_id;
        const response = await portfolioApi.getPortfolioComm(accountId);
        setOwnerInfo(response);
        setIsLoading(false); // 데이터 로드 완료 시 로딩 상태 false로 설정
        console.log("가져왔다.", response);
      } catch (error) {
        console.error("오너 정보를 가져오는 중 오류 발생:", error);
        setIsLoading(false); // 오류 발생 시에도 로딩 상태 false로 설정
      }
    };

    fetchOwnerInfo();
  }, [id]);

  useEffect(() => {
    // 초기 로드 시 포트폴리오의 댓글을 가져옵니다.
    const fetchComments = async () => {
      try {
        const response = await commentApi.readComments(+id);
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
                role: ownerInfo && reply.user_id === ownerInfo.owner.uid ? "작성자" : "",
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

    if (ownerInfo && ownerInfo.owner.uid !== 0) {
      fetchComments();
    }
  }, [id, ownerInfo]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (sending) return;
    setSending(true);
    if (comment.trim()) {
      try {
        const newCommentData: IComment = {
          // DUMMY: 더미로 넣어놨어용
          userId: 1,
          description: comment,
          portfolioId: +id,
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
      } finally {
        setSending(false);
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
    if (sending) return;
    setSending(true);
    try {
      const comment = comments.find((comment) => comment.comment_id === commentId);
      if (comment && comment.replyText?.trim()) {
        const newReplyData = {
          description: comment.replyText,
          userId: 0,
          comment_id: commentId,
        };

        // 백엔드 API 호출
        const response = await replyApi.writeReply(newReplyData);
        if (response.status === 403) {
          return alert("권한 다메");
        }
        const newReply = {
          author: response.data.newReply.username,
          user_id: response.data.newReply.user_id,
          role: ownerInfo && response.data.newReply.user_id === ownerInfo.owner.uid ? "작성자" : "",
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
      }
    } finally {
      setSending(false);
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

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-[64px]"></div>
        <Lottie animationData={loadingAnim} />
      </div>
    );
  }

  if (!ownerInfo) {
    return <div>포트폴리오 정보를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto md:p-6 p-2 bg-white shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
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
                <div className="profile-photo w-5 h-5">
                  <img
                    src={`https://source.boringavatars.com/beam/500/${comment.author}`}
                    alt="프로필 이미지"
                    className="w-full h-full"
                  />
                </div>
                <div className="font-semibold ml-1">{comment.author}</div>
                <div className="ml-4 text-gray-500">{new Date(comment.create_dt).toISOString().split("T")[0]}</div>
              </div>
              <p className="mb-2">{comment.description}</p>
              {comment.replies.map((reply, index) => (
                <div key={index} className="md:ml-8 ml-4 mt-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="profile-photo w-5 h-5">
                      <img
                        src={`https://source.boringavatars.com/beam/500/${reply.author}`}
                        alt="프로필 이미지"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="ml-1 font-semibold text-nowrap">{reply.author}</div>
                    {reply.role && <div className="ml-4 text-red-500 font-semibold text-nowrap">{reply.role}</div>}
                    <div className="ml-4 text-gray-500 text-nowrap">{reply.date}</div>
                  </div>
                  <p className="mb-2">{reply.text}</p>
                </div>
              ))}
              <div className="md:ml-8 ml-4 mt-4 flex flex-row gap-1">
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
        <div className="mb-40">
          <div className="p-4 bg-gray-100 rounded-lg text-center" style={{ minHeight: "400px" }}>
            <div className="text-lg font-semibold mb-4">포트폴리오 오너 소개</div>
            <div className="mb-4">
              <div className="mx-auto profile-photo w-16 h-16 ">
                <img
                  src={`https://source.boringavatars.com/beam/500/${ownerInfo.owner.name}`}
                  alt="프로필 이미지"
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="font-bold mb-2">{ownerInfo.owner.name}</div>
            <div className="text-sm text-gray-500 mb-4">마지막 업데이트: {ownerInfo.updateDate}</div>
            <div className="text-sm  mb-4">{ownerInfo.owner.introduce}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommPage;
