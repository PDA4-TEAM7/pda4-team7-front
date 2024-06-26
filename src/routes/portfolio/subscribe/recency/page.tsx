import React, { useState, useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Prev from "@/assets/icon-back-white.png";
import TransactionCard from "./components/transactionCard";
import { ChartComponent } from "./components/ChartComponent";
import { DetailPanel } from "./components/detailPanel";
import { TooltipProvider } from "@/components/ui/tooltip";
// Chart.js 라이브러리에 필요한 구성 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GroupData {
  group: string;
  value: number;
}

interface DetailData {
  stock?: string;
  value?: number;
  investor?: string;
  shares?: number;
  profit?: number;
  rate?: number;
}

interface DetailedData {
  [key: string]: DetailData[];
}

interface SelectedItem {
  group: string;
  value: number;
  details: DetailData[];
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
        text: "Group",
      },
      grid: {
        offset: true,
      },
    },
    y: {
      title: {
        display: true,
        text: "Value",
      },
    },
  },
};
export default function SubscribePortfolioRecency() {
  const [selectedChart, setSelectedChart] = useState<string>("data1");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const navigate = useNavigate();
  // Chart 인스턴스에 대한 참조를 저장하기 위해 useRef를 사용하고, 타입을 Chart로 지정
  const chartRef = useRef<ChartJS<"bar", number[], unknown> | null>(null);

  const handleSubPortfolioClick = () => navigate("/portfolio/subscribe");

  const handleElementClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    // Chart 인스턴스에서 getElementsAtEventForMode 메소드를 안전하게 호출
    const nativeEvent = event.nativeEvent as Event;
    const elements = chartRef.current.getElementsAtEventForMode(nativeEvent, "nearest", { intersect: true }, false);
    if (elements.length > 0) {
      const firstElement = elements[0];
      // labels 배열과 해당 인덱스의 라벨이 존재하는지 확인
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
      setSelectedItem({
        group,
        value: chartRef.current.data.datasets[0].data[firstElement.index] as number,
        details: selectedChart === "data1" ? detailedData[group] || [] : investorData[group] || [],
      });
    }
  };

  const handleChartChange = (chart: string) => {
    setSelectedChart(chart);
    setSelectedItem(null);
  };

  // 예시 데이터
  const data1: GroupData[] = [
    { group: "반도체", value: 2 },
    { group: "금융", value: 1 },
    { group: "자동차", value: 2 },
    { group: "화학", value: 1 },
    { group: "조선", value: 2 },
  ];

  const data2: GroupData[] = [
    { group: "SK하이닉스", value: 3 },
    { group: "삼성전자", value: 2 },
    { group: "신한지주", value: 1 },
    { group: "현대차", value: 2 },
    { group: "NAVER", value: 1 },
  ];

  const detailedData: DetailedData = {
    반도체: [
      { stock: "SK하이닉스", value: 9 },
      { stock: "삼성전자", value: 8 },
    ],
    금융: [{ stock: "신한지주", value: 5 }],
    자동차: [
      { stock: "현대차", value: 10 },
      { stock: "기아차", value: 8 },
    ],
    화학: [
      { stock: "LG화학", value: 7 },
      { stock: "롯데케미칼", value: 4 },
    ],
    조선: [
      { stock: "현대중공업", value: 5 },
      { stock: "대우조선해양", value: 6 },
    ],
  };

  const investorData: DetailedData = {
    SK하이닉스: [
      { investor: "오수연", shares: 120, profit: 100000, rate: 5.0 },
      { investor: "임찬솔", shares: 50, profit: 40000, rate: 3.5 },
    ],
    삼성전자: [
      { investor: "박소연", shares: 200, profit: 150000, rate: 6.0 },
      { investor: "장호익", shares: 80, profit: 70000, rate: 4.5 },
    ],
    신한지주: [{ investor: "오수연", shares: 70, profit: 30000, rate: 2.5 }],
    현대차: [
      { investor: "오수연", shares: 95, profit: 50000, rate: 3.0 },
      { investor: "임찬솔", shares: 40, profit: 20000, rate: 2.0 },
    ],
    NAVER: [
      { investor: "장호익", shares: 30, profit: 15000, rate: 1.5 },
      { investor: "박소연", shares: 45, profit: 22000, rate: 2.3 },
    ],
  };
  const chartData = selectedChart === "data1" ? data1 : data2;

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-center p-4 border-b bg-gray-100">
        <div></div>
        <div className="flex items-center">
          <img src="" alt="알림" className="w-5 h-5 mx-2" />
          <img src="settings-icon.png" alt="설정" className="w-5 h-5 mx-2" />
          <span className="mx-2">ENG</span>
        </div>
      </header>
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
          {" "}
          {/* 수정된 부분 */}
          <Button
            className={`text-l focus:outline-none px-8 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400 ${
              selectedChart === "data1" ? "bg-indigo-700" : "bg-indigo-500"
            }`}
            onClick={() => handleChartChange("data1")}
          >
            산업별 투자
          </Button>
          <Button
            className={`text-l focus:outline-none px-8 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400 ${
              selectedChart === "data2" ? "bg-indigo-700" : "bg-indigo-500"
            }`}
            onClick={() => handleChartChange("data2")}
          >
            종목별 투자
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 ">
          <div className="col-span-1 border rounded-lg border-gray-300">
            <ChartComponent
              data={createChartData(chartData, selectedChart === "data1")}
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
