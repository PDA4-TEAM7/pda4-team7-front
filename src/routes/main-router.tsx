import Home from '@/routes/home/page';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Portfolio from './portfolio/page';
import Dev from './dev/page';
import CommPage from './portfolio/comm_page';

const routers = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/portfolio',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Portfolio />,
        index: true,
      },
    ],
  },
  {
    path: '/dev',
    element: <Dev />,
  },
  {
    path: '/commpage',
    element: <CommPage/>,
  }
];

const router = createBrowserRouter(routers);

export default router;
