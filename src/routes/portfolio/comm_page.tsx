import React, { useState } from 'react';

type Comment = {
  id: number;
  author: string;
  date: string;
  text: string;
  replies: {
    author: string;
    role: string;
    date: string;
    text: string;
  }[];
  replyText?: string;
};

const CommPage = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: '임찬솔',
      date: '2024.05.31',
      text: '아니 삼전 겁나 떨어졌는데 왜 사셨나요',
      replies: [
        {
          author: '박소연',
          role: '작성자',
          date: '2024.05.31',
          text: '저는 이득 봤습니다'
        }
      ],
      replyText: ''
    },
    {
      id: 2,
      author: '오수연',
      date: '2024.05.28',
      text: '아 집가고 싶다.',
      replies: [
        {
          author: '박소연',
          role: '작성자',
          date: '2024.05.31',
          text: '인정합니다.'
        }
      ],
      replyText: ''
    }
  ]);

  const [ownerInfo, setOwnerInfo] = useState({
    name: '박소연',
    updateDate: '3일 전',
    profileImage: '/img/soya_profile.png'
  });

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        author: '현재 사용자 (쿠키써서 현재 로그인한 사람 하면 될듯?)',
        date: new Date().toISOString().split('T')[0],
        text: comment,
        replies: [],
        replyText: ''
      };
      console.log("New comment:", newComment); // 디버깅을 위한 로그 추가
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>, commentId: number) => {
    const newComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replyText: e.target.value
        };
      }
      return comment;
    });
    setComments(newComments);
  };

  const handleReplySubmit = (commentId: number) => {
    const newComments = comments.map(comment => {
      if (comment.id === commentId && comment.replyText?.trim()) {
        const newReply = {
          author: ownerInfo.name,
          role: '작성자',
          date: new Date().toISOString().split('T')[0],
          text: comment.replyText
        };
        return {
          ...comment,
          replies: [...comment.replies, newReply],
          replyText: ''
        };
      }
      return comment;
    });
    setComments(newComments);
  };

  const activecommentEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommentSubmit();  // handleCommentSubmit 함수를 호출합니다.
    }
  };

  const activereplyEnter = (e:React.KeyboardEvent<HTMLInputElement>,commentId : number)=>{
    if(e.key === 'Enter'){
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
              onKeyDown={activecommentEnter}
              className="w-full p-2 border border-gray-300 rounded outline-none"
            />
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded whitespace-nowrap"
            >
              댓글 작성
            </button>
          </div>
          {comments.map(comment => (
            <div key={comment.id} className="mb-6 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="font-semibold">{comment.author}</div>
                <div className="ml-4 text-gray-500">{comment.date}</div>
              </div>
              <p className="mb-2">{comment.text}</p>
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
              {ownerInfo.name === '박소연' && (
                <div className="ml-8 mt-4 flex flex-row gap-1">
                  <input
                    type="text"
                    placeholder="답글을 입력하세요 :)"
                    value={comment.replyText || ''}
                    onChange={(e) => handleReplyChange(e, comment.id)}
                    onKeyDown={(e)=>activereplyEnter(e,comment.id)}
                    className="w-full p-2 border border-gray-300 rounded outline-none"
                  />
                  <button
                    onClick={() => handleReplySubmit(comment.id)}
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
              className={`px-4 py-2 text-white rounded ${isSubscribed ? 'bg-red-500' : 'bg-blue-500'}`}
            >
              {isSubscribed ? '구독 취소' : '구독하기'}
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
