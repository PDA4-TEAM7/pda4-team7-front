import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import sellButton from "../../../public/img/sell_button.png";
import buyButton from "../../../public/img/buy_button.png";

interface WordData extends d3.SimulationNodeDatum {
  text: string;
  value: number;
  originalValue: number;
  x?: number;
  y?: number;
}

const truncateText = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};

const StockList: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // 워드 클라우드 출력 이미지
  const [stocks, setStocks] = useState<WordData[]>([]); // 워드클라우드 데이터 값 저장
  const [accountdata, setAccountdata] = useState<any[]>([]); // 내 계좌에 주식 데이터 값 저장
  const [tradinghistory, setTradinghistory] = useState([]);
  const [stockdata, setStockdata] = useState<any>({
    // PIE 차트에 데이터 값 저장
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

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const account_res = await axios.post("http://localhost:3000/api/stockjoin", { account_id: id });
        const fetchedAccount = account_res.data;

        const updatedData = fetchedAccount
          .filter((account: any) => {
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

        const industryMap = new Map<string, number>();
        updatedData.forEach((account: any) => {
          if (industryMap.has(account.std_idst_clsf_cd_name)) {
            industryMap.set(
              account.std_idst_clsf_cd_name,
              industryMap.get(account.std_idst_clsf_cd_name)! + account.quantity
            );
          } else {
            industryMap.set(account.std_idst_clsf_cd_name, account.quantity);
          }
        });

        const totalQuantity = Array.from(industryMap.values()).reduce((sum, quantity) => sum + quantity, 0);
        const fixedValues = [50, 30, 25, 20, 15];

        const sortedIndustries = Array.from(industryMap.entries()).sort((a, b) => b[1] - a[1]);

        const updatedStocks = sortedIndustries.map(([key, value], index) => {
          const fixedValue = fixedValues[index % fixedValues.length];
          return {
            text: key,
            value: fixedValue,
            originalValue: (value / totalQuantity) * 100,
            x: 0,
            y: 0,
          };
        });

        setStocks(updatedStocks);

        const quantities = updatedData.map((account: any) => account.quantity);

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

  // tradingHistory 가져오기
  useEffect(() => {
    const fetchTradingData = async () => {
      try {
        const trading_res = await axios.post("http://localhost:3000/api/tradinghistory", { account_id: id });
        const fetchedTrading = trading_res.data;

        const updatedData = fetchedTrading
          .filter((trading: any) => {
            return trading.account_id === Number(id);
          })
          .map((trading: any) => {
            const evlu_pfls_amt = trading.tot_ccld_amt - trading.stockaccount.pchs_amt;
            // 손익

            console.log(evlu_pfls_amt);

            const evlu_pfls_rt = (evlu_pfls_amt / trading.stockaccount.tot_ccld_amt) * 100;
            // 손익률

            return {
              pchs_amt: trading.pchs_amt,
              evlu_pfls_amt: evlu_pfls_amt, // 총체결금액 - 매입금액

              trading_id: trading.trading_id,
              account_id: trading.account_id,
              stock_id: trading.stock_id,
              sll_buy_dvsn_cd: trading.sll_buy_dvsn_cd,
              trade_dt: trading.trade_dt,
              tot_ccld_qty: trading.tot_ccld_qty,
              tot_ccld_amt: trading.tot_ccld_amt,
              evlu_pfls_rt: evlu_pfls_rt, // 손익율 계산
            };
          });

        setTradinghistory(updatedData);
      } catch {
        console.log("Trading History가 제대로 불러와지지 않았습니다.");
      }
    };

    fetchTradingData();
  }, [id]);

  useEffect(() => {
    if (stocks.length === 0) return;

    const topData = stocks.sort((a, b) => b.originalValue - a.originalValue).slice(0, 5);
    const totalValue = d3.sum(topData.map((item) => item.originalValue));

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
      .attr("viewBox", "-100 -100 200 200")
      .attr("preserveAspectRatio", "xMidYMid slice");

    const g = svg.append("g");

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    d3.forceSimulation(topData)
      .force("charge", d3.forceManyBody().strength(10))
      .force("center", d3.forceCenter(0, 0))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.value - 10)
      )
      .on("tick", ticked);

    function ticked() {
      const circles = g.selectAll<SVGCircleElement, WordData>("circle").data(topData);

      circles
        .enter()
        .append("circle")
        .attr("r", (d) => d.value / 1.5)
        .style("fill", (_, i) => d3.schemeCategory10[i % 10])
        .merge(circles)
        .attr("cx", (d) => d.x!)
        .attr("cy", (d) => d.y!)
        .on("mouseover", (_event, d) => {
          const percentage = ((d.originalValue / totalValue) * 100).toFixed(1);
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
        .style("font-size", (d) => `${d.value / 4}px`)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("fill", "#fff")
        .merge(texts)
        .attr("x", (d) => d.x!)
        .attr("y", (d) => d.y!)
        .text((d) => truncateText(d.text, 5));

      texts.exit().remove();
    }

    return () => {
      svg.selectAll("*").remove();
      tooltip.remove();
      document.head.removeChild(styleSheet);
    };
  }, [stocks]);

  const topData = stocks.sort((a, b) => b.originalValue - a.originalValue).slice(0, 5);
  const totalOriginalValue = d3.sum(topData.map((item) => item.originalValue));
  const otherDataOriginalValue = totalOriginalValue - d3.sum(topData.map((item) => item.originalValue));
  const otherDataPercentage = ((otherDataOriginalValue / totalOriginalValue) * 100).toFixed(1);

  return (
    <div>
      <h1 className="text-2xl font-bold">TITLE</h1>
      <p>
        헬스케어 산업의 특징은 성장을 지속하는 것에 있습니다. 성장 모멘텀 스코어를 활용하여 수익률과 리스크를 동시에
        개선한 전략입니다.
      </p>
      <div className="flex">
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
            {accountdata.map((stock, i) => (
              <div key={i} className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg shadow">
                <div className="text-left">
                  <span className="block">{stock.stock_name}</span>
                  <span className="block">{stock.quantity}주</span>
                </div>
                <div className="text-right">
                  <span className="block">{stock.evlu_amt}원</span>
                  <span className={`block ${stock.evlu_pfls_rt >= 0 ? "text-red-600" : "text-blue-600"}`}>
                    {stock.evlu_pfls_amt}원<span>({parseFloat(stock.evlu_pfls_rt).toFixed(2)}%)</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col items-center">
            <svg ref={svgRef}></svg>
            <div className="mt-2">
              {topData.map((d, i) => (
                <div key={i} className="mb-2 flex items-center justify-start">
                  <span style={{ color: d3.schemeCategory10[i % 10], marginRight: "5px" }}>●</span>
                  <span className="inline-block w-24">{d.text}</span>
                  <span>({((d.originalValue / totalOriginalValue) * 100).toFixed(1)}%)</span>
                </div>
              ))}
              <div className="mb-2 flex items-center justify-start">
                <span style={{ color: "gray", marginRight: "5px" }}>●</span>
                <span className="inline-block w-24">그 외</span>
                <span>({otherDataPercentage}%)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 p-4">
          <h2 className="text-xl font-bold">거래내역</h2>
          <hr className="my-2 border-gray-300" />
          {tradinghistory.map((stock, i) => {
            const matchedStock = accountdata.find((item) => item.stock_id === stock.stock_id);

            console.log(matchedStock);
            return (
              <div key={i} className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg shadow">
                <div>
                  {Number(stock.sll_buy_dvsn_cd) === 1 ? (
                    <img src={sellButton} alt="Sell" className="w-8 h-8 ml-4" />
                  ) : (
                    <img src={buyButton} alt="Buy" className="w-8 h-8 ml-4" />
                  )}
                </div>
                <div className="text-left">
                  <span className="block">{matchedStock ? matchedStock.stock_name : "Unknown"}</span>
                  <span className="block">
                    {stock.tot_ccld_qty}주 {Number(stock.sll_buy_dvsn_cd) === 1 ? <span>판매</span> : <span>구매</span>}
                  </span>
                  <span className={`block ${stock.evlu_pfls_rt >= 0 ? "text-red-600" : "text-blue-600"}`}>
                    {stock.tot_ccld_amt}원
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StockList;
