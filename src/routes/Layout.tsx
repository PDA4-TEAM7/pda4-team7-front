import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";

const drawerWidth = 240;
const navMenu = [
  {
    text: "포트폴리오",
    page: "/portfolio/mainPortfolio",
    icon: <IconPortfolio width={24} height={24} />,
    display: "always",
  },
  {
    text: "구독 포트폴리오",
    page: "/portfolio/subscribe",
    icon: <IconSub width={24} height={24} />,
    display: "always", //UI에는 띄우고 선택시 로그인 요청
  },
  {
    text: "마이 페이지",
    page: "/mypage",
    icon: <IconMy width={24} height={24} />,
    display: "login", //로그인시 노출
  },
  {
    text: "나의 포트폴리오",
    page: "/portfolio/myportfolio",
    icon: <IconPortfolio width={24} height={24} />,
    display: "login", //로그인시 노출
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
  width: "0px",
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
  "@media (max-width: 768px)": {
    position: "absolute",
    width: drawerWidth,
    ...(!open && {
      width: 0,
      "& .MuiDrawer-paper": {
        width: 0,
      },
    }),
  },
}));

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { open: openModal } = useModal();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigate = (page: string) => {
    if (page !== "/portfolio/mainPortfolio" && !user.userId) {
      // 비로그인 유저시 접근하면 회원가입하라는 모달띄우고이동시키기
      openModal("알림", "회원만 접근 가능한 페이지에요! 회원가입해주세요 :)", () => {
        navigate("/signup");
      });

      return;
    }
    navigate(page);
    setOpen(false);
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

  useEffect(() => {
    const isMobileView = window.matchMedia("(max-width: 768px)").matches;
    if (open && isMobileView) {
      // 모달이 열리면 body의 overflow를 hidden으로 설정하여 배경 스크롤을 막음
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden"; // 추가
    } else {
      // 모달이 닫히면 body의 overflow를 auto로 설정하여 배경 스크롤을 허용함
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto"; // 추가
    }

    // 클린업 함수: 모달이 언마운트될 때 overflow를 auto로 설정하여 배경 스크롤을 허용함
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto"; // 추가
    };
  }, [open]);

  return (
    <div className="flex">
      <div className={`absolute md:hidden top-[10px] left-2`} onClick={handleDrawerOpen}>
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          sx={{
            position: "fixed",
            ...(open && { display: "none" }),
            zIndex: 1001,
          }}
          className={`md:!text-white !text-slate-900`}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <Drawer variant="permanent" open={open} className={`[&_div]:bg-[#23272c] h-screen [&_.MuiPaper-root]:h-screen`}>
        <DrawerHeader>
          {open && (
            <div
              className="text-left flex-1 flex flex-row gap-2 items-center"
              onClick={() => handleNavigate("/portfolio/mainPortfolio")}
            >
              <div className="profile-photo w-10 h-10 ">
                <img src={"/icon-logo.png"} alt="" />
              </div>
              <p className="text-white text-lg">E.G</p>
            </div>
          )}
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{
              position: "absolute",
              ...(open && { display: "none" }),
            }}
            className={`md:!text-white !text-slate-900`}
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
            } profile flex flex-col text-[#E0E4EA] items-center justify-center w-full gap-1 pb-8`}
          >
            {user.userId && (
              <>
                <div className="profile-photo w-16 h-16 mb-4 mt-4">
                  <img
                    src={`https://source.boringavatars.com/beam/500/${user.userName}`}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
                <p className="text-white font-bold text-lg">{user.userName}</p>
                <p>{user.userId}</p>
              </>
            )}
          </div>
        )}
        {true && (
          <List key={"list"}>
            {navMenu.map(({ text, page, icon, display }, index) => {
              if (display === "login" && !user.userId) return <></>;
              return (
                <ListItem
                  onClick={() => handleNavigate(page)}
                  key={text + index}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    className={`${location.pathname === page && "!bg-[#121417]"}`}
                    key={index + text}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                      className="center !bg-transparent"
                      key={text + index + page}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                      className="text-[#E0E4EA] !bg-transparent"
                      key={text + page}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
        {open && (
          <div className="mt-auto mb-4 px-2 text-right">
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
              <div className="flex justify-center items-center">
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
                  key="btn1"
                >
                  로그인
                </Button>
                <span className="text-white">|</span>
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
                  key="btn2"
                >
                  회원가입
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
      <div
        className={`w-full fixed h-screen bg-[#23272c] md:hidden ${
          open ? "block" : "hidden"
        } inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster`}
        style={{ background: "rgba(0,0,0,.7)", zIndex: "1001" }}
        onClick={() => {
          setOpen(false);
        }}
      ></div>
      <div className="grow-[1]">
        <Outlet />
      </div>
    </div>
  );
}
