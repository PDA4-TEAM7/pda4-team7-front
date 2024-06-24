/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import StockApi, { IBackTestReq } from "@/apis/stockAPI";
import StockChart from "./StockChart";
import StockLineChart from "./StockLineChart";
import MonthlyInfo from "./MonthlyInfo";
import data from "../../../../data/dummyBack.json";

type Props = {
  id: string;
};

export default function BackTest({ id }: Props) {
  //TODO: 시작, 종료 날짜를 default값을 넣어두고 바로 백테스팅api호출되도록.
  //TODO: 그 후로는 날짜 값 변경시 새로 호출하도록.
  const startYear2004 = dayjs("2020-01-01");
  const today = dayjs();
  const [startDate, setStartDate] = useState<Dayjs | null>(startYear2004);
  const [endDate, setEndDate] = useState<Dayjs | null>(today);
  const [accountdata, setAccountdata] = useState<any[]>([]); // stock_in_account 컬럼 값 저장
  const [stocks, setStocks] = useState<number[]>([]);
  const [stockNames, setStockNames] = useState<string[]>([]);
  const [backTestData, setBackTestData] = useState<any>();

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
            code: account.stock.code,
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
        const quantities: number[] = updatedData.map((account: any) => +account.hldg_qty);
        setStocks(quantities);
        // 주식 이름을 찾는 코드
        const stockNames = updatedData.map((account: any) => account.stock_name);
        setStockNames(stockNames);

        const total: number = quantities.reduce((acc, curr) => acc + curr, 0);
        if (!startDate || !endDate) return;
        const stockList = updatedData.map((account: any) => {
          return [account.code, account.stock_name, +account.hldg_qty / total];
        });
        const portfolio: IBackTestReq = {
          stock_list: stockList,
          balance: 100000000, ///1억 기준
          interval_month: 1,
          start_date: startDate.startOf("month").format("YYYYMMDD"), // "20221231"
          end_date: endDate.endOf("month").format("YYYYMMDD"),
        };
        // const backTestingDataRes = await service.getBackTest(portfolio);
        if (data && data.portfolio) {
          setBackTestData(data);
        } else {
          console.log("error : ", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAccountData();
  }, [id]);

  useEffect(() => {
    console.log("back:", backTestData);
  }, [backTestData]);

  return (
    <div className="portfolio-detail-container h-full">
      <div className="wrap-section flex flex-row gap-10">
        <div className="section inline-block w-1/2 box-border px-4">
          <div className="section ">
            <p className="text-xl">포트폴리오 구성</p>
            <div className="chart-wrap w-full h-screen/2 min-h-[580px] relative overflow-hidden">
              <StockChart stockData={stocks} stockNames={stockNames} showLabel={true} />
            </div>
            <div className="date-wrap flex flex-col mt-12 p-8 bg-slate-100 rounded-lg">
              <p className="text-xl pb-6">투자 성과 조회 기준 설정</p>
              <div className="date-wrap flex flex-row gap-4 justify-between ">
                <DatePicker
                  label={"시작"}
                  views={["month", "year"]}
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                  minDate={startYear2004}
                  maxDate={endDate || today} // endDate 이전 날짜만 선택 가능
                  className="flex-1"
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
                  className="flex-1"
                />
              </div>
              <p className="mt-4 text-gray-600">시작일 지정은 2004-01부터 지원됩니다.</p>
            </div>
          </div>
        </div>
        <div className="section inline-block w-1/2 box-border px-4 h-screen overflow-y-auto">
          {/* chart */}
          {backTestData && backTestData.portfolio && <StockLineChart backTestData={backTestData.portfolio.backtest} />}
          <div className="flex flex-col mt-12 p-8 bg-slate-100 rounded-lg">
            <p className="text-xl pb-6">상세 지표</p>
            <div className="date-wrap flex flex-row gap-4 justify-between ">
              <DatePicker
                label={"시작"}
                views={["month", "year"]}
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                minDate={startYear2004}
                maxDate={endDate || today} // endDate 이전 날짜만 선택 가능
                className="flex-1"
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
                className="flex-1"
              />
            </div>
            <div className="date-wrap flex flex-row gap-4 justify-between mt-8">
              <DatePicker
                label={"시작"}
                views={["month", "year"]}
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                minDate={startYear2004}
                maxDate={endDate || today} // endDate 이전 날짜만 선택 가능
                className="flex-1"
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
                className="flex-1"
              />
            </div>
          </div>
          {startDate && endDate && backTestData && backTestData.portfolio && (
            <MonthlyInfo
              startDate={startDate}
              endDate={endDate}
              backTestData={Object.keys(backTestData.portfolio)
                .filter((name) => name !== "backtest")
                .map((name) => ({
                  [name]: backTestData.portfolio[name],
                }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
