import { Button } from "@/components/ui/button";
import useModal from "@/hooks/useModal";
import React, { useState, FormEvent } from "react";
import authAPI from "@/apis/authAPI";

interface SignInFormState {
  user_id: string;
  password: string;
}

const SignInInitValue = {
  user_id: "",
  password: "",
};

export default function SignIn() {
  const [formData, setFormData] = useState<SignInFormState>(SignInInitValue);
  const { open, close } = useModal();
  const handleModal = ({ title, message }: { title: string; message: string }) => {
    open(title, message, close);
  };
  const authService = new authAPI();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isBlankValue = (val: string) => {
    return val.trim() === "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fields = Object.values(formData);
    if (fields.some(isBlankValue)) {
      handleModal({ title: "오류", message: "모든 필드를 채워주세요!" });
      return;
    }

    // TODO: 로그인 요청
    const { message, status } = await authService.signIn(formData);
    handleModal({ title: "알림", message: message });

    if (status === 200) {
      // 로그인 성공, 서버가 쿠키를 설정했으므로 추가적인 처리가 필요 없음
      // 사용자를 홈으로 리다이렉트
      window.location.href = "/";
    } else {
      handleModal({ title: "알림", message: message });
    }
  };

  return (
    <>
      <div className="relative min-h-screen w-full bg-blue-100 overflow-hidden">
        <div className="absolute z-10 top-1/2 transform -translate-y-1/2 translate-x-12 m-auto w-2/5 bg-white shadow-lg rounded-lg p-10">
          <h1 className="text-lg font-bold text-center">로그인</h1>
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
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={formData.password}
                onChange={(e) => handleChange(e)}
              />
            </div>

            {/* 로그인 버튼 */}
            <div className="mt-1"></div>
            <Button type="submit" className="w-full px-4 py-2  bg-blue-500 text-white rounded-md">
              로그인하기
            </Button>
          </form>
          <div className="mt-10">
            <p className="text-gray-600">계정이 없습니다.</p>
            <a href="#" className="text-blue-500">
              가입하기
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
                포트폴리오를 안전하게 거래하세요!
                <br />
                <br />
              </h1>
              <h4 className="text-xl whitespace-normal">
                <b>E.G</b>와 함께 <br />
                다양화된 투자로 리스크를 관리하고 <br />
                수익을 최적화하세요!
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
