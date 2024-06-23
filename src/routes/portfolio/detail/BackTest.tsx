/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Slider } from "@mui/material";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import StockApi from "@/apis/stockAPI";
import StockChart from "./StockChart";

Chart.register(ChartDataLabels);

type Props = {
  id: string;
};

export default function BackTest({ id }: Props) {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [accountdata, setAccountdata] = useState<any[]>([]); // stock_in_account 컬럼 값 저장
  const [stocks, setStocks] = useState<number[]>([]);
  const [stockNames, setStockNames] = useState<string[]>([]);
  const today = dayjs();
  const startYear2004 = dayjs("2004-01-01");

  const ariav = (value: number) => {
    return `date : ${value}`;
  };

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!id) {
        console.log("아이디없음", id);
        return;
      }
      try {
        const service = new StockApi();
        console.log("Fetching account data...");
        const fetchedAccount = await service.stockJoin(id);
        console.log("Fetched account data:", fetchedAccount);

        // 데이터 가공
        const updatedData = fetchedAccount.map((account: any) => {
          const evlu_pfls_rt = (account.evlu_pfls_amt / account.pchs_amt) * 100;

          return {
            holdings_id: account.holdings_id,
            account_id: account.account_id,
            stock_id: account.stock_id,
            market_id: account.market_id,
            hldg_qty: account.hldg_qty,
            pchs_amt: account.pchs_amt,
            evlu_amt: account.evlu_amt,
            evlu_pfls_amt: account.evlu_pfls_amt,
            evlu_pfls_rt: evlu_pfls_rt,
            stock_name: account.stock.name,
            std_idst_clsf_cd_name: account.stock.std_idst_clsf_cd_name,
          };
        });
        setAccountdata(updatedData);
        // 파이차트
        // 각 주식의 수량을 가져오는 코드 파이차트안의 내용.
        const quantities = updatedData.map((account: any) => +account.hldg_qty);
        setStocks(quantities);
        // 주식 이름을 찾는 코드
        const stockNames = updatedData.map((account: any) => account.stock_name);
        setStockNames(stockNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAccountData();
  }, [id]);
  return (
    <div className="portfolio-detail-container">
      <div className="wrap-section flex flex-row gap-2">
        <div className="section inline-block w-1/2 box-border">
          <div className="section ">
            <p className="text-xl">포트폴리오 구성</p>
            <div className="chart-wrap w-full h-screen/2 min-h-[580px] relative overflow-hidden">
              <StockChart stockData={stocks} stockNames={stockNames} />
            </div>
            <div className="portfolio-detail"></div>
          </div>
        </div>
        <div className="section inline-block w-1/2 box-border">
          {/* chart */}
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
        </div>
      </div>
    </div>
  );
}
