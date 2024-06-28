import { Button } from "@/components/ui/button";
import useModal from "@/hooks/useModal";
import React, { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
  const { signIn } = useAuth();
  const navigate = useNavigate();
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
    const res = await signIn(formData);

    if (res) {
      open("알림", `${res.username}님 환영합니다!`, () => {
        navigate("/portfolio/mainPortfolio");
      });
    } else {
      handleModal({ title: "알림", message: "로그인에 실패했습니다." });
    }
  };

  return (
    <>
      <div className="relative min-h-screen w-full bg-blue-100 overflow-y-auto md:p-8 p-2 flex items-center flex justify-center items-center md:justify-start">
        <div
          className="relative bg-white shadow-lg rounded-lg md:p-10 p-4 max-w-screen-sm w-full md:w-1/2 inline-block"
          style={{ zIndex: 100 }}
        >
          <h1 className="text-lg font-bold text-center">로그인</h1>
          <p className="text-sm text-center text-gray-600">"하나의 바구니에 계란을 모두 넣지 말라"</p>
          <form className="space-y-4 mt-4 flex flex-col" onSubmit={handleSubmit}>
            {/* 아이디 필드 */}
            <div className="flex flex-col space-y-2 flex-1">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 flex-1">
                아이디
              </label>
              <div className="flex items-center">
                <input
                  id="user_id"
                  name="user_id"
                  type="text"
                  placeholder="아이디를 입력해주세요"
                  className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-20"
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
            <div className="flex justify-between">
              <a href="/signup" className="text-blue-500">
                가입하기
              </a>
              <a href="/portfolio/mainportfolio" className="text-blue-500">
                홈으로 이동하기
              </a>
            </div>
          </div>
        </div>
        <div
          className="absolute -top-2 right-0 w-1/2  xl:w-calc-100vh-minus-sm lg:w-1/2 inline-block min-h-screen h-full bg-blue-500 flex m-5 rounded-md items-center justify-center hidden md:flex"
          style={{ zIndex: 90 }}
        >
          <div className="w-1/7"></div>
          <div className="flex-1 ml-auto">
            <div className="text-center text-white whitespace-normal">
              <h1 className="lg:text-3xl text-2xl font-bold">
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
