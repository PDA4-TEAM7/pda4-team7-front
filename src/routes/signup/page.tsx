import useModal from "@/hooks/useModal";
import React, { useState, FormEvent } from "react";

interface SignUpFormState {
  user_id: string;
  username: string;
  password: string;
  confirm_password: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<SignUpFormState>({
    user_id: "",
    username: "",
    password: "",
    confirm_password: "",
  });
  const { open, close } = useModal();
  const handleModal = ({ title, message }: { title: string; message: string }) => {
    open(title, message, close);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== "" && formData.password !== formData.confirm_password) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    // TODO: 회원가입 API 로직 구현하기
    console.log("Submitted Data:", formData);

    // TODO: 모달로 변경 및 네비게이터 사용하기
    alert("회원가입 완료!");
    setFormData({
      user_id: "",
      username: "",
      password: "",
      confirm_password: "",
    });
  };

  const checkDuplicate = async (field: "user_id" | "username") => {
    // TODO: API요청하여 중복 검사로직 구현하기

    // 현재는 더미데이터
    const isDuplicate = Math.random() > 0.5; // 50% 확률로 중복이라고 가정
    const message = isDuplicate
      ? `${field === "user_id" ? "아이디가" : "닉네임이"} 이미 사용 중입니다.`
      : `${field === "user_id" ? "사용 가능한 아이디" : "사용 가능한 닉네임"} 입니다.`;
    handleModal({ title: "중복체크", message });
  };
  return (
    <>
      <div className="relative min-h-screen w-full bg-blue-100 overflow-hidden">
        <div className="absolute z-10 top-1/2 transform -translate-y-1/2 translate-x-12 m-auto w-2/5 bg-white shadow-lg rounded-lg p-10">
          <h1 className="text-lg font-bold text-center">회원가입</h1>
          <p className="text-sm text-center text-gray-600">"하나의 바구니에 계란을 모두 넣지 말라"</p>
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            {/* 아이디 필드 */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                아이디
              </label>
              <div className="flex items-center">
                <input
                  id="user_id"
                  name="user_id"
                  type="text"
                  placeholder="아이디를 입력해주세요"
                  className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={formData.user_id}
                  onChange={(e) => handleChange(e)}
                />
                <button
                  type="button"
                  onClick={() => checkDuplicate("user_id")}
                  className="whitespace-nowrap ml-2 px-4 py-2 bg-blue-500 text-white rounded-r-md"
                >
                  중복 확인
                </button>
              </div>
            </div>

            {/* 닉네임 필드 */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                닉네임
              </label>
              <div className="flex items-center">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="닉네임을 입력해주세요"
                  className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={formData.username}
                  onChange={(e) => handleChange(e)}
                />
                <button
                  type="button"
                  onClick={() => checkDuplicate("username")}
                  className="whitespace-nowrap ml-2 px-4 py-2 bg-blue-500 text-white rounded-r-md"
                >
                  중복 확인
                </button>
              </div>
            </div>

            {/* 비밀번호 필드 */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* 비밀번호 확인 필드 */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                id="confirm-password"
                name="confirm_password"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>

            {/* 가입하기 버튼 */}
            <div className="mt-1"></div>
            <button type="submit" className="w-full px-4 py-2  bg-blue-500 text-white rounded-md">
              가입하기
            </button>
          </form>
          <div className="mt-10">
            <p className="text-gray-600">이미 계정이 있습니다.</p>
            <a href="#" className="text-blue-500">
              로그인하기
            </a>
          </div>
        </div>

        <div className="absolute right-0 w-3/5 min-h-screen bg-blue-500 flex m-5 rounded-md items-center justify-center">
          <div className="w-1/7"></div>
          <div className="flex-1 ml-auto">
            <div className="text-center text-white whitespace-normal">
              <h1 className="text-3xl font-bold">
                <b>E.G 서비스</b>를 이용하여
                <br />
                포트폴리오를 안전하게 거래하세요
                <br />
              </h1>
              <h4 className="text-xl whitespace-normal">
                E.G와 함께, <br />
                다양화된 투자로 리스크를 관리하고, <br />
                수익을 최적화하세요!
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
