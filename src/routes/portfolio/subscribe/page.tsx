/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import Expired from "@/assets/icon-expired.png";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { subscribeApi } from "@/apis/subscribeAPI";
import { useAuth } from "@/hooks/useAuth";
import { formatNumber } from "@/lib/nums";
import { Button } from "@/components/ui/button";
import Skeleton from "@mui/material/Skeleton";

export default function SubscribePortfolio() {
  const [sort, setSort] = useState<string>("10");
  const [subscribedPortfolios, setSubscribedPortfolios] = useState<any[]>([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 비로그인 유저시 접근하면 회원가입하라는 모달띄우고이동시키기
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      try {
        const response = await subscribeApi.getUserSubscriptions();
        setSubscribedPortfolios(response);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [navigate, user]);

  const handleChange = (event: SelectChangeEvent) => {
    console.log("event", event.target.value);
    setSort(event.target.value as string);
  };

  const handlePortfolioClick = (id: number) => {
    navigate(`/portfolio/detail/${id}`);
  };

  const handleUnsubscribe = async (portfolio_id: number) => {
    try {
      await subscribeApi.unsubscribe(portfolio_id);
      const response = await subscribeApi.getUserSubscriptions();
      setSubscribedPortfolios(response);
    } catch (error) {
      console.error("Error unsubscribing from portfolio:", error);
    }
  };
  const handleRecencyClick = () => {
    navigate("recency");
  };
  return (
    <div className="mb-4">
      <main className="p-4">
        <div className="flex justify-between items-start mb-4 flex-col md:flex-row">
          <div className="flex items-start md:items-center">
            <h1 className="text-xl mr-3 pl-10 md:pl-0 truncate">구독한 포트폴리오</h1>
            <Button
              className="text-l focus:outline-none px-8 bg-indigo-500 md:m-1 m-0 p-3 py-1 rounded-lg text-white hover:bg-indigo-400  relative -top-1 md:-top-0"
              onClick={handleRecencyClick}
            >
              <p className="text-sm">통계 보기</p>
            </Button>
          </div>
          <div className="flex items-center mt-8 sm:mt-0">
            <FormControl fullWidth style={{ maxWidth: 200 }} size="small">
              <InputLabel id="demo-select-small-label">정렬 순</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-simple-select"
                value={sort}
                label="정렬 순"
                onChange={(e) => handleChange(e)}
              >
                <MenuItem value={10}>수익률 순</MenuItem>
                <MenuItem value={20}>구독자 순</MenuItem>
                <MenuItem value={30}>최신 순</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {!isLoading &&
            subscribedPortfolios &&
            subscribedPortfolios.length > 0 &&
            subscribedPortfolios.map((item) => {
              const portfolio = item || {}; // 기본값 설정
              const stockData = portfolio.stockData || []; // 기본값 설정
              const stockAmtData = stockData.map((stock: any) => stock.ratio);
              const stockNameData = stockData.map((stock: any) => stock.name);
              return (
                <div
                  key={item.portfolio_id}
                  className="border p-4 rounded-md cursor-pointer flex flex-col justify-between"
                  onClick={() => handlePortfolioClick(item.portfolio_id)}
                >
                  <div>
                    <div className="flex justify-between mb-4 items-start">
                      <div className="text-base font-bold">{portfolio.title || "N/A"}</div>
                      <button
                        className="text-base bg-red-500 text-white px-3 py-1 rounded"
                        style={{ minWidth: "70px", whiteSpace: "nowrap" }}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent triggering onClick on the parent div
                          handleUnsubscribe(item.portfolio_id);
                        }}
                      >
                        취소
                      </button>
                    </div>
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
                              display: false, // 데이터 값 숨기기
                            },
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  // 데이터 값에 100을 곱하고 소수점 제거하여 퍼센테이지로 변형
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
                        <p className="font-bold">총 자산: {formatNumber(+portfolio.totalAsset) || "N/A"}</p>
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
                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <p>{portfolio.description || "N/A"}</p>
                    <div className="mt-4 text-end">
                      <span className="text-base text-gray-500">
                        생성일자 {portfolio.createDate ? new Date(portfolio.createDate).toLocaleString() : "N/A"}
                      </span>
                      <div className="flex items-center mt-2">
                        <div className="profile-photo w-6 h-6 mr-2">
                          <img
                            src={`https://source.boringavatars.com/beam/500/${item.username}`}
                            alt="프로필 이미지"
                            className="w-full h-full"
                          />
                        </div>
                        <span className="text-base text-gray-500">{portfolio.username || "N/A"}</span>
                        <div className="flex items-center ml-auto">
                          <img src={Expired} alt="구독 아이콘" className="w-6 h-6 mr-1" />
                          <span className="text-base text-gray-500">
                            구독 만료일: {new Date(item.ed_dt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          {!isLoading && subscribedPortfolios && subscribedPortfolios.length === 0 && (
            <div className="flex items-center justify-center flex-col w-full p-20">
              <img src="/icon-empty.png" alt="" className="sm:max-w-30 max-w-20" />
              <p className="text-center text-lg relative text-slate-700">구독한 포트폴리오가 없습니다.</p>
            </div>
          )}
          {isLoading && (
            <>
              <Skeleton
                sx={{ bgcolor: "grey.300" }}
                variant="rectangular"
                animation="wave"
                key={1}
                width={"100%"}
                height={300}
              />
              <Skeleton
                sx={{ bgcolor: "grey.300" }}
                variant="rectangular"
                animation="wave"
                key={1}
                width={"100%"}
                height={300}
              />
              <Skeleton
                sx={{ bgcolor: "grey.300" }}
                variant="rectangular"
                animation="wave"
                key={1}
                width={"100%"}
                height={300}
              />
              <Skeleton
                sx={{ bgcolor: "grey.300" }}
                variant="rectangular"
                animation="wave"
                key={1}
                width={"100%"}
                height={300}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
