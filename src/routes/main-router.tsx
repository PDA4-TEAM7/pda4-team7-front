import Home from "@/routes/home/page";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Portfolio from "./portfolio/page";
import Dev from "./dev/page";
import SignUp from "./signup/page";
import MyPage from "./mypage/page";
import CommPage from "./portfolio/comm_page";

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
        path: "comm",
        element: <CommPage />,
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
];

const router = createBrowserRouter(routers);

export default router;
