import { Box, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/navbar.css";

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const BASE_ITEMS: NavItem[] = [
  { to: "/", label: "홈", end: true },
  { to: "/products", label: "상품" },
  { to: "/holiday", label: "선물세트" },
];

const AUTH_ITEMS: NavItem[] = [
  { to: "/orders", label: "주문" },
  { to: "/member-page", label: "마이페이지" },
];

const TAIL_ITEM: NavItem = { to: "/help", label: "고객센터" };

export default function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const { authMember } = useGlobals();
  const items = [...BASE_ITEMS, ...(authMember ? AUTH_ITEMS : []), TAIL_ITEM];

  return (
    <Drawer anchor="right" open={open} onClose={onClose} className="mobile-drawer">
      <Box className="mobile-drawer-panel" role="presentation">
        <Box className="mobile-drawer-header">
          <span className="mobile-drawer-logo">떡 <span>TTEOK</span></span>
          <IconButton onClick={onClose} className="mobile-drawer-close" aria-label="메뉴 닫기">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="nav" className="mobile-drawer-links">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `mobile-drawer-link${isActive ? " active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
}
