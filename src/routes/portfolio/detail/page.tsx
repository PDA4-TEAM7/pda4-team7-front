import { useParams } from "react-router-dom";
import DatePicker from "./DatePicker";

// portfolio/detail/1
export default function DetailPage() {
  const { id } = useParams();
  const title = "무슨 포폴이냐면요";
  return (
    <div className="portfolio-detail-container">
      <nav className="flex flex-row items-center justify-between">
        <div>
          <h1>{title}</h1>
        </div>
        <div className="space-x-4 flex flex-row">
          <div className="text-zinc-900 hover:text-zinc-700">종목 리스트</div>
          <div className="text-zinc-900 hover:text-zinc-700">과거 투자 성과</div>
          <div className="text-zinc-900 hover:text-zinc-700">질의응답</div>
        </div>
      </nav>
      <div className="wrap-section flex flex-row">
        <div className="section flex-1">
          <DatePicker />
          section1
        </div>
        <div className="section flex-1"></div>
      </div>
    </div>
  );
}
