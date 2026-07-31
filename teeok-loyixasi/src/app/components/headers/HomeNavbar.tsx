import { useState } from "react";
import { Box, Button, Container, ListItemIcon, Menu, MenuItem, Paper, IconButton } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Basket from "./Basket";
import MobileNavDrawer from "./MobileNavDrawer";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";
import "../../../css/navbar.css";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (v: boolean) => void;
  setLoginOpen: (v: boolean) => void;
  anchorEl: HTMLElement | null;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll,
    setSignupOpen, setLoginOpen,
    anchorEl, handleLogoutClick, handleCloseLogout, handleLogoutRequest } = props;
  const { authMember } = useGlobals();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="home-navbar">
      {/* ── Fixed glass nav ── */}
      <div className="home-topnav">
        <Container className="navbar-container">
          <NavLink to="/" className="navbar-logo">떡 <span>TTEOK</span></NavLink>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box className="navbar-links-desktop" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box className="hover-line">
                <NavLink to="/" end className={({ isActive }) => isActive ? "underline" : ""}>홈</NavLink>
              </Box>
              <Box className="hover-line">
                <NavLink to="/products" className={({ isActive }) => isActive ? "underline" : ""}>상품</NavLink>
              </Box>
              <Box className="hover-line">
                <NavLink to="/holiday" className={({ isActive }) => isActive ? "underline" : ""}>선물세트</NavLink>
              </Box>
              {authMember && (
                <Box className="hover-line">
                  <NavLink to="/orders" className={({ isActive }) => isActive ? "underline" : ""}>주문</NavLink>
                </Box>
              )}
              {authMember && (
                <Box className="hover-line">
                  <NavLink to="/member-page" className={({ isActive }) => isActive ? "underline" : ""}>마이페이지</NavLink>
                </Box>
              )}
              <Box className="hover-line">
                <NavLink to="/help" className={({ isActive }) => isActive ? "underline" : ""}>고객센터</NavLink>
              </Box>
            </Box>

            <Basket cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} onDelete={onDelete} onDeleteAll={onDeleteAll} />

            {!authMember ? (
              <Button variant="contained" className="login-btn" onClick={() => setLoginOpen(true)}>로그인</Button>
            ) : (
              <img className="user-avatar"
                src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"}
                alt="user" onClick={handleLogoutClick} />
            )}

            <IconButton
              className="navbar-hamburger-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="메뉴 열기"
            >
              <MenuIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)}
              onClose={handleCloseLogout} onClick={handleCloseLogout}
              slotProps={{ paper: { elevation: 0, sx: { overflow: "visible", filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.2))", mt: 1.5, borderRadius: "10px" } } }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
              <MenuItem onClick={handleLogoutRequest}>
                <ListItemIcon><Logout fontSize="small" sx={{ color: "#ff6b6b" }} /></ListItemIcon>
                로그아웃
              </MenuItem>
            </Menu>
          </Box>
        </Container>
      </div>

      <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* ── Hero section ── */}
      <div className="hero-section">
        {/* Animated background */}
        <div className="hero-bg-img" style={{ backgroundImage: "url('https://media.istockphoto.com/id/2180063904/ko/%EC%82%AC%EC%A7%84/%EC%8C%80-%EB%B0%98%EC%A3%BD-%EA%BB%8D%EC%A7%88%EA%B3%BC-%EA%B3%BC%EC%9D%BC-%EC%86%8D%EC%9D%84-%EC%B1%84%EC%9A%B4-%EB%A7%9B%EC%9E%88%EB%8A%94-%EB%8B%A4%EC%B1%84%EB%A1%9C%EC%9A%B4-%EC%95%84%EC%8B%9C%EC%95%84-%EB%96%A1-%EA%B3%BC%EC%9E%90.jpg?s=1024x1024&w=is&k=20&c=kSg30vh0QYx-m3ZQYp9M3xWquvjvWrMDaYHzSmkCBCc=')" }} />
        <div className="hero-overlay" />

        <Container>
          <Box className="hero-content-wrap">
            {/* Left: text */}
            <Box className="hero-text-col">
              <Box className="hero-eyebrow">🏆 &nbsp;한국 No.1 전통 떡 전문점</Box>

              <Box className="hero-title">
                정성으로 빚은<br />
                <span className="hero-title-accent">한국 전통 떡</span>
              </Box>

              <p className="hero-desc">
                매일 아침 신선하게 만든 떡을 바로 배송합니다.<br />
                수십 년 전통 레시피, 오늘 당신의 식탁에서.
              </p>

              <Box className="hero-btn-group">
                <Button
                  variant="contained"
                  className="hero-btn-main"
                  onClick={() => navigate("/products")}
                >
                  지금 주문하기
                </Button>
                <Button
                  variant="outlined"
                  className="hero-btn-ghost"
                  onClick={() => navigate("/holiday")}
                >
                  선물세트 보기
                </Button>
                {!authMember && (
                  <Button
                    variant="text"
                    className="hero-btn-ghost"
                    onClick={() => setSignupOpen(true)}
                    sx={{ borderColor: "rgba(254,202,87,0.4) !important", color: "#feca57 !important" }}
                  >
                    무료 회원가입
                  </Button>
                )}
              </Box>
            </Box>

            {/* Right: floating stat cards */}
            <Box className="hero-stats-col">
              <Paper className="hero-stat-chip" elevation={0}>
                <span className="hero-stat-num">1,200+</span>
                <span className="hero-stat-lbl">월간 주문 건수</span>
              </Paper>
              <Paper className="hero-stat-chip" elevation={0}>
                <span className="hero-stat-num">98%</span>
                <span className="hero-stat-lbl">고객 만족도</span>
              </Paper>
              <Paper className="hero-stat-chip" elevation={0}>
                <span className="hero-stat-num">당일</span>
                <span className="hero-stat-lbl">제조 & 발송</span>
              </Paper>
            </Box>
          </Box>
        </Container>

        {/* Scroll hint */}
        <Box className="hero-scroll-hint">
          <span>scroll</span>
          <div className="hero-scroll-line" />
        </Box>
      </div>
    </div>
  );
}
