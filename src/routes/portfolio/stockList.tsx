import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// 단어 데이터의 인터페이스를 정의
interface WordData {
  text: string;
  value: number;
}

// 단어 데이터 배열을 정의
// API 값 연동해서 가져와 WordData에 저장하면 될 듯
const data: WordData[] = [
  { text: "IT. 인터넷", value: 83 },
  { text: "우주항공과국방", value: 20 },
  { text: "금융", value: 40 },
  { text: "운송체", value: 30 },
  { text: "건설교육업", value: 50 },
  { text: "무역회사와판매업체", value: 60 },
  { text: "서비스업", value: 40 },
  { text: "2차 전지", value: 50 },
  { text: "교육서비스업", value: 65 },
  // { text: "2차 전지", value: 50 },
];

// 긴 텍스트를 줄여서 표시하는 함수
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

// StockList 컴포넌트 정의
const StockList: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // SVG 요소에 대한 참조를 생성

  useEffect(() => {
    // 워드 클라우드 상위 5개의 데이터 선택
    const topData = data.sort((a, b) => b.value - a.value).slice(0, 5);
    const totalValue = d3.sum(data.map((item) => item.value));

    // 커스텀 툴팁 스타일 추가
    const tooltipStyle = `
      .tooltip {
        position: absolute;
        background-color: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.1s ease-in-out;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = tooltipStyle;
    document.head.appendChild(styleSheet);

    // SVG 요소 선택 및 초기화
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", "-350 -200 700 400") // ViewBox를 설정하여 중앙에 배치
      .attr("preserveAspectRatio", "xMidYMid slice"); // 비율을 유지하며 중앙에 맞춤

    // 그룹 요소 추가
    const g = svg.append("g"); // 그룹 요소 추가

    // 커스텀 툴팁 요소 추가
    const tooltip = d3.select("body").append("div").attr("class", "tooltip"); // 툴팁에 클래스 적용

    // 원형 배치를 위한 시뮬레이션 설정
    const simulation = d3
      .forceSimulation(topData)
      .force("charge", d3.forceManyBody().strength(10))
      .force("center", d3.forceCenter(0, 0))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.value - 10) // 충돌 반경 조정
      )
      .on("tick", ticked);

    function ticked() {
      const circles = g.selectAll("circle").data(topData);

      circles
        .enter()
        .append("circle")
        .attr("r", (d) => d.value / 1.25) // 원의 반지름 설정
        .style("fill", (d, i) => d3.schemeCategory10[i % 10])
        .merge(circles)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .on("mouseover", (event, d) => {
          const percentage = ((d.value / totalValue) * 100).toFixed(1);
          // 소수점 한 자리까지 -> toFixed
          tooltip.style("opacity", 1).html(`${d.text} : ${percentage}%`);
        })
        .on("mousemove", (event, d) => {
          tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      circles.exit().remove();

      const texts = g.selectAll("text").data(topData);

      texts
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.value / 4}px`) // 텍스트 크기 조정
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("fill", "#fff")
        .merge(texts)
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .text((d) => truncateText(d.text, 5)); // 5글자가 넘으면 그 나머지 글자를 버리고 ...을 붙여줌

      texts.exit().remove();
    }

    return () => {
      // 클린업: 기존 SVG 요소 제거
      svg.selectAll("*").remove();
      tooltip.remove(); // 툴팁 요소 제거
      document.head.removeChild(styleSheet); // 스타일 요소 제거
    };
  }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  // 상위 7개 데이터를 컴포넌트 내에서도 참조
  const topData = data.sort((a, b) => b.value - a.value).slice(0, 7);
  // 오른쪽 텍스트 7개까지 출력 나머지는 그 외로 표시
  const totalValue = d3.sum(data.map((item) => item.value));

  // 나머지 데이터의 합계 계산
  const otherDataValue = totalValue - d3.sum(topData.map((item) => item.value));
  const otherDataPercentage = ((otherDataValue / totalValue) * 100).toFixed(1);

  return (
    <div style={{ display: "flex", height: "50vh", width: "50%" }}>
      <svg ref={svgRef} style={{ flex: "1", maxWidth: "100%", maxHeight: "100%" }}></svg>{" "}
      {/* SVG 요소를 렌더링하고 참조를 설정 */}
      <div style={{ marginLeft: "20px" }}>
        {topData.map((d, i) => (
          <div key={i} style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
            <span style={{ color: d3.schemeCategory10[i % 10], marginRight: "5px" }}>●</span>
            {d.text} ({((d.value / totalValue) * 100).toFixed(1)}%)
          </div>
        ))}
        <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
          <span style={{ color: "gray", marginRight: "5px" }}>●</span>그 외 ({otherDataPercentage}%)
        </div>
      </div>
    </div>
  );
};

export default StockList; // StockList 컴포넌트를 기본 내보내기
