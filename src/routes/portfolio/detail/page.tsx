/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Slider } from "@mui/material";
import { Pie } from "react-chartjs-2";
import StockApi from "@/apis/stockAPI";
// portfolio/detail/1
export default function DetailPage() {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const { id } = useParams();
  const [accountdata, setAccountdata] = useState<any[]>([]); // stock_in_account 컬럼 값 저장
  const [stockdata, setStockdata] = useState<any>({
    // 파이차트에 대한 변수
    labels: [],
    datasets: [
      {
        label: "수량",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const today = dayjs();
  const startYear2004 = dayjs("2004-01-01");

  const ariav = (value: number) => {
    return `date : ${value}`;
  };
  const title = "무슨 포폴이냐면요";

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!id) {
        console.log("아이디없음", id);
        return;
      }
      try {
        const service = new StockApi();
        console.log("Fetching account data...");
        const account_res = await service.stockJoin(id);
        const fetchedAccount = account_res.data;
        console.log("Fetched account data:", fetchedAccount);

        // 데이터 가공
        const updatedData = fetchedAccount
          .filter((account: any) => {
            // console.log("Comparing", account.stock_id, "with", Number(id));
            return account.account_id === Number(id);
          })
          .map((account: any) => {
            const evlu_pfls_rt = (account.evlu_pfls_amt / account.pchs_amt) * 100;

            return {
              holdings_id: account.holdings_id,
              account_id: account.account_id,
              stock_id: account.stock_id,
              market_id: account.market_id,
              quantity: account.quantity,
              pchs_amt: account.pchs_amt,
              evlu_amt: account.evlu_amt,
              evlu_pfls_amt: account.evlu_pfls_amt,
              evlu_pfls_rt: evlu_pfls_rt,
              stock_name: account.stock.name,
              std_idst_clsf_cd_name: account.stock.std_idst_clsf_cd_name,
            };
          });

        setAccountdata(updatedData);
        console.log("Updated account data:", updatedData);
        // 파이차트
        // 각 주식의 수량을 가져오는 코드
        const quantities = updatedData.map((account: any) => account.quantity);

        // 주식 이름을 찾는 코드
        const stockNames = updatedData.map((account: any) => account.stock_name);
        setStockdata({
          labels: stockNames,
          datasets: [
            {
              ...stockdata.datasets[0],
              data: quantities,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAccountData();
  }, [id]);
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
        <div className="section flex flex-col flex-1">
          <div className="date-wrap flex">
            <DatePicker
              label={"시작"}
              views={["month", "year"]}
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              minDate={startYear2004}
              maxDate={endDate || today} // endDate 이전 날짜만 선택 가능
            />
            <DatePicker
              label={"종료"}
              views={["month", "year"]}
              value={endDate}
              minDate={startDate || undefined} // startDate 이후 날짜만 선택 가능
              maxDate={today} // endDate 이전 날짜만 선택 가능
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
            />
          </div>
          {startDate && `${startDate.year()} ${startDate.month()}`}
          <br />
          {endDate && `${endDate.year()} ${endDate.month()}`}
          <div className="range-wrap">
            <Slider
              aria-label="Temperature"
              defaultValue={30}
              getAriaValueText={ariav}
              valueLabelDisplay="auto"
              shiftStep={30}
              step={10}
              marks
              min={10}
              max={110}
            />
          </div>
          <div className="chart-wrap">
            <Pie
              data={stockdata}
              options={{
                maintainAspectRatio: true,
                responsive: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="section flex-1">{/* chart */}</div>
      </div>
    </div>
  );
}
