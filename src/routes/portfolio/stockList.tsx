/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import StockApi from "@/apis/stockAPI";
import StockChart from "./detail/StockChart";
import { Button } from "@/components/ui/button";
import TradingHistoryPopup from "./detail/TradingHistoryPopup";
import { formatNumber } from "@/lib/nums";
interface WordData extends d3.SimulationNodeDatum {
  text: string;
  value: number;
  originalValue: number;
  x?: number;
  y?: number;
}
type Props = {
  id: string;
  title: string;
};

const truncateText = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};

export default function StockList({ id, title }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [stocks, setStocks] = useState<WordData[]>([]);
  const [accountdata, setAccountdata] = useState<any[]>([]);
  const [stockList, setStockList] = useState<number[]>([]);
  const [stockNameList, setStockNameList] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShowModal = () => {
    setShowModal(true);
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
        const account_res = await service.stockJoin(id);
        const fetchedAccount = account_res;
        console.log("Fetched account data:", fetchedAccount);

        const updatedData = fetchedAccount.map((account: any) => {
          const evlu_pfls_rt = (account.evlu_pfls_amt / account.pchs_amt) * 100;

          return {
            holdings_id: account.holdings_id,
            account_id: account.account_id,
            stock_id: account.stock_id,
            market_id: account.market_id,
            hldg_qty: +account.hldg_qty,
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

        const industryMap = new Map<string, number>();
        updatedData.forEach((account: any) => {
          if (industryMap.has(account.std_idst_clsf_cd_name)) {
            industryMap.set(
              account.std_idst_clsf_cd_name,
              industryMap.get(account.std_idst_clsf_cd_name)! + account.hldg_qty
            );
          } else {
            industryMap.set(account.std_idst_clsf_cd_name, account.hldg_qty);
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
        // 각 주식의 수량을 가져오는 코드 파이차트안의 내용.
        const quantities: number[] = updatedData.map((account: any) => +account.hldg_qty);
        setStockList(quantities);

        const stockNames = updatedData.map((account: any) => account.stock_name);
        setStockNameList(stockNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAccountData();
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
    <>
      <div className="portfolio-detail-container h-full w-full">
        <div className="wrap-section flex sm:flex-row flex-col gap-6">
          <div className="section inline-block sm:w-1/2 w-full box-border sm:h-calc-100vh-minus-2rem">
            <div className="section flex flex-col h-full">
              <p className="text-lg font-bold pb-2 pl-4 ">{title}</p>
              <p className="text-lg font-medium pt-2">자산 구성</p>
              <div className="chart-wrap w-full min-h-[320px] relative">
                <StockChart stockData={stockList} stockNames={stockNameList} showLabel={false} />
              </div>
              <div
                className="holding-stock-wrap flex flex-col flex-grow overflow-hidden pb-2"
                style={{ flex: "1 1 auto" }}
              >
                <div className="flex flex-row justify-between">
                  <p className="text-lg pb-3 font-medium">보유 종목 정보</p>
                  <Button
                    className="py-1 px-2 text-sm h-7 bg-blue-100 text-blue-900 hover:bg-blue-200"
                    onClick={() => handleShowModal()}
                  >
                    거래 내역 조회
                  </Button>
                </div>
                <div className="overflow-y-auto flex-grow">
                  <div className="data-wrap">
                    {accountdata.map((stock, i) => (
                      <div key={i} className="flex justify-between items-center mb-1 p-2 px-3 border-b ">
                        <div className="text-left ">
                          <span className="block">{stock.stock_name}</span>
                          <span className="block text-sm text-zinc-600">{formatNumber(stock.hldg_qty)}주</span>
                        </div>
                        <div className="text-right">
                          <span className="block">{formatNumber(stock.evlu_amt)}원</span>
                          <span
                            className={`block text-sm ${stock.evlu_pfls_rt >= 0 ? "text-red-600" : "text-blue-600"}`}
                          >
                            {formatNumber(stock.evlu_pfls_amt)}원<span>({formatNumber(stock.evlu_pfls_rt, 2)}%)</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section inline-block sm:w-1/2 w-full box-border px-4 overflow-y-auto  pb-4 sm:h-calc-100vh-minus-2rem">
            <div className="">
              <p className="text-lg text-lg font-medium pt-2">업종별 보유정보</p>
              <div className="h-screen/2 min-h-[320px]">
                <svg ref={svgRef}></svg>
              </div>
              <div>
                {topData &&
                  topData.map((d, i) => (
                    <span key={i} className="mb-2 pr-4 text-nowrap text-sm">
                      <div
                        className="inline-block text-xs"
                        style={{ color: d3.schemeCategory10[i % 10], marginRight: "5px" }}
                      >
                        ●
                      </div>
                      {d.text}({((d.originalValue / totalOriginalValue) * 100).toFixed(1)}%)
                    </span>
                  ))}
                <span className="mb-2 pr-4 text-nowrap text-sm">
                  <div style={{ color: "gray", marginRight: "5px" }} className="inline-block text-xs">
                    ●
                  </div>
                  그 외 ({otherDataPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TradingHistoryPopup
        modalShow={showModal}
        accountId={id}
        modalClose={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}
