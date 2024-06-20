import Home from "@/routes/home/page";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Portfolio from "./portfolio/page";
import Dev from "./dev/page";
import MainPortfolio from "./portfolio/mainPortfolio";
import MyPage from "./mypage/page";
import StockList from "./portfolio/stockList";
import SignUp from "./signup/page";
import CommPage from "./portfolio/comm_page";
import SignIn from "./signin/page";
import SubscribePortfolio from "./portfolio/subscribe/page";
import { elements } from "chart.js";
import Myportfolio from "./portfolio/myportfolio";

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
        path: "subscribe",
        element: <SubscribePortfolio />,
        index: true,
      },
      {
        path: "stockList/:id",
        element: <StockList />,
        index: true,
      },
      {
        path: "comm",
        element: <CommPage />,
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
];

const router = createBrowserRouter(routers);

export default router;
