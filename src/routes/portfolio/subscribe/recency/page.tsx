import React, { useState, useRef, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Prev from "@/assets/icon-back-white.png";
import TransactionCard from "./components/transactionCard";
import { ChartComponent } from "./components/ChartComponent";
import { DetailPanel, SelectedItem } from "./components/detailPanel";
import { TooltipProvider } from "@/components/ui/tooltip";
import RecencyAPI from "@/apis/recencyAPI";
// Chart.js 라이브러리에 필요한 구성 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GroupData {
  group: string;
  value: number;
}

const createChartData = (data: GroupData[], isIndustry: boolean) => {
  const topData = [...data].sort((a, b) => b.value - a.value).slice(0, 5);
  return {
    labels: topData.map((item) => item.group),
    datasets: [
      {
        label: isIndustry ? "종목 수" : "투자자 수",
        data: topData.map((item) => item.value),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        barThickness: 40,
      },
    ],
  };
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "산업 / 종목",
      },
      grid: {
        offset: true,
      },
    },
    y: {
      title: {
        display: true,
        text: "종목 / 투자자",
      },
    },
  },
};
export default function SubscribePortfolioRecency() {
  const [selectedChart, setSelectedChart] = useState<string>("investIdstTop5");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const navigate = useNavigate();
  const [investIdstTop5, setInvestIdstTop5] = useState([]);
  const [investStockTop5, setInvestStockTop5] = useState([]);

  useEffect(() => {
    const fetchTop5 = async () => {
      const recencyAPI = new RecencyAPI();
      const respIdst = await recencyAPI.getInvestIdstTop5();
      setInvestIdstTop5(respIdst);
      const respStock = await recencyAPI.getInvestStockTop5();
      setInvestStockTop5(respStock);
    };
    fetchTop5();
  }, []);

  // Chart 인스턴스에 대한 참조를 저장하기 위해 useRef를 사용하고, 타입을 Chart로 지정
  const chartRef = useRef<ChartJS<"bar", number[], unknown> | null>(null);

  const handleSubPortfolioClick = () => navigate("/portfolio/subscribe");
  const handleElementClick = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;

    const nativeEvent = event.nativeEvent as Event;
    const elements = chartRef.current.getElementsAtEventForMode(nativeEvent, "nearest", { intersect: true }, false);
    if (elements.length === 0) return;

    const firstElement = elements[0];
    const labels = chartRef.current.data.labels;
    if (!labels || firstElement.index >= labels.length) {
      console.error("No label found at the clicked index");
      return;
    }

    const group = labels[firstElement.index];
    if (typeof group !== "string") {
      console.error("Invalid label type");
      return;
    }

    const recencyAPI = new RecencyAPI();
    try {
      let detailData;
      if (selectedChart === "investIdstTop5") {
        detailData = await recencyAPI.getStockListByIdst(group);
      } else if (selectedChart === "investStockTop5") {
        detailData = await recencyAPI.getStockDetailListByStock(group);
        console.log(detailData);
      }

      if (!detailData) {
        console.error("No data returned for this group");
        return;
      }

      setSelectedItem({
        group,
        value: chartRef.current.data.datasets[0].data[firstElement.index] as number,
        details: detailData, // API로부터 받은 데이터를 사용
      });
    } catch (error) {
      console.error("Failed to fetch detail data:", error);
    }
  };

  const handleChartChange = (chart: string) => {
    setSelectedChart(chart);
    setSelectedItem(null);
  };

  const chartData = selectedChart === "investIdstTop5" ? investIdstTop5 : investStockTop5;

  return (
    <div className="flex flex-col h-full">
      <main className="p-4">
        <div className="flex items-center mb-4 justify-between">
          <h1 className="text-2xl font-bold">구독한 포트폴리오 종합 분석 및 최근 변화</h1>
          <Button
            className="text-l focus:outline-none px-8 bg-indigo-500 m-2 p-3 rounded-lg text-white hover:bg-indigo-400"
            onClick={handleSubPortfolioClick}
          >
            <img src={Prev} alt="이전으로" className="w-6 h-6 ml-1" />
            이전으로
          </Button>
        </div>
        <div className="text-shadow-strong text-xl font-bold p-2">산업 및 종목별 투자 TOP5</div>
        <div className="flex justify-center mb-4 space-x-4">
          {/* 수정된 부분 */}
          <Button
            className={`text-l focus:outline-none px-8 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400 ${
              selectedChart === "investIdstTop5" ? "bg-indigo-700" : "bg-indigo-500"
            }`}
            onClick={() => handleChartChange("investIdstTop5")}
          >
            산업별 투자
          </Button>
          <Button
            className={`text-l focus:outline-none px-8 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400 ${
              selectedChart === "investStockTop5" ? "bg-indigo-700" : "bg-indigo-500"
            }`}
            onClick={() => handleChartChange("investStockTop5")}
          >
            종목별 투자
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 ">
          <div className="col-span-1 border rounded-lg border-gray-300">
            <ChartComponent
              data={createChartData(chartData, selectedChart === "investIdstTop5")}
              options={options}
              onElementClick={handleElementClick}
              chartRef={chartRef}
            />
          </div>
          <DetailPanel selectedItem={selectedItem} selectedChart={selectedChart} />
        </div>
        <div className="mt-10 mb-3">
          <TooltipProvider>
            <TransactionCard />
          </TooltipProvider>
        </div>
      </main>
    </div>
  );
}
