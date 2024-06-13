import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// 단어 데이터의 인터페이스를 정의
interface WordData {
  text: string;
  value: number;
}

// 단어 데이터 배열을 정의
const data: WordData[] = [
  // value -> 해당 섹터 비율
  { text: "IT. 인터넷", value: 63 },
  { text: "우주항공과국방", value: 20 },
  { text: "금융", value: 40 },
  { text: "운송체", value: 30 },
  { text: "건설교육업", value: 20 + 30 },
  { text: "무역회사와판매업체", value: 30 + 30 },
  { text: "서비스업", value: 10 + 30 },
  { text: "2차 전지", value: 40 + 30 },
];

// 긴 텍스트를 줄여서 표시하는 함수
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

// StockList 컴포넌트 정의
const StockList: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // SVG 요소에 대한 참조를 생성

  useEffect(() => {
    // SVG 요소 선택 및 초기화
    const svg = d3.select(svgRef.current).attr("width", 800).attr("height", 600);

    // 그룹 요소 추가
    const g = svg.append("g").attr("transform", "translate(400,300)"); // SVG의 중심으로 이동

    // 원형 배치를 위한 시뮬레이션 설정
    const simulation = d3
      .forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(10))
      .force("center", d3.forceCenter(0, 0))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.value) // 충돌 반경 조정
      )
      .on("tick", ticked);

    function ticked() {
      const circles = g.selectAll("circle").data(data);

      circles
        .enter()
        .append("circle")
        .attr("r", (d) => d.value) // 원의 반지름 설정
        .style("fill", (d, i) => d3.schemeCategory10[i % 10])
        .merge(circles)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      circles.exit().remove();

      const texts = g.selectAll("text").data(data);

      const textEnter = texts
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.value / 3}px`) // 텍스트 크기 조정
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("fill", "#fff")
        .merge(texts)
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .text((d) => truncateText(d.text, 5)) // 5글자가 넘으면 그 나머지 글자를 버리고 ...을 붙여줌
        .append("title") // 툴팁 요소 추가
        .text((d) => d.text); // 툴팁에 전체 텍스트 표시

      texts.exit().remove();
    }

    return () => {
      // 클린업: 기존 SVG 요소 제거
      svg.selectAll("*").remove();
    };
  }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <div>
      <svg ref={svgRef}></svg> {/* SVG 요소를 렌더링하고 참조를 설정 */}
    </div>
  );
};

export default StockList; // StockList 컴포넌트를 기본 내보내기
