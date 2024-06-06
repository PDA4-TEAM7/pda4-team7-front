import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <div className="nav-bar mx-2 my-4 border-b">nav bar</div>
      <div className="wrap flex flex-col min-h-screen w-full items-center">
        <Outlet />
      </div>
    </>
  );
}
