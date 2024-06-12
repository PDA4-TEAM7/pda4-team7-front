import Home from "@/routes/home/page";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Portfolio from "./portfolio/page";
import Dev from "./dev/page";
import MyPage from "./mypage/page";
import DetailPage from "./portfolio/detail/page";

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
        path: "detail",
        element: <DetailPage />,
        index: true,
      },
    ],
  },
  {
    path: "/mypage",
    element: <MyPage />,
  },
  {
    path: "/dev",
    element: <Dev />,
  },
];

const router = createBrowserRouter(routers);

export default router;
