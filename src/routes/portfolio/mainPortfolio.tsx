import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import Subscribe from "../../assets/subscribe.png";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { portfolioApi } from "@/apis/portfolioAPI";
import { subscribeApi } from "@/apis/subscribeAPI";
import useModal from "@/hooks/useModal";
import useUser from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { formatNumber } from "@/lib/nums";

export default function MainPortfolio() {
  const [sort, setSort] = useState("");
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [subscribedPortfolios, setSubscribedPortfolios] = useState<any[]>([]);
  const navigate = useNavigate();
  const { open, close } = useModal();
  const { getUserInfo, submitUserInfo } = useUser();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfolioResponse = await portfolioApi.getAllPortfolios();
        const portfolioDataWithSubscribers = await Promise.all(
          portfolioResponse.map(async (portfolio: any) => {
            const { subscriberCount } = await subscribeApi.getSubscriberCount(portfolio.id);
            return { ...portfolio, subscriberCount };
          })
        );
        setPortfolioData(portfolioDataWithSubscribers);

        if (user.userId) {
          const subscriptionResponse = await subscribeApi.getUserSubscriptions();
          setSubscribedPortfolios(subscriptionResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.userId]);

  const handleChange = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };

  const handlePortfolioClick = (item: any) => {
    if (!user.userId) {
      open("알림", "회원만 사용할 수 있는 기능입니다! 회원가입 해주세요.", () => {
        navigate("/signup");
      });
      return;
    }
    const isSubscribed = subscribedPortfolios.some((sub) => sub.portfolio_id === item.id);

    if (isSubscribed) {
      navigate(`/portfolio/detail/${item.id}`);
    } else {
      alert("구독 하지 않은 포트폴리오입니다.");
    }
  };

  const handleSubscribe = async (item: any) => {
    if (!user.userId) {
      open("알림", "회원만 사용할 수 있는 기능입니다! 회원가입 해주세요.", () => {
        navigate("/signup");
      });
      return;
    }

    open("구독 확인", `이 포트폴리오를 ${item.price}원에 구독하시겠습니까?`, async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo.credit < item.price) {
          alert("소지 금액이 부족합니다.");
          close();
          return;
        }

        await subscribeApi.subscribe(item.id);
        const updatedSubscriptions = await subscribeApi.getUserSubscriptions();

        await submitUserInfo({
          userName: userInfo.userName,
          introduce: userInfo.introduce,
          credit: userInfo.credit - item.price,
        });

        setSubscribedPortfolios(updatedSubscriptions);
        close();
      } catch (error) {
        console.error("Error subscribing to portfolio:", error);
        close();
      }
    });
  };

  const handleUnsubscribe = async (portfolio_id: number) => {
    if (!user.userId) {
      open("알림", "회원만 사용할 수 있는 기능입니다! 회원가입 해주세요.", () => {
        navigate("/signup");
      });
      return;
    }
    open("구독 취소 확인", "정말로 구독을 취소하시겠습니까?", async () => {
      try {
        await subscribeApi.unsubscribe(portfolio_id);
        const updatedSubscriptions = await subscribeApi.getUserSubscriptions();
        setSubscribedPortfolios(updatedSubscriptions);
        close();
      } catch (error) {
        console.error("Error unsubscribing from portfolio:", error);
        close();
      }
    });
  };

  const isPortfolioSubscribed = (portfolioId: number): boolean => {
    if (!user) return false;
    return subscribedPortfolios.some((sub) => sub.portfolio_id === portfolioId);
  };

  return (
    <div>
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
            const isSubscribed = isPortfolioSubscribed(item.id);
            const stockAmtData = item.stockData.map((stock: any) => stock.ratio);
            const stockNameData = item.stockData.map((stock: any) => stock.name);
            return (
              <div
                key={item.id}
                className={`border p-4 rounded-md ${isSubscribed ? "cursor-pointer" : "cursor-not-allowed"}`}
                onClick={() => handlePortfolioClick(item)}
              >
                <div className="flex justify-between mb-4">
                  <div className="text-base font-bold">{item.title}</div>
                  <button
                    className={`text-base ${isSubscribed ? "text-red-500" : "text-green-500"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      isSubscribed ? handleUnsubscribe(item.id) : handleSubscribe(item);
                    }}
                  >
                    {isSubscribed ? "구독 취소" : "구독"}
                  </button>
                </div>
                <div className="flex">
                  <div className="w-1/2">
                    <Pie
                      data={{
                        labels: stockNameData,
                        datasets: [
                          {
                            label: "비율",
                            data: stockAmtData,
                            backgroundColor: [
                              "rgba(255, 99, 132, 1)",
                              "rgba(54, 162, 235, 1)",
                              "rgba(255, 206, 86, 1)",
                              "rgba(75, 192, 192, 1)",
                              "rgba(153, 102, 255, 1)",
                              "rgba(255, 159, 64, 1)",
                              "rgba(255, 99, 132, 0.8)",
                              "rgba(54, 162, 235, 0.8)",
                              "rgba(255, 206, 86, 0.8)",
                              "rgba(75, 192, 192, 0.8)",
                              "rgba(153, 102, 255, 0.8)",
                              "rgba(255, 159, 64, 0.8)",
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          datalabels: {
                            display: false,
                          },
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const value: number = Number(context.raw);
                                return `${context.label}: ${Math.round(value * 100)}%`;
                              },
                            },
                          },
                        },
                      }}
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className="w-1/2 pl-4 flex flex-col justify-center">
                    <div>
                      <p className="font-bold">총 자산: {formatNumber(item.totalAsset)}원</p>
                      <p
                        className={`font-bold ${
                          +item.profitLoss > 0
                            ? "text-red-500"
                            : +item.profitLoss == 0
                            ? "text-black-900"
                            : "text-blue-500"
                        }`}
                      >
                        {+item.profitLoss > 0 && <span>+</span>}
                        {formatNumber(item.loss)} <span>({Math.abs(item.profitLoss.toFixed(2))}%)</span>
                      </p>
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
                      <div className="profile-photo w-6 h-6 mr-2">
                        <img
                          src={`https://source.boringavatars.com/beam/500/${item.username}`}
                          alt="프로필 이미지"
                          className="w-full h-full"
                        />
                      </div>
                      <span className="text-base text-gray-500">{item.username}</span>
                      <div className="flex items-center ml-auto">
                        <img src={Subscribe} alt="구독자 아이콘" className="w-6 h-6 mr-1" />
                        <span className="text-base text-gray-500">구독자 수: {item.subscriberCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-20">
                  <span className=" text-base">구독료 : {item.price} 원 /월</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
