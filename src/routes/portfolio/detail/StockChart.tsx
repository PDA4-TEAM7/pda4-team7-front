/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pie } from "react-chartjs-2";
import { Chart, ChartData, LegendItem } from "chart.js/auto";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { useEffect, useState } from "react";

Chart.register(ChartDataLabels);
type Props = {
  stockData: number[];
  stockNames: string[];
  showLabel: boolean;
};

export default function StockChart({ stockData, stockNames, showLabel = true }: Props) {
  const [piedata, setPiedata] = useState<ChartData<"pie">>({
    // 파이차트에 대한 변수
    labels: [],
    datasets: [
      {
        label: "보유 수량: ",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(255, 99, 132, 0.65)",
          "rgba(54, 162, 235, 0.65)",
          "rgba(255, 206, 86, 0.65)",
          "rgba(75, 192, 192, 0.65)",
          "rgba(153, 102, 255, 0.65)",
          "rgba(255, 159, 64, 0.65)",
          "rgba(255, 99, 132, 0.55)",
          "rgba(54, 162, 235, 0.55)",
          "rgba(255, 206, 86, 0.55)",
          "rgba(75, 192, 192, 0.55)",
          "rgba(153, 102, 255, 0.55)",
          "rgba(255, 159, 64, 0.55)",
          "rgba(255, 99, 132, 0.45)",
          "rgba(54, 162, 235, 0.45)",
          "rgba(255, 206, 86, 0.45)",
          "rgba(75, 192, 192, 0.45)",
          "rgba(153, 102, 255, 0.45)",
          "rgba(255, 159, 64, 0.45)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const isNumber = (value: any): value is number => typeof value === "number";

  //그냥 값을 넣으면 string이라는 이유로 typeerror가 떠서 타입을 한번 지정해서 넣어줬습니다.
  const position: "bottom" | "top" = "bottom";
  const options = {
    maintainAspectRatio: false,
    responsive: true,

    plugins: {
      datalabels: {
        formatter: (value: number, context: Context) => {
          const data = context.chart.data.datasets[0].data;
          const numericData = data.filter(isNumber) as number[];
          const total: number = numericData.reduce((acc, curr) => acc + curr, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
        color: "#fff",
        font: {
          weight: 500,
        },
      },
      legend: {
        display: false,
        position: position,
        labels: {
          font: {
            size: 12,
          },
          padding: 12,
          generateLabels: (chart: any) => {
            const data = chart.data.datasets[0].data;
            const labels = chart.data.labels || [];
            return labels.map((label: string, index: number) => {
              const value = data[index];
              const numericData = data.filter(isNumber) as number[];
              const total = numericData.reduce((acc, curr) => acc + curr, 0);
              const percentage = total !== 0 ? (((value as number) / total) * 100).toFixed(2) : "0.00";
              return {
                // value 는 보유 개수인데 안보여주도록 했습니다.
                text: `${label}: ${percentage}%`,
                fillStyle: chart.data.datasets[0].backgroundColor[index],
                hidden: false,
                lineCap: "butt",
                lineDash: [],
                lineDashOffset: 0,
                lineJoin: "miter",
                lineWidth: 1,
                strokeStyle: "#fff",
                pointStyle: "circle",
                rotation: 0,
              } as LegendItem;
            });
          },
        },
      },
    },
  };

  useEffect(() => {
    setPiedata({
      labels: stockNames,
      datasets: [
        {
          ...piedata.datasets[0],
          data: stockData,
        },
      ],
    });
  }, [stockNames, stockData]);

  return (
    <>
      <div className="h-screen/2 min-h-[320px] px-10">
        <Pie data={piedata} options={options} width={"100%"} height={"auto"} />
      </div>
      <div className="legend-container mt-4">
        {showLabel &&
          piedata.datasets &&
          piedata.labels?.map((label: any, index) => (
            <span key={index} className="legend-item items-center pr-4 text-nowrap text-sm">
              <div
                className="legend-color-box w-2 h-2 inline-block mr-2"
                style={{ backgroundColor: piedata.datasets[0].backgroundColor[index] }}
              ></div>
              {label}: {((stockData[index] / stockData.reduce((acc, val) => acc + val, 0)) * 100).toFixed(2)}%
            </span>
          ))}
      </div>
    </>
  );
}
