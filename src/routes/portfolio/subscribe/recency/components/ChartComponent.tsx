/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";

interface ChartComponentProps {
  data: any; // 차트 데이터
  options: any; // 차트 옵션
  onElementClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  chartRef: React.RefObject<ChartJS<"bar", number[], unknown>>;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ data, options, onElementClick, chartRef }) => {
  return <Bar ref={chartRef} data={data} options={options} onClick={onElementClick} />;
};
