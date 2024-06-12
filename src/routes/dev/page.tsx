import useModal from "@/hooks/useModal";
import IconHeart from "@/assets/icon-heart.svg?react";
import Chart from "./components/Chart";
import LineChart from "./components/LineChart";

//테스트용 페이지
export default function Dev() {
  const { open, close } = useModal();
  const handleModal = () => {
    open("title", "이런식으로 모달을 사용하면 됩니다.", close);
  };

  return (
    <div>
      <p>test page</p>
      <p>
        <span> svg 넣기 :</span>
        <IconHeart width={100} height={100} fill={"#2cffd1"} stroke={"#2cffd1"} />
      </p>
      <button className="btn border m-2 p-1" onClick={handleModal}>
        모달 버튼
      </button>
      <div>
        <p>chart example </p>
        <p>Pie chart</p>
        <Chart />
        <p>Line chart</p>
        <LineChart />
      </div>
    </div>
  );
}
