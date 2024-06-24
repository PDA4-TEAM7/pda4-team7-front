import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import Subscribe from "../../assets/subscribe.png";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { portfolioApi } from "@/apis/portfolioAPI";
import { subscribeApi } from "@/apis/subscribeAPI"; // corrected the import

export default function MainPortfolio() {
  const [sort, setSort] = useState("");
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [subscribes, setSubscribes] = useState<any[]>([]); // corrected the state name
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await portfolioApi.getAllPortfolios();
        console.log("API Response:", response);
        setPortfolioData(response);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };

    const fetchSubscriptions = async () => {
      try {
        const response = await subscribeApi.getUserSubscriptions();
        setSubscribes(response);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchPortfolioData();
    fetchSubscriptions();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };

  const handlePortfolioClick = (item: any) => {
    const isSubscribed = subscribes.some((sub) => sub.portfolio_id === item.id && sub.can_sub);

    if (isSubscribed) {
      navigate(`/portfolio/detail/${item.account_id}`);
    } else {
      alert("구독 하지 않은 포트폴리오입니다.");
    }
  };

  const handleSubscribe = async (portfolio_id: number) => {
    try {
      await subscribeApi.subscribe(portfolio_id);
      const response = await subscribeApi.getUserSubscriptions();
      setSubscribes(response);
    } catch (error) {
      console.error("Error subscribing to portfolio:", error);
    }
  };

  const handleUnsubscribe = async (portfolio_id: number) => {
    try {
      await subscribeApi.unsubscribe(portfolio_id);
      const response = await subscribeApi.getUserSubscriptions();
      setSubscribes(response);
    } catch (error) {
      console.error("Error unsubscribing from portfolio:", error);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b bg-gray-100">
        <div className="flex items-center">
          <input type="text" placeholder="원하는 포트폴리오를 검색" className="p-2 border rounded-l-md" />
          <button className="p-2 bg-gray-300 border rounded-r-md">
            <img src="search-icon.png" alt="검색" className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center">
          <img src="" alt="알림" className="w-5 h-5 mx-2" />
          <img src="settings-icon.png" alt="설정" className="w-5 h-5 mx-2" />
          <span className="mx-2">ENG</span>
        </div>
      </header>
      <main className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Stock Portfolio</h1>
          <FormControl fullWidth style={{ maxWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">정렬 순</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort}
              label="정렬 순"
              onChange={handleChange}
            >
              <MenuItem value={10}>수익률 순</MenuItem>
              <MenuItem value={20}>구독자 순</MenuItem>
              <MenuItem value={30}>최신 순</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {portfolioData.map((item) => {
            const isSubscribed = subscribes.some((sub) => sub.portfolio_id === item.id && sub.can_sub);

            return (
              <div
                key={item.id}
                className={`border p-4 rounded-md ${isSubscribed ? "cursor-pointer" : "cursor-not-allowed"}`}
                onClick={() => handlePortfolioClick(item)}
              >
                <div className="flex justify-between">
                  <div className="text-base font-bold">{item.title}</div>
                  <button
                    className={`text-base ${isSubscribed ? "text-red-500" : "text-green-500"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      isSubscribed ? handleUnsubscribe(item.id) : handleSubscribe(item.id);
                    }}
                  >
                    {isSubscribed ? "구독 취소" : "구독"}
                  </button>
                </div>
                <div className="flex">
                  <div className="w-1/2">
                    <Pie
                      data={{
                        labels: item.stockData.map((stock: any) => stock.name),
                        datasets: [
                          {
                            label: "비율",
                            data: item.stockData.map((stock: any) => stock.ratio),
                            backgroundColor: item.stockData.map(
                              () =>
                                `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
                                  Math.random() * 256
                                )}, ${Math.floor(Math.random() * 256)}, 1)`
                            ),
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className="w-1/2 pl-4 flex flex-col justify-center">
                    <div>
                      <p className="font-bold">총 자산: {item.totalAsset}</p>
                      <p className="font-bold">수익률: {item.profitLoss.toFixed(2)}%</p>
                      <p className="text-red-500">({item.loss})</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold">{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="mt-4">
                    <span className="text-base text-gray-500">
                      생성일자 {new Date(item.createDate).toLocaleString()}
                    </span>
                    <div className="flex items-center mt-2">
                      <img src="" alt="프로필 이미지" className="w-6 h-6 rounded-full mr-2" />
                      <span className="text-base text-gray-500">{item.username}</span>
                      <div className="flex items-center ml-auto">
                        <img src={Subscribe} alt="구독자 아이콘" className="w-6 h-6 mr-1" />
                        <span className="text-base text-gray-500">구독자 수</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
