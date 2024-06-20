import React, { useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Prev from "@/assets/icon-back-white.png";

// Chart.js 라이브러리에 필요한 구성 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
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
    },
    y: {
      title: {
        display: true,
        text: "Value",
      },
    },
  },
};

const createChartData = (data) => ({
  labels: data.map((item) => item.group),
  datasets: [
    {
      label: "Values",
      data: data.map((item) => item.value),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
});

const data1 = [
  { group: "반도체", value: 124 },
  { group: "금융", value: 55 },
  { group: "자동차", value: 45 },
];

const data2 = [
  { group: "SK하이닉스", value: 9 },
  { group: "삼성전자", value: 8 },
  { group: "신한지주", value: 5 },
];

const detailedData = {
  반도체: [
    { stock: "SK하이닉스", value: 9 },
    { stock: "삼성전자", value: 8 },
  ],
  금융: [{ stock: "신한지주", value: 5 }],
  자동차: [
    { stock: "현대차", value: 10 },
    { stock: "기아차", value: 8 },
  ],
};

export default function SubscribePortfolioRecency() {
  const [selectedChart, setSelectedChart] = useState("data1");
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const handleSubPortfolioClick = () => navigate("/portfolio/subscribe");

  const handleElementClick = (event) => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    const elements = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, false);
    if (elements.length > 0) {
      const firstElement = elements[0];
      const group = chart.data.labels[firstElement.index];
      setSelectedItem({
        group,
        value: chart.data.datasets[0].data[firstElement.index],
        details: detailedData[group] || [],
      });
    }
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">구독한 포트폴리오의 최근 변화</h1>
          <Button
            className="text-l focus:outline-none px-8 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
            onClick={handleSubPortfolioClick}
          >
            <img src={Prev} alt="이전으로" className="w-6 h-6 mr-1" />
            이전으로
          </Button>
        </div>
        <div className="mb-4 flex space-x-4">
          <Button
            className={`text-l focus:outline-none px-8 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400 ${
              selectedChart === "data1" ? "bg-indigo-700" : "bg-indigo-500"
            }`}
            onClick={() => setSelectedChart("data1")}
          >
            산업별 투자
          </Button>
          <Button
            className={`text-l focus:outline-none px-8 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400 ${
              selectedChart === "data2" ? "bg-indigo-700" : "bg-indigo-500"
            }`}
            onClick={() => setSelectedChart("data2")}
          >
            종목별 투자
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Bar ref={chartRef} options={options} data={createChartData(chartData)} onClick={handleElementClick} />
          </div>
          <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-300 overflow-auto">
            {selectedItem ? (
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedItem.group}</h2>
                <ul>
                  {selectedItem.details.map((detail, index) => (
                    <li key={index} className="mb-1">
                      {detail.stock}: {detail.value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>막대를 클릭하여 상세 정보를 확인하세요</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
