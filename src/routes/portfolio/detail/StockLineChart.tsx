import { LineChart } from "@mui/x-charts";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface IBackTestData {
  [key: string]: {
    //date
    [date: string]: number; //0.999..
  };
}
type Props = {
  backTestData: IBackTestData;
};
export default function StockLineChart({ backTestData }: Props) {
  const [btDate, setBtDate] = useState<Date[]>([]);
  const [rate, setRate] = useState<number[]>([]);
  useEffect(() => {
    console.log("back:", backTestData);
    if (!backTestData) return;
    // 배열 선언
    const keys: Date[] = [];
    const values: number[] = [];

    // 객체 순회
    for (const [key, value] of Object.entries(backTestData)) {
      keys.push(new Date(key));
      values.push(Number(value) - 1);
    }

    setBtDate(keys);
    setRate(values);
  }, [backTestData]);

  return (
    <div className="">
      <LineChart
        xAxis={[
          {
            label: "Date",
            data: btDate,
            tickInterval: btDate,
            scaleType: "time",
            valueFormatter: (date) => dayjs(date).format("MMM D"),
          },
        ]}
        series={[{ label: "내 투자", data: rate }]}
        height={400}
      />
    </div>
  );
}
