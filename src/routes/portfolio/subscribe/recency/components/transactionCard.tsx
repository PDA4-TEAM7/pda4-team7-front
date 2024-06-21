// Transaction 인터페이스
export interface Transaction {
  stockName: string;
  transactionType: "buy" | "sell";
  averagePrice: number;
  totalVolume: number;
  totalPrice: number;
  user: string;
}

// 테스트 데이터
const users = ["오수연", "박소연", "임찬솔", "장호익"];
const stocks = [
  { name: "삼성전자", basePrice: 90000 },
  { name: "현대차", basePrice: 90000 },
  { name: "LG화학", basePrice: 800000 },
  { name: "NAVER", basePrice: 380000 },
  { name: "카카오", basePrice: 150000 },
  { name: "SK하이닉스", basePrice: 120000 },
  { name: "셀트리온", basePrice: 270000 },
  { name: "기아", basePrice: 85000 },
  { name: "POSCO", basePrice: 260000 },
  { name: "삼성바이오로직스", basePrice: 900000 },
];

// 무작위 정수 생성 함수
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 트랜잭션 데이터 생성
const transactions: Transaction[] = Array.from({ length: 20 }, (): Transaction => {
  const stock = stocks[getRandomInt(0, stocks.length - 1)];
  const priceAdjustmentFactor = getRandomInt(-10, 10) / 100;
  const price = stock.basePrice * (1 + priceAdjustmentFactor);
  const volume = getRandomInt(1, 10);
  const totalPrice = price * volume;

  return {
    stockName: stock.name,
    transactionType: getRandomInt(0, 1) === 0 ? "buy" : "sell",
    averagePrice: Math.round(price),
    totalVolume: volume,
    totalPrice: Math.round(totalPrice),
    user: users[getRandomInt(0, users.length - 1)],
  };
});

const TransactionCard = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedDate = yesterday.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* 제목 추가 */}
      <div className="flex items-center">
        <span className="text-shadow-strong text-xl font-bold p-2">{formattedDate}에 이루어진 투자현황</span>
        <span className="ml-auto">전체 체결: {transactions.length}건</span>
      </div>

      <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-300 overflow-auto">
        <div className="max-h-64 overflow-auto">
          {/* 헤더 추가 */}
          <div className="ml-2 mr-2 pl-4 pr-4 pb-1 rounded bg-white border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4 text-center">
              <div className="font-bold">종목명</div>
              <div className="font-bold">매수/매도</div>
              <div className="font-bold">체결평균가(원)</div>
              <div className="font-bold">총체결수량(주)</div>
              <div className="font-bold">총체결금액(원)</div>
              <div className="font-bold">투자자</div>
            </div>
          </div>

          {/* 트랜잭션 데이터 표시 */}
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className={`m-2 p-4 rounded shadow-lg ${
                transaction.transactionType === "buy" ? "bg-red-200/50" : "bg-blue-200/50"
              }`}
            >
              <div className="grid grid-cols-6 gap-4 text-center">
                <div className="font-bold">{transaction.stockName}</div>
                <div
                  className={`font-bold ${transaction.transactionType === "buy" ? "text-red-600" : "text-blue-600"}`}
                >
                  {transaction.transactionType === "buy" ? "매수" : "매도"}
                </div>
                <div>{transaction.averagePrice.toLocaleString()}</div>
                <div>{transaction.totalVolume}</div>
                <div>{transaction.totalPrice.toLocaleString()}</div>
                <div>{transaction.user}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TransactionCard;
