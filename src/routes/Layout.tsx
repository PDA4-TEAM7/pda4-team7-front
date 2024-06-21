import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

import IconPortfolio from "@/assets/icon-portfolio.svg?react";
import IconMy from "@/assets/icon-my.svg?react";
import IconSub from "@/assets/icon-sub.svg?react";
import IconCalender from "@/assets/icon-calender.svg?react";
import { useAuth } from "@/hooks/useAuth";

const drawerWidth = 240;
const navMenu = [
  {
    text: "포트폴리오",
    page: "/portfolio/mainPortfolio",
    icon: <IconPortfolio width={24} height={24} />,
  },
  {
    text: "구독 포트폴리오",
    page: "/portfolio/subscribe",
    icon: <IconSub width={24} height={24} />,
  },
  {
    text: "마이 페이지",
    page: "/mypage",
    icon: <IconMy width={24} height={24} />,
  },
  {
    text: "추천 포트폴리오",
    page: "#",
    icon: <IconCalender width={24} height={24} />,
  },
];
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Layout() {
  const [open, setOpen] = useState(true);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigate = (page: string) => {
    navigate(page);
    console.log("loca:", location.pathname);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleLogin = () => {
    navigate("/signin");
  };

  return (
    <div className="flex">
      <Drawer variant="permanent" open={open} className="[&_div]:bg-[#23272c]">
        <DrawerHeader>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{
              position: "absolute",
              ...(open && { display: "none" }),
            }}
            className="!text-white"
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              ...(!open && { display: "none" }),
            }}
            className="!text-white"
          >
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        {user && (
          <div
            className={`${
              !open && "hidden"
            } profile flex flex-col text-[#E0E4EA] items-center justify-center w-full gap-1 pb-10`}
          >
            <div className="profile-photo w-16 h-16 mb-4">
              <img src={"/icon-profile.png"} alt="" className="w-full h-full" />
            </div>
            <p className="text-white font-bold text-lg">{user.userName}</p>
            <p>{user.userId}</p>
          </div>
        )}
        <List>
          {navMenu.map(({ text, page, icon }, index) => (
            <ListItem onClick={() => handleNavigate(page)} key={text + index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                className={`${location.pathname === page && "!bg-[#121417]"}`}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                  className="center !bg-transparent"
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{ opacity: open ? 1 : 0 }}
                  className="text-[#E0E4EA] !bg-transparent"
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <div className="mt-auto mb-4 px-2">
          {user.userId ? (
            <Button
              variant="text"
              onClick={handleLogout}
              fullWidth
              sx={{
                color: "#E0E4EA",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              로그아웃
            </Button>
          ) : (
            <Button
              variant="text"
              onClick={handleLogin}
              fullWidth
              sx={{
                color: "#E0E4EA",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              로그인
            </Button>
          )}
        </div>
      </Drawer>
      <div className="grow-[1]">
        <Outlet />
      </div>
    </div>
  );
}
