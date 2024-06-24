/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { Slider } from "@mui/material";

type Props = {
  startDate: Dayjs;
  endDate: Dayjs;
  backTestData: StockData[];
};
interface StockData {
  [key: string]: {
    [date: string]: number;
  };
}

export default function MonthlyInfo({ startDate, endDate, backTestData }: Props) {
  const [months, setMonths] = useState<Dayjs[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(startDate);
  const [showBTData, setShowBTData] = useState<StockData[]>([]);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setSelectedMonth(months[newValue as number]);
  };

  const parseDate = useCallback(
    (value: number) => {
      if (startDate) {
        return startDate.add(value, "month");
      }
    },
    [startDate]
  );

  const displayLabel = useCallback(
    (value: number) => {
      const date = parseDate(value);
      if (date) return date.format("YYYY-MM");
    },
    [parseDate]
  );

  const marks = [
    {
      value: 0,
      label: startDate?.format("YYYY-MM"),
    },
    {
      value: months.length - 1,
      label: endDate?.format("YYYY-MM"),
    },
  ];
  const labelFormatter = (value: number) => {
    return <span>{displayLabel(value)}</span>;
  };
  const formatValue = (value: number): number => {
    return Math.floor(value * 100) / 100;
  };

  useEffect(() => {
    if (!startDate) return;

    let currentMonth = startDate;
    const monthList: Dayjs[] = [];
    while (currentMonth?.isBefore(endDate, "month")) {
      monthList.push(currentMonth);
      currentMonth = currentMonth.add(1, "month");
    }
    monthList.push(currentMonth);
    setMonths(monthList);
  }, [startDate, endDate]);

  useEffect(() => {
    console.log("bac:", backTestData);
    function transformData(data: StockData[]) {
      const transformedData: StockData[] = [];

      data.forEach((item) => {
        const companyName = Object.keys(item)[0];
        const transformedItem: StockData = {};
        transformedItem[companyName] = {};

        Object.keys(item[companyName]).forEach((dateKey) => {
          const yyyyMM = dateKey.slice(0, 7); // YYYY-MM 형식으로 자르기
          transformedItem[companyName][yyyyMM] = item[companyName][dateKey];
        });

        transformedData.push(transformedItem);
      });

      return transformedData;
    }
    if (backTestData) {
      const result = transformData(backTestData);
      setShowBTData(result);
    }
  }, [backTestData]);
  return (
    <div className="monthly-data mt-12">
      <p className="text-xl pb-6">날짜 별 종목 성과</p>
      <p>{`${startDate.year()}년 ${startDate.month() + 1}월 ~ ${endDate.year()}년 ${endDate.month() + 1}월`}</p>
      <br />
      <div className="range-wrap px-4 pt-4">
        <Slider
          aria-label="Date"
          value={months.findIndex((month) => month.isSame(selectedMonth, "month"))}
          onChange={handleChange}
          marks={marks}
          min={0}
          max={months.length - 1}
          valueLabelDisplay="on"
          valueLabelFormat={labelFormatter}
        />
      </div>
      <div>{}</div>
      <div className="monthly-stock-data">
        <div className="stock-data-item">
          {showBTData.map((item, i) => {
            const key = Object.keys(item)[0];
            const value = item[key][selectedMonth.format("YYYY-MM")] - 1;
            console.log("value:", value);
            return (
              <div key={i} className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg shadow">
                <div></div>
                <div className="text-left">
                  <span className="block">{key}</span>
                  <span className="block"></span>
                  <span className={`block `}>{}</span>
                </div>
                <div className="text-right">
                  {/* 내림해서 보여줍니다. */}
                  <span className={`block ${formatValue(value) >= 0 ? "text-red-600" : "text-blue-600"}`}>
                    {formatValue(value).toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
