import { formatNumber } from "@/lib/nums";
import React from "react";
import { useNavigate } from "react-router-dom";

export interface DetailData {
  stock?: string;
  value?: number;
  holding_id: number;
  portfolio_id: number;
  account_id: number;
  uid: number;
  name: string;
  hldg_qty: string;
  pchs_amt: string;
  evlu_amt: string;
  evlu_pfls_amt: string;
  evlu_pfls_rt: string;
  std_idst_clsf_cd_name: string;
  closing_price: number;
  createdAt: string;
  updatedAt: string;
}

export interface SelectedItem {
  group: string;
  value: number;
  details: DetailData[];
}

export interface DetailPanelProps {
  selectedItem: SelectedItem | null;
  selectedChart: string;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ selectedItem, selectedChart }) => {
  const navigate = useNavigate();
  if (!selectedItem) {
    return <p>막대를 클릭하여 상세 정보를 확인하세요.</p>;
  }

  const handleTextClick = (portfolio_id: number) => {
    navigate(`/portfolio/detail/${portfolio_id}`);
  };

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
              <li
                key={index}
                className="mb-1 cursor-pointer hover:text-blue-500"
                onClick={() => handleTextClick(detail.portfolio_id)}
              >
                총 {detail.hldg_qty}주 소유 | 총 매입금액: {formatNumber(Number(detail.pchs_amt))} | 손익률:{" "}
                {detail.evlu_pfls_rt}%
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};
