import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Prev from "@/assets/icon-back-white.png";
export default function SubcribePortfolioRecency() {
  const navigate = useNavigate();
  const handleSubPortfolioClick = () => {
    navigate("/portfolio/subscribe");
  };
  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b bg-gray-100">
        <div></div>
        <div className="flex items-center">
          <img src="" alt="알림" className="w-5 h-5 mx-2" />
          <img src="settings-icon.png" alt="설정" className="w-5 h-5 mx-2" />
          <span className="mx-2">ENG</span>
        </div>
      </header>
      <main className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-3">구독한 포트폴리오의 최근 변화</h1>
            <Button
              className="text-l focus:outline-none px-8 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400 "
              onClick={handleSubPortfolioClick}
            >
              <img src={Prev} alt="이전으로 아이콘" className="w-6 h-6 mr-1" />
              이전으로
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4"></div>
      </main>
    </div>
  );
}
