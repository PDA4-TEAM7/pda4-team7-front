/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pie } from "react-chartjs-2";
import { Chart, ChartData } from "chart.js/auto";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { useEffect, useState } from "react";

Chart.register(ChartDataLabels);
type Props = {
  stockData: number[];
  stockNames: string[];
};

export default function StockChart({ stockData, stockNames }: Props) {
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
        ],
        borderWidth: 1,
      },
    ],
  });

  const isNumber = (value: any): value is number => typeof value === "number";

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
  return <Pie data={piedata} options={options} width={"100%"} height={"auto"} />;
}
