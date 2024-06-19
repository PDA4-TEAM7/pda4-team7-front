import { useState } from "react";
import "./home.css";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [isWavesCentered, setIsWavesCentered] = useState(false);
  const navigate = useNavigate();
  const toggleWavesSize = () => {
    setIsWavesCentered((prevState) => !prevState);
  };
  return (
    <div className="main-container">
      <section className="hero">
        <div className={`hero__waves ${isWavesCentered ? "is-centered" : ""}`} />
        <h1 className="hero__title">Welcome to E.G</h1>
        <button className="hero__button" onClick={toggleWavesSize}>
          Toggle Waves Size
        </button>
      </section>
      <section className="content bg-slate-200">
        <p className="content__paragraph">Portfolio Theory(포트폴리오 이론)</p>

        <p className="content__paragraph">
          "계란을 한 바구니에 담아서는 안 됩니다. 만일 바구니를 떨어뜨리면 모든 것이 끝장나기 때문이죠"
        </p>
        <p className="content__paragraph text-right">
          제임스 토빈(James Tobin)
          <br />- 미국 경제학자
        </p>
      </section>
      <section className="content bg-slate-300 text-center">
        <p className="content__paragraph">나만의 포트폴리오를 만들어, 자산을 분산하세요.</p>
        <p className="content__paragraph">포트폴리오를 구독하고, 간접 경험하세요.</p>
        <Button
          onClick={() => {
            navigate("/portfolio/mainportfolio");
          }}
        >
          포트폴리오 보러가기
        </Button>
      </section>
    </div>
  );
}
