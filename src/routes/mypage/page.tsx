export default function MyPage() {
  const name = "소연";

  return (
    <div className="my-page-container">
      <p>{name}의 페이지</p>
      <div className="flex flex-col gap-2">
        <div className="b-4">
          <span>내용 : </span>
          <span>내용입니다. </span>
        </div>
      </div>
    </div>
  );
}
