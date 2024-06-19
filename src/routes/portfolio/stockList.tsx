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
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

// StockList 컴포넌트 정의
const StockList: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // SVG 요소에 대한 참조를 생성
  const [stocks, setStocks] = useState<WordData[]>([]); // 워드 클라우드 변수
  const [accountdata, setAccountdata] = useState([]); // stock_in_account 컬럼 값 저장
  const [stockdata, setStockdata] = useState({
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

  const { id } = useParams(); // 포트폴리오 ID값 가져오기

  // console.log(id);
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const account_res = await axios.post("http://localhost:3000/api/stockjoin");
        const fetchedAccount = account_res.data;

        const updatedAccountData = fetchedAccount
          .filter((account) => {
            // console.log("Comparing", account.stock_id, "with", Number(id));
            return account.account_id === Number(id);
          })
          .map((account) => {
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

        setAccountdata(updatedAccountData);
        // 주식 보유 수가 아닌 비율로 구성
        const stockrate = updatedAccountData.reduce((sum, account) => sum + account.quantity, 0);

        const updatedStocks = updatedAccountData.map((account) => {
          return {
            text: account.std_idst_clsf_cd_name,
            value: (account.quantity / stockrate) * 100,
          };
        });

        setStocks(updatedStocks);

        // 파이차트
        // 각 주식의 수량을 가져오는 코드
        const quantities = updatedAccountData.map((account) => account.quantity);

        // 주식 이름을 찾는 코드
        const stockNames = updatedAccountData.map((account) => account.stock_name);

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
      .attr("viewBox", "-350 -200 700 400")
      .attr("preserveAspectRatio", "xMidYMid slice");

    const g = svg.append("g");

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    const simulation = d3
      .forceSimulation(topData)
      .force("charge", d3.forceManyBody().strength(10))
      .force("center", d3.forceCenter(0, 0))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.value - 20)
      )
      .on("tick", ticked);

    function ticked() {
      const circles = g.selectAll("circle").data(topData);

      circles
        .enter()
        .append("circle")
        .attr("r", (d) => d.value / 1.25)
        .style("fill", (d, i) => d3.schemeCategory10[i % 10])
        .merge(circles)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .on("mouseover", (event, d) => {
          const percentage = ((d.value / totalValue) * 100).toFixed(1);
          tooltip.style("opacity", 1).html(`${d.text} : ${percentage}%`);
        })
        .on("mousemove", (event, d) => {
          tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      circles.exit().remove();

      const texts = g.selectAll("text").data(topData);

      texts
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.value / 4}px`)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("fill", "#fff")
        .merge(texts)
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .text((d) => truncateText(d.text, 5));

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
        {/* <div>
          {stockname.map((stock, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stock.color }}></div>
              <span>{stock}</span>
            </div>
          ))}
        </div> */}
        <div>
          {accountdata.map((stock, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>{stock.stock_name}</div>
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

export default StockList;
