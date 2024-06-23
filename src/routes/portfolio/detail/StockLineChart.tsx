import { LineChart } from "@mui/x-charts";
import dayjs from "dayjs";

const xAxisData = [
  new Date("2023-12-04"),
  new Date("2023-12-05"),
  new Date("2023-12-06"),
  new Date("2023-12-07"),
  new Date("2023-12-08"),
  new Date("2023-12-09"),
  new Date("2023-12-10"),
];
const seriesData = [
  [-0.000113, 0.037, 0.056, 0.088, 0.091, 0.1233, 0.1133],
  [0.000113, 0.017, 0.026, 0.088, 0.191, 0.1293, 0.2133],
];

export default function StockLineChart() {
  return (
    <div className="">
      <LineChart
        xAxis={[
          {
            label: "Date",
            data: xAxisData,
            tickInterval: xAxisData,
            scaleType: "time",
            valueFormatter: (date) => dayjs(date).format("MMM D"),
          },
        ]}
        yAxis={[]}
        series={[
          { label: "내 투자", data: seriesData[0] },
          { label: "U.S 500", data: seriesData[1] },
        ]}
        height={400}
      />
    </div>
  );
}
