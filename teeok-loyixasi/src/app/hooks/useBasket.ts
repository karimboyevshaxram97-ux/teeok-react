import { useState } from "react";
import { CartItem } from "../../lib/types/search";
import { useGlobals } from "./useGlobals";
import { sweetLoginRequiredAlert } from "../../lib/sweetAlert";

const useBasket = () => {
  const { authMember, setLoginOpen } = useGlobals();
  const cartJson: string | null = localStorage.getItem("cartData");
  const currentCart = cartJson ? JSON.parse(cartJson) : [];
  const [cartItems, setCartItems] = useState<CartItem[]>(currentCart);

  const onAdd = (input: CartItem) => {
    if (!authMember) {
      sweetLoginRequiredAlert().then((confirmed) => {
        if (confirmed) setLoginOpen(true);
      });
      return;
    }
    setCartItems((prev) => {
      const exist = prev.find((item: CartItem) => item._id === input._id);
      const cartUpdate = exist
        ? prev.map((item: CartItem) =>
            item._id === input._id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prev, { ...input }];
      localStorage.setItem("cartData", JSON.stringify(cartUpdate));
      return cartUpdate;
    });
  };

  const onRemove = (input: CartItem) => {
    setCartItems((prev) => {
      const exist = prev.find((item: CartItem) => item._id === input._id);
      if (!exist) return prev;
      const cartUpdate =
        exist.quantity === 1
          ? prev.filter((item: CartItem) => item._id !== input._id)
          : prev.map((item: CartItem) =>
              item._id === input._id ? { ...item, quantity: item.quantity - 1 } : item
            );
      localStorage.setItem("cartData", JSON.stringify(cartUpdate));
      return cartUpdate;
    });
  };

  const onDelete = (input: CartItem) => {
    setCartItems((prev) => {
      const cartUpdate = prev.filter((item: CartItem) => item._id !== input._id);
      localStorage.setItem("cartData", JSON.stringify(cartUpdate));
      return cartUpdate;
    });
  };

  const onDeleteAll = () => {
    setCartItems([]);
    localStorage.removeItem("cartData");
  };

  return { cartItems, onAdd, onRemove, onDelete, onDeleteAll };
};

export default useBasket;
