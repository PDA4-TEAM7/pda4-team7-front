import React from "react";

interface DetailData {
  stock?: string;
  value?: number;
  investor?: string;
  shares?: number;
  profit?: number;
  rate?: number;
}

interface SelectedItem {
  group: string;
  value: number;
  details: DetailData[];
}

interface DetailPanelProps {
  selectedItem: SelectedItem | null;
  selectedChart: string;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ selectedItem, selectedChart }) => {
  if (!selectedItem) {
    return <p>막대를 클릭하여 상세 정보를 확인하세요.</p>;
  }

  return (
    <div className="col-span-1 bg-white p-4 border border-gray-300 rounded-lg overflow-auto">
      <h2 className="text-xl font-bold mb-2">{selectedItem.group}</h2>
      <ul>
        {selectedItem.details.map((detail, index) => {
          if (selectedChart === "investIdstTop5") {
            return (
              <li key={index} className="mb-1">
                {detail.stock}: {detail.value}명
              </li>
            );
          } else {
            return (
              <li key={index} className="mb-1">
                {detail.investor}: {detail.shares}주, 손익금액: {detail.profit}, 손익률: {detail.rate}%
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};
