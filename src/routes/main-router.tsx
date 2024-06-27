import Home from "@/routes/home/page";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Portfolio from "./portfolio/page";
import Dev from "./dev/page";
import MainPortfolio from "./portfolio/mainPortfolio";
import MyPage from "./mypage/page";
import SignUp from "./signup/page";
import SignIn from "./signin/page";
import SubscribePortfolio from "./portfolio/subscribe/page";
import DetailPage from "./portfolio/detail/page";
import Myportfolio from "./portfolio/myportfolio";
import SubscribePortfolioRecency from "./portfolio/subscribe/recency/page";
import ErrorPage from "./error/page";

const routers = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/portfolio",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Portfolio />,
        index: true,
      },
      {
        path: "mainPortfolio",
        element: <MainPortfolio />,
        index: true,
      },
      {
        path: "detail/:id",
        element: <DetailPage />,
        index: true,
      },
      {
        path: "subscribe",
        element: <SubscribePortfolio />,
        index: true,
      },
      {
        path: "subscribe/recency",
        element: <SubscribePortfolioRecency />,
        index: true,
      },
      {
        path: "myportfolio",
        element: <Myportfolio />,
        index: true,
      },
    ],
  },
  {
    path: "/mypage",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <MyPage />,
        index: true,
      },
    ],
  },
  {
    path: "/dev",
    element: <Dev />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

const router = createBrowserRouter(routers);
export default router;
