import React, { useState } from "react";
import { Box, Button, IconButton, Badge, Menu } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import PaymentModal from "../payment/PaymentModal";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember } = useGlobals();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [payOpen, setPayOpen] = useState(false);

  if (!authMember) return null;

  const itemsPrice = cartItems.reduce((a: number, c: CartItem) => a + c.quantity * c.price, 0);
  const shippingCost = itemsPrice < 50000 ? 3000 : 0;
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleOrderClick = () => {
    handleClose();
    setPayOpen(true);
  };

  const handlePaySuccess = () => {
    onDeleteAll();
    navigate("/orders");
  };

  return (
    <Box className="hover-line">
      <IconButton onClick={handleClick}>
        <Badge badgeContent={cartItems.length} color="secondary">
          <ShoppingCartIcon sx={{ color: "#fff", fontSize: 22 }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.18))",
              mt: 1.5,
              borderRadius: "12px",
              "&:before": {
                content: '""', display: "block", position: "absolute",
                top: 0, right: 18, width: 10, height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)", zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box className="basket-frame">
          <Box className="basket-header">
            {cartItems.length === 0 ? (
              <p className="basket-empty">장바구니가 비어있습니다</p>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="basket-title">장바구니 ({cartItems.length})</span>
                <DeleteForeverIcon sx={{ cursor: "pointer", color: "#ff6b6b" }} onClick={() => { onDeleteAll(); handleClose(); }} />
              </Box>
            )}
          </Box>

          <Box className="basket-items">
            {cartItems.map((item: CartItem) => (
              <Box className="basket-item" key={item._id}>
                <CancelIcon className="basket-cancel" onClick={() => { onDelete(item); if (cartItems.length === 1) handleClose(); }} />
                <img
                  src={item.image ? `${serverApi}/${item.image}` : "/images/tteok1.jpg"}
                  className="basket-item-img"
                  alt={item.name}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/tteok1.jpg"; }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <span className="basket-item-name">{item.name}</span>
                  <p className="basket-item-price">₩{item.price.toLocaleString()} × {item.quantity}</p>
                </Box>
                <Box className="basket-qty">
                  <button onClick={() => onRemove(item)} className="qty-btn">−</button>
                  <button onClick={() => onAdd(item)} className="qty-btn">+</button>
                </Box>
              </Box>
            ))}
          </Box>

          {cartItems.length > 0 && (
            <Box className="basket-footer">
              <span className="basket-total">
                ₩{itemsPrice.toLocaleString()}
                {shippingCost > 0 && <small> +₩{shippingCost.toLocaleString()} 배송</small>}
              </span>
              <Button
                onClick={handleOrderClick}
                startIcon={<ShoppingCartIcon />}
                variant="contained"
                className="basket-order-btn"
              >
                결제하기
              </Button>
            </Box>
          )}
        </Box>
      </Menu>

      {/* Payment Modal */}
      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        cartItems={cartItems}
        totalAmount={itemsPrice}
        shippingCost={shippingCost}
        onSuccess={handlePaySuccess}
      />
    </Box>
  );
}
