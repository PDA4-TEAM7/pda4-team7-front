import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const labels = ["2015-01", "2016-01", "2017-01", "2018-01", "2019-01", "2020-01", "2021-01", "2022-01"];
function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => {
        return getRandomNumber(-20, 200);
      }),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => {
        return getRandomNumber(-20, 200);
      }),
      suggestedMin: -20,
      suggestedMax: 200,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export default function Chart() {
  return (
    <div className="w-96">
      <Line data={data} />
    </div>
  );
}
