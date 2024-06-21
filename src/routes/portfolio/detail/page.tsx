import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { TextField } from "@mui/material";
// portfolio/detail/1
export default function DetailPage() {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
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
          <div className="date-wrap flex">
            <DatePicker
              label={"시작"}
              views={["month", "year"]}
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
            />
            <DatePicker
              label={"종료"}
              views={["month", "year"]}
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
            />
          </div>
          {startDate && `${startDate.year()} ${startDate.month()}`}
          <br />
          {endDate && `${endDate.year()} ${endDate.month()}`}
        </div>
        <div className="section flex-1"></div>
      </div>
    </div>
  );
}
