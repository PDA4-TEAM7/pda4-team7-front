export default function ErrorPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col">
      <img src={"/icon-error.png"} alt="에러 페이지" className="sm:max-w-80 max-w-60" />
      <p className="text-xl relative bottom-10 text-center">잘못된 페이지 접근입니다!😣</p>
    </div>
  );
}
