/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import StockApi, { IBackTestReq } from "@/apis/stockAPI";
import StockChart from "./StockChart";
import StockLineChart from "./StockLineChart";
import MonthlyInfo from "./MonthlyInfo";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/nums";
import Skeleton from "@mui/material/Skeleton";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/chart-lottie.json"; // JSON 파일 경로
import dummyData from "../../../../data/dummyBack.json";
type Props = {
  id: string;
};

export default function BackTest({ id }: Props) {
  //TODO: 시작, 종료 날짜를 default값을 넣어두고 바로 백테스팅api호출되도록.
  //TODO: 그 후로는 날짜 값 변경시 새로 호출하도록.
  const startYear2004 = dayjs("2010-01-01");
  const today = dayjs();
  const [selectedStDate, setSelectedStDate] = useState<Dayjs | null>(startYear2004);
  const [selectedEdDate, setSelectedEdDate] = useState<Dayjs | null>(today);
  const [startDate, setStartDate] = useState<Dayjs | null>(startYear2004);
  const [endDate, setEndDate] = useState<Dayjs | null>(today);
  const [stocks, setStocks] = useState<number[]>([]);
  const [stockNames, setStockNames] = useState<string[]>([]);
  const [backTestData, setBackTestData] = useState<any>([]);
  const [resStockData, setResStockData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const backTestFetcher = async (stockdata: any, quantities: number[]) => {
    if (!startDate || !endDate) return;
    try {
      console.log("update...", isLoading);
      const service = new StockApi();
      const total: number = quantities.reduce((acc, curr) => acc + curr, 0);
      const stockList = stockdata.map((account: any) => {
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
      // if (!backTestingDataRes) return console.log("error : ", backTestingDataRes);
      // setBackTestData(backTestingDataRes);

      // return backTestingDataRes;
      return dummyData;
    } finally {
      setIsLoading(false);
    }
  };
  const handleBackTestUpdate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setStartDate(selectedStDate);
    setEndDate(selectedEdDate);
    const res = await backTestFetcher(resStockData, stocks);
    if (res) setBackTestData(res);
  };
  useEffect(() => {
    const fetchAccountData = async () => {
      if (!id) return console.log("아이디없음", id);
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
        setResStockData(updatedData);
        // 각 주식의 수량을 가져오는 코드 파이차트안의 내용.
        const quantities: number[] = updatedData.map((account: any) => +account.hldg_qty);
        setStocks(quantities);
        // 주식 이름을 찾는 코드
        const stockNames = updatedData.map((account: any) => account.stock_name);
        setStockNames(stockNames);
        setIsLoading(true);
        console.log("loading : ", isLoading);
        const res = await backTestFetcher(updatedData, quantities);
        setBackTestData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAccountData();
  }, [id]);

  useEffect(() => {
    console.log("isloading useEffect:", backTestData);
  }, [backTestData]);
  return (
    <div className="portfolio-detail-container md:h-full w-full">
      <div className="wrap-section flex md:flex-row gap-10 flex-col">
        <div className="section inline-block md:w-1/2 w-full box-border md:px-4 px-1 md:overflow-y-auto pb-4 md:h-calc-100vh-minus-2rem ">
          <div className="section ">
            <div className="chart-wrap w-full h-screen/2 min-h-[380px] relative overflow-hidden">
              <StockChart stockData={stocks} stockNames={stockNames} showLabel={true} />
            </div>
            <div className="date-wrap flex flex-col mt-12 md:p-6 p-3 bg-slate-100 rounded-lg md:mx-4 mx-1 mb-2">
              <p className="md:text-lg md:pb-6 pb-4 ">투자 성과 조회 기준 설정</p>
              <div className="flex flex-col gap-3">
                <div className="date-wrap flex flex-row gap-4 justify-between ">
                  <DatePicker
                    label={"시작"}
                    views={["month", "year"]}
                    value={selectedStDate}
                    onChange={(newValue) => {
                      setSelectedStDate(newValue);
                    }}
                    minDate={startYear2004}
                    maxDate={selectedEdDate || today} // endDate 이전 날짜만 선택 가능
                    className="flex-1"
                  />
                  <DatePicker
                    label={"종료"}
                    views={["month", "year"]}
                    value={selectedEdDate}
                    minDate={selectedStDate || undefined} // startDate 이후 날짜만 선택 가능
                    maxDate={today} // endDate 이전 날짜만 선택 가능
                    onChange={(newValue) => {
                      setSelectedEdDate(newValue);
                    }}
                    className="flex-1"
                  />
                </div>
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleBackTestUpdate()}
                >
                  조회하기
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-600">시작일 지정은 2010-01부터 지원됩니다.</p>
            </div>
          </div>
        </div>
        <div className="section inline-block md:w-1/2 w-full box-border px-4 md:overflow-y-auto  pb-4 md:overflow-y-auto pb-4 md:h-calc-100vh-minus-2rem">
          {/* chart */}
          {!isLoading ? (
            backTestData && <StockLineChart backTestData={backTestData.portfolio.backtest} />
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center">
              <Lottie animationData={loadingAnimation} style={{ width: "140%", height: "140%", opacity: 0.5 }} />
            </div>
          )}
          <div className="flex flex-col mt-12 md:p-8 p-4 bg-slate-100 rounded-lg">
            <p className="text-xl pb-6 font-semibold">상세 지표</p>
            <div className="date-wrap flex flex-row gap-4 justify-between ">
              <div className="backtest-info flex-1 bg-slate-200 rounded px-4 py-3">
                <p className="title font-semibold">샤프지수</p>
                {!isLoading ? (
                  <span>{formatNumber(backTestData.sharpe_ratio, 2)}</span>
                ) : (
                  <span>
                    <Skeleton animation="wave" />
                  </span>
                )}
              </div>
              <div className="backtest-info flex-1 bg-slate-200 rounded px-4 py-3">
                <p className="title font-semibold">MDD</p>
                {!isLoading ? (
                  <span>{formatNumber(backTestData.mdd, 4)}</span>
                ) : (
                  <span>
                    <Skeleton animation="wave" />
                  </span>
                )}
              </div>
            </div>
            <div className="date-wrap flex flex-row gap-4 justify-between mt-8">
              <div className="backtest-info flex-1 bg-slate-200 rounded px-4 py-3">
                <p className="title font-semibold">표준편차</p>
                {!isLoading ? (
                  <span>{formatNumber(backTestData.standard_deviation, 2)}</span>
                ) : (
                  <span>
                    <Skeleton animation="wave" />
                  </span>
                )}
              </div>
              <div className="backtest-info flex-1 bg-slate-200 rounded px-4 py-3">
                <p className="title font-semibold">연간 수익률</p>
                {!isLoading ? (
                  <span>{formatNumber(backTestData.annual_return, 2)}</span>
                ) : (
                  <span>
                    <Skeleton animation="wave" />
                  </span>
                )}
              </div>
            </div>
          </div>
          {!isLoading && startDate && endDate && backTestData && backTestData.portfolio && (
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
          {isLoading && (
            <div className="monthly-data md:mt-12 mt-8 mb-20">
              <p className="text-xl pb-6 font-semibold">날짜 별 종목 성과</p>
              <div className="flex items-center justify-center">
                <Skeleton sx={{ bgcolor: "grey.300" }} variant="rectangular" width={"100%"} height={200} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
