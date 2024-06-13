import React from "react";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Subscribe from "../../assets/subscribe.png";

export default function mainPortfolio() {
  const portfolioData = [
    {
      id: 1,
      title: "헬스케어 성장 집중 전략",
      description:
        "헬스케어 산업의 성장을 집중 공략하는 전략입니다. 성장 모멘텀을 고려한 종목 선정과 리스크를 최소화 하는 전략을 설명합니다.",
      username: "얼굴을",
      time: "20 min",
      totalAsset: "$111,483.87",
      profitLoss: "+9.24%",
      loss: "($10,981)",
    },
    {
      id: 2,
      title: "헬스케어 성장 집중 전략",
      description:
        "헬스케어 산업의 성장을 집중 공략하는 전략입니다. 성장 모멘텀을 고려한 종목 선정과 리스크를 최소화 하는 전략을 설명합니다.",
      username: "얼굴을",
      time: "20 min",
      totalAsset: "$111,483.87",
      profitLoss: "+9.24%",
      loss: "($10,981)",
    },
    {
      id: 3,
      title: "헬스케어 성장 집중 전략",
      description:
        "헬스케어 산업의 성장을 집중 공략하는 전략입니다. 성장 모멘텀을 고려한 종목 선정과 리스크를 최소화 하는 전략을 설명합니다.",
      username: "얼굴을",
      time: "20 min",
      totalAsset: "$111,483.87",
      profitLoss: "+9.24%",
      loss: "($10,981)",
    },
    {
      id: 4,
      title: "헬스케어 성장 집중 전략",
      description:
        "헬스케어 산업의 성장을 집중 공략하는 전략입니다. 성장 모멘텀을 고려한 종목 선정과 리스크를 최소화 하는 전략을 설명합니다.",
      username: "얼굴을",
      time: "20 min",
      totalAsset: "$111,483.87",
      profitLoss: "+9.24%",
      loss: "($10,981)",
    },
    {
      id: 5,
      title: "헬스케어 성장 집중 전략",
      description:
        "헬스케어 산업의 성장을 집중 공략하는 전략입니다. 성장 모멘텀을 고려한 종목 선정과 리스크를 최소화 하는 전략을 설명합니다.",
      username: "얼굴을",
      time: "20 min",
      totalAsset: "$111,483.87",
      profitLoss: "+9.24%",
      loss: "($10,981)",
    },
    {
      id: 6,
      title: "헬스케어 성장 집중 전략",
      description:
        "헬스케어 산업의 성장을 집중 공략하는 전략입니다. 성장 모멘텀을 고려한 종목 선정과 리스크를 최소화 하는 전략을 설명합니다.",
      username: "얼굴을",
      time: "20 min",
      totalAsset: "$111,483.87",
      profitLoss: "+9.24%",
      loss: "($10,981)",
    },

    // 추가 데이터는 삽입
  ];
  const data = {
    labels: ["에코프로", "에코프로비엠", "POSCO홀딩스", "코스모신소재", "LG화학", "삼성전자"],
    datasets: [
      {
        label: "비율",
        data: [44.4, 33.6, 8, 7.1, 4.6, 2],
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
  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b bg-gray-100">
        <div className="flex items-center">
          <input type="text" placeholder="원하는 포트폴리오를 검색" className="p-2 border rounded-l-md" />
          <button className="p-2 bg-gray-300 border rounded-r-md">
            <img src="search-icon.png" alt="검색" className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center">
          <img src="" alt="알림" className="w-5 h-5 mx-2" />
          <img src="settings-icon.png" alt="설정" className="w-5 h-5 mx-2" />
          <span className="mx-2">ENG</span>
        </div>
      </header>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Stock Portfolio</h1>
        <div className="grid grid-cols-3 gap-4">
          {portfolioData.map((item) => (
            <div key={item.id} className="border p-4 rounded-md">
              <div className="flex">
                <div className="w-1/2">
                  <Pie
                    data={data}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="w-1/2 pl-4 flex flex-col justify-center">
                  <div>
                    <p className="font-bold">총 자산: {item.totalAsset}</p>
                    <p className="font-bold">수익률: {item.profitLoss}</p>
                    <p className="text-red-500">{item.loss}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold">{item.title}</h3>
                <p>{item.description}</p>
                <div className="mt-4">
                  <span className="text-base text-gray-500">업데이트 {item.time} 전</span>
                  <div className="flex items-center mt-2">
                    <img src="" alt="프로필 이미지" className="w-6 h-6 rounded-full mr-2" />
                    <span className="text-base text-gray-500">
                      {/* {item.username} */}
                      임찬솔
                    </span>
                    <div className="flex items-center ml-auto">
                      <img src={Subscribe} alt="구독자 아이콘" className="w-6 h-6 mr-1" />
                      <span className="text-base text-gray-500">구독자 수</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
