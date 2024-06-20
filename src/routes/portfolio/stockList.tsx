/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";

// 단어 데이터의 인터페이스를 정의
interface WordData extends d3.SimulationNodeDatum {
  text: string;
  value: number;
  x?: number;
  y?: number;
}

// 긴 텍스트를 줄여서 표시하는 함수
const truncateText = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};

// StockList 컴포넌트 정의
const StockList: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // SVG 요소에 대한 참조를 생성
  const [stocks, setStocks] = useState<WordData[]>([]); // 워드 클라우드 변수
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

  const { id } = useParams<{ id: string }>(); // 포트폴리오 ID값 가져오기

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        console.log("Fetching account data...");
        const account_res = await axios.post("http://localhost:3000/api/stockjoin");
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

        // 주식 보유 수가 아닌 비율로 구성
        const stockrate = updatedData.reduce((sum: any, account: any) => sum + account.quantity, 0);

        const updatedStocks = updatedData.map((account: any) => {
          return {
            text: account.std_idst_clsf_cd_name,
            value: (account.quantity / stockrate) * 100,
            x: 0,
            y: 0,
          };
        });

        setStocks(updatedStocks);
        console.log("Updated stocks data:", updatedStocks);

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

  useEffect(() => {
    if (stocks.length === 0) return;

    // 워드 클라우드 상위 5개의 데이터 선택
    const topData = stocks.sort((a, b) => b.value - a.value).slice(0, 5);
    const totalValue = d3.sum(stocks.map((item) => item.value));

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

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", "-100 -200 200 400")
      .attr("preserveAspectRatio", "xMidYMid slice");

    // 그룹 요소 추가
    const g = svg.append("g"); // 그룹 요소 추가

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    // 원형 배치를 위한 시뮬레이션 설정
    d3.forceSimulation(topData)
      .force("charge", d3.forceManyBody().strength(10))
      .force("center", d3.forceCenter(0, 0))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.value - 20) // 충돌 반경 조정
      )
      .on("tick", ticked);

    function ticked() {
      const circles = g.selectAll<SVGCircleElement, WordData>("circle").data(topData);

      circles
        .enter()
        .append("circle")
        .attr("r", (d) => d.value / 1.25) // 원의 반지름 설정
        .style("fill", (_, i) => d3.schemeCategory10[i % 10])
        .merge(circles)
        .attr("cx", (d) => d.x!)
        .attr("cy", (d) => d.y!)
        .on("mouseover", (_event, d) => {
          const percentage = ((d.value / totalValue) * 100).toFixed(1);
          // 소수점 한 자리까지 -> toFixed
          tooltip.style("opacity", 1).html(`${d.text} : ${percentage}%`);
        })
        .on("mousemove", (event) => {
          tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      circles.exit().remove();

      const texts = g.selectAll<SVGTextElement, WordData>("text").data(topData);

      texts
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.value / 4}px`) // 텍스트 크기 4정도가 적당한 듯
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("fill", "#fff")
        .merge(texts)
        .attr("x", (d) => d.x!)
        .attr("y", (d) => d.y!)
        .text((d) => truncateText(d.text, 5)); // 5글자가 넘으면 그 나머지 글자를 버리고 ...을 붙여줌

      texts.exit().remove();
    }

    return () => {
      svg.selectAll("*").remove();
      tooltip.remove();
      document.head.removeChild(styleSheet);
    };
  }, [stocks]);

  const topData = stocks.sort((a, b) => b.value - a.value).slice(0, 7);
  const totalValue = d3.sum(stocks.map((item) => item.value));
  const otherDataValue = totalValue - d3.sum(topData.map((item) => item.value));
  const otherDataPercentage = ((otherDataValue / totalValue) * 100).toFixed(1);

  return (
    <div>
      <h1 className="text-2xl font-bold">TITLE</h1>
      <p>
        헬스케어 산업의 특징은 성장을 지속하는 것에 있습니다. 성장 모멘텀 스코어를 활용하여 수익률과 리스크를 동시에
        개선한 전략입니다.
      </p>
      <div className="flex">
        {/* Left side content */}

        <div className="w-1/2 p-4">
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

            <div className="w-1/2 p-4">
              <h2 className="text-xl font-bold">Activity</h2>

              {accountdata.map((stock, i) => (
                <div key={i} className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg shadow">
                  <div className="text-left">
                    <span className="block">{stock.stock_name}</span>
                    <span className="block">{stock.quantity}주</span>
                  </div>
                  <div className="text-right">
                    <span className="block">{stock.evlu_amt}원</span>
                    <span className={`block ${stock.evlu_pfls_rt >= 0 ? "text-red-600" : "text-blue-600"}`}>
                      {/* 손익 금액과 손익 비율 */}
                      {stock.evlu_pfls_amt}원<span>({parseFloat(stock.evlu_pfls_rt).toFixed(2)}%)</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <svg ref={svgRef}></svg>

            {topData.map((d, i) => (
              <div key={i} className="mb-2 flex items-center">
                <span style={{ color: d3.schemeCategory10[i % 10], marginRight: "5px" }}>●</span>
                {d.text} ({((d.value / totalValue) * 100).toFixed(1)}%)
              </div>
            ))}
            <div className="mb-2 flex items-center">
              <span style={{ color: "gray", marginRight: "5px" }}>●</span>그 외 ({otherDataPercentage}%)
            </div>
          </div>
        </div>
        <div className="w-1/2 p-4">
          <h2 className="text-xl font-bold">Activity</h2>
          <hr className="my-2 border-gray-300" />
          {accountdata.map((stock, i) => (
            <div key={i} className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg shadow">
              <div className="text-left">
                <span className="block">{stock.quantity}주</span>
                <span className={`block ${stock.evlu_pfls_rt >= 0 ? "text-red-600" : "text-blue-600"}`}>
                  {stock.evlu_pfls_rt >= 0 ? `+${stock.evlu_amt}원` : `-${stock.evlu_amt}원`} (
                  {parseFloat(stock.evlu_pfls_rt).toFixed(2)}%)
                </span>
              </div>
              <div className="text-right">
                <span className="block">{stock.evlu_amt}원</span>
                <span className={`block ${stock.evlu_pfls_rt >= 0 ? "text-red-600" : "text-blue-600"}`}>
                  {stock.evlu_pfls_rt >= 0 ? `+${stock.evlu_amt}원` : `-${stock.evlu_amt}원`} (
                  {parseFloat(stock.evlu_pfls_rt).toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Right side content */}
      </div>
    </div>
  );
};

export default StockList;
