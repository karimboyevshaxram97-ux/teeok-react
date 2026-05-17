import { Box, Button, Container, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
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

  return (
    <div className="home-navbar">
      <Container className="navbar-container">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0" }}>
          <NavLink to="/" className="navbar-logo">떡 <span>TTEOK</span></NavLink>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box className="hover-line">
              <NavLink to="/" end className={({ isActive }) => isActive ? "underline" : ""}>홈</NavLink>
            </Box>
            <Box className="hover-line">
              <NavLink to="/products" className={({ isActive }) => isActive ? "underline" : ""}>상품</NavLink>
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

            <Basket cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} onDelete={onDelete} onDeleteAll={onDeleteAll} />

            {!authMember ? (
              <Button variant="contained" className="login-btn" onClick={() => setLoginOpen(true)}>로그인</Button>
            ) : (
              <img className="user-avatar"
                src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"}
                alt="user" onClick={handleLogoutClick} />
            )}

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)}
              onClose={handleCloseLogout} onClick={handleCloseLogout}
              slotProps={{ paper: { elevation: 0, sx: { overflow: "visible", filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.2))", mt: 1.5, borderRadius: "10px" } } }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
              <MenuItem onClick={handleLogoutRequest}>
                <ListItemIcon><Logout fontSize="small" sx={{ color: "#C85A2A" }} /></ListItemIcon>
                로그아웃
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Hero */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "80px 0 40px" }}>
          <Box sx={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box className="hero-title">전통의 맛을 담은<br />한국 떡 전문점</Box>
            <Box className="hero-sub">The taste of tradition in every bite</Box>
            {!authMember && (
              <Button variant="contained" className="signup-btn" onClick={() => setSignupOpen(true)}>회원가입</Button>
            )}
          </Box>
          <Box className="hero-image-box">
            <div className="hero-img-circle"></div>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
