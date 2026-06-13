import { useState, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import HomePage from "./screens/homePage";
import ProductsPage from "./screens/productsPage";
import OrdersPage from "./screens/ordersPage";
import UserPage from "./screens/userPage";
import HelpPage from "./screens/helpPage";
import HolidayPage from "./screens/holidayPage";
import HomeNavbar from "./components/headers/HomeNavbar";
import OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import AuthenticationModal from "./components/auth";
import "../css/app.css";
import { CartItem } from "../lib/types/search";
import useBasket from "./hooks/useBasket";
import { useGlobals } from "./hooks/useGlobals";
import MemberService from "./services/MemberService";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import { T } from "../lib/types/common";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();
  const { setAuthMember, authMember, clearLikes } = useGlobals();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleLogoutClick = (e: T) => setAnchorEl(e.currentTarget);
  const handleCloseLogout = () => setAnchorEl(null);

  const handleLogoutRequest = async () => {
    try {
      await new MemberService().logout();
    } catch (_) {}
    localStorage.removeItem("memberData");
    setAuthMember(null);
    onDeleteAll();
    clearLikes();
    await sweetTopSuccessAlert("로그아웃 완료!", 700);
  };

  const navbarProps = {
    cartItems, onAdd, onRemove, onDelete, onDeleteAll,
    setSignupOpen, setLoginOpen,
    anchorEl, handleLogoutClick, handleCloseLogout, handleLogoutRequest,
  };

  return (
    <>
      <ScrollToTop />
      {location.pathname === "/" ? (
        <HomeNavbar {...navbarProps} />
      ) : (
        <OtherNavbar {...navbarProps} />
      )}

      <Routes>
        <Route path="/products/*" element={<ProductsPage onAdd={onAdd} />} />
        <Route path="/orders" element={authMember ? <OrdersPage /> : <Navigate to="/" replace />} />
        <Route path="/member-page" element={authMember ? <UserPage /> : <Navigate to="/" replace />} />
        <Route path="/holiday" element={<HolidayPage onAdd={onAdd} />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/" element={<HomePage onAdd={onAdd} />} />
      </Routes>

      <Footer />

      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleLoginClose={() => setLoginOpen(false)}
        handleSignupClose={() => setSignupOpen(false)}
        onDeleteAll={onDeleteAll}
        clearLikes={clearLikes}
      />
    </>
  );
}

export default App;
