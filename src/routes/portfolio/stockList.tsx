/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";

// 단어 데이터의 인터페이스를 정의
interface WordData {
  text: string;
  value: number;
}

// 긴 텍스트를 줄여서 표시하는 함수

// StockList 컴포넌트 정의
const StockList: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // SVG 요소에 대한 참조를 생성
  const [stocks, setStocks] = useState<WordData[]>([]);
  const [accountdata, setAccountdata] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [stockdata, setStockdata] = useState<any>({
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

  const { id } = useParams();

  useEffect(() => {
    console.log(`params id: ${id}`);
  }, [id]);

  // DB stock_in_account에서 보유종목, 가격, 평가손익, 수익률(%) 값 가져오기
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/stockaccount");
        const fetchedAccount = response.data;

        // 데이터 가공
        const updatedData = fetchedAccount.map((account: any) => ({
          holdings_id: account.holdings_id,
          account_id: account.account_id,
          stock_id: account.stock_id,
          market_id: account.market_id,
          quantity: account.quantity,
          pchs_amt: account.pchs_amt,
          evlu_amt: account.evlu_amt,
          evlu_pfls_amt: account.evlu_pfls_amt,
          evlu_pfls_rt: account.evlu_pfls_rt,
        }));

        setAccountdata(updatedData);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    fetchAccount();

    console.log(accountdata);
  }, []);

  // DB stock에서 주식 섹터 값 가져오기
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/stock");
        const fetchedStocks = response.data;

        console.log(fetchedStocks);
        // stocks의 값들을 WordData 배열의 text에 넣고 value는 임의의 값으로 설정
        const updatedData = fetchedStocks.map((stock: any) => ({
          text: stock.std_idst_clsf_cd_name,
          value: Math.floor(Math.random() * 60) + 40, // 1에서 100 사이의 임의의 값
        }));

        setStocks(updatedData);
        setStockList(fetchedStocks); // 추가: 전체 주식 데이터를 저장
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    fetchStocks();
  }, []);

  // console.log(`stocklist는 ${stockList}`);

  // 주식 수량과 이름 넣어주기
  useEffect(() => {
    if (accountdata.length > 0 && stockList.length > 0) {
      // accountdata에서 quantity 값 추출
      const quantities = accountdata.map((item: any) => item.quantity);

      // stock_id에 해당하는 name 값을 찾기
      const stockNames = accountdata.map((item: any) => {
        const stock: any = stockList.find((stockItem: any) => stockItem.stock_id === item.stock_id);
        return stock ? stock.name : "Unknown";
      });
      // stockdata 상태 업데이트
      setStockdata((prevState: any) => ({
        labels: stockNames,
        datasets: [
          {
            ...prevState.datasets[0],
            data: quantities,
          },
        ],
      }));
    }
  }, [accountdata, stockList]);

  useEffect(() => {
    if (stocks.length === 0) return;

    // 워드 클라우드 상위 5개의 데이터 선택

    // 커스텀 툴팁 스타일 추가
    const tooltipStyle = `
      .tooltip {
        position: absolute;
        background-color: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.1s ease-in-out;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = tooltipStyle;
    document.head.appendChild(styleSheet);

    // SVG 요소 선택 및 초기화
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", "-350 -200 700 400") // ViewBox를 설정하여 중앙에 배치
      .attr("preserveAspectRatio", "xMidYMid slice"); // 비율을 유지하며 중앙에 맞춤

    // 그룹 요소 추가

    // 커스텀 툴팁 요소 추가
    const tooltip = d3.select("body").append("div").attr("class", "tooltip"); // 툴팁에 클래스 적용

    // 원형 배치를 위한 시뮬레이션 설정

    return () => {
      // 클린업: 기존 SVG 요소 제거
      svg.selectAll("*").remove();
      tooltip.remove(); // 툴팁 요소 제거
      document.head.removeChild(styleSheet); // 스타일 요소 제거
    };
  }, [stocks]);

  // 상위 7개 데이터를 컴포넌트 내에서도 참조
  const topData = stocks.sort((a, b) => b.value - a.value).slice(0, 7);
  // 오른쪽 텍스트 7개까지 출력 나머지는 그 외로 표시
  const totalValue = d3.sum(stocks.map((item) => item.value));

  // 나머지 데이터의 합계 계산
  const otherDataValue = totalValue - d3.sum(topData.map((item) => item.value));
  const otherDataPercentage = ((otherDataValue / totalValue) * 100).toFixed(1);

  console.log(accountdata);
  return (
    <div>
      <div>
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
      <div className="space-y-4">
        <div>
          {stockList.map((stock: any, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stock.color }}></div>
              <span>{stock.name}</span>
            </div>
          ))}
        </div>
        <div>
          {accountdata.map((stock: any, i) => (
            <div key={i} className="flex justify-between items-center">
              <span>{stock.quantity}주</span>
              <div className="text-right">
                <span className="block">{stock.evlu_amt}원</span>
                <span className={`block ${stock.evlu_pfls_amt >= 0 ? "text-red-600" : "text-blue-600"}`}>
                  {stock.evlu_pfls_amt}원 ({parseFloat(stock.evlu_pfls_rt).toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <svg ref={svgRef}></svg>{" "}
        <div>
          {topData.map((d, i) => (
            <div key={i} style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
              <span style={{ color: d3.schemeCategory10[i % 10], marginRight: "5px" }}>●</span>
              {d.text} ({((d.value / totalValue) * 100).toFixed(1)}%)
            </div>
          ))}
          <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
            <span style={{ color: "gray", marginRight: "5px" }}>●</span>그 외 ({otherDataPercentage}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockList; // StockList 컴포넌트를 기본 내보내기
