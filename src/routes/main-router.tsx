
import Home from '@/routes/home/page';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Portfolio from './portfolio/page';
import Dev from './dev/page';
import CommPage from './portfolio/comm_page';
import MyPage from './mypage/page';


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
        path: 'comm',
        element: <CommPage/>,
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
