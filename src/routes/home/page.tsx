import { useRef } from "react";
import "./home.css";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const section2 = useRef<HTMLDivElement | null>(null);
  const section3 = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="main-container">
      <section className="hero">
        <div className="hero__waves" />
        <h1 className="hero__title">Welcome to E.G</h1>
        <div className="arrow-container" onClick={() => scrollToSection(section2)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="arrow">
            <path d="M12 16l-6-6h12z" />
          </svg>
        </div>
      </section>
      <section ref={section2} className="content bg-slate-200">
        <p className="content__paragraph">Portfolio Theory(포트폴리오 이론)</p>
        <p className="content__paragraph">
          "계란을 한 바구니에 담아서는 안 됩니다. 만일 바구니를 떨어뜨리면 모든 것이 끝장나기 때문이죠"
        </p>
        <p className="content__paragraph text-right">
          제임스 토빈(James Tobin)
          <br />- 미국 경제학자
        </p>
        <div className="arrow-container" onClick={() => scrollToSection(section3)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="arrow">
            <path d="M12 16l-6-6h12z" />
          </svg>
        </div>
      </section>
      <section ref={section3} className="content bg-slate-300 text-center">
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
