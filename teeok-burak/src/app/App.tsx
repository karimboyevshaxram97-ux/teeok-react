import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./screens/homePage";
import ProductsPage from "./screens/productsPage";
import OrdersPage from "./screens/ordersPage";
import UserPage from "./screens/userPage";
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

function App() {
  const location = useLocation();
  const { setAuthMember } = useGlobals();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleLogoutClick = (e: T) => setAnchorEl(e.currentTarget);
  const handleCloseLogout = () => setAnchorEl(null);

  const handleLogoutRequest = async () => {
    try {
      const member = new MemberService();
      await member.logout();
      await sweetTopSuccessAlert("로그아웃 완료!", 700);
      setAuthMember(null);
    } catch (err) {
      sweetErrorHandling(Messages.error1);
    }
  };

  const navbarProps = {
    cartItems, onAdd, onRemove, onDelete, onDeleteAll,
    setSignupOpen, setLoginOpen,
    anchorEl, handleLogoutClick, handleCloseLogout, handleLogoutRequest,
  };

  return (
    <>
      {location.pathname === "/" ? (
        <HomeNavbar {...navbarProps} />
      ) : (
        <OtherNavbar {...navbarProps} />
      )}

      <Routes>
        <Route path="/products/*" element={<ProductsPage onAdd={onAdd} />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/member-page" element={<UserPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>

      <Footer />

      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleLoginClose={() => setLoginOpen(false)}
        handleSignupClose={() => setSignupOpen(false)}
      />
    </>
  );
}

export default App;
