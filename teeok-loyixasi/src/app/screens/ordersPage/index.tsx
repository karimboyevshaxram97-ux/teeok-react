import { useEffect, useState } from "react";
import {
  Box, Container, Tab, Tabs, Chip, Button, Skeleton, Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { retrieveFinishedOrders, retrievePausedOrders, retrieveProcessOrders } from "./selector";
import { Order, OrderInquiry, OrderUpdateInput } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../lib/sweetAlert";
import { Messages } from "../../../lib/config";
import "../../../css/order.css";

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

const ordersRetriever = createSelector(
  retrievePausedOrders,
  retrieveProcessOrders,
  retrieveFinishedOrders,
  (pausedOrders, processOrders, finishedOrders) => ({
    pausedOrders,
    processOrders,
    finishedOrders,
  })
);

const STATUS_LABEL: Record<string, string> = {
  PAUSE: "결제 완료",
  PROCESS: "처리 중",
  FINISH: "배송 완료",
  DELETE: "취소됨",
};

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());
  const { pausedOrders, processOrders, finishedOrders } =
    useSelector(ordersRetriever);
  const { authMember, orderBuilder, setOrderBuilder } = useGlobals();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authMember) return;
    const order = new OrderService();
    const base: OrderInquiry = { page: 1, limit: 10, orderStatus: OrderStatus.PAUSE };
    setLoading(true);

    Promise.all([
      order.getMyOrders({ ...base, orderStatus: OrderStatus.PAUSE }),
      order.getMyOrders({ ...base, orderStatus: OrderStatus.PROCESS }),
      order.getMyOrders({ ...base, orderStatus: OrderStatus.FINISH }),
    ])
      .then(([paused, process, finished]) => {
        setPausedOrders(paused);
        setProcessOrders(process);
        setFinishedOrders(finished);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [authMember, orderBuilder]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const input: OrderUpdateInput = { orderId, orderStatus: OrderStatus.DELETE };
      await new OrderService().updateOrder(input);
      await sweetTopSuccessAlert("주문이 취소되었습니다.", 1200);
      setOrderBuilder(new Date());
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  const tabs = [
    { label: "결제 완료", orders: pausedOrders, status: OrderStatus.PAUSE },
    { label: "처리 중", orders: processOrders, status: OrderStatus.PROCESS },
    { label: "배송 완료", orders: finishedOrders, status: OrderStatus.FINISH },
  ];

  const currentOrders = tabs[tab].orders;

  if (!authMember) {
    return (
      <div className="orders-page">
        <Container>
          <Box className="orders-login-prompt">
            <span className="orders-login-icon">🛍️</span>
            <h3>로그인이 필요합니다</h3>
            <p>주문 내역을 확인하려면 먼저 로그인해 주세요.</p>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Container>
        <Box className="orders-header">
          <h2 className="orders-title">내 주문 내역</h2>
          <p className="orders-sub">주문하신 상품의 배송 현황을 확인하세요</p>
        </Box>

        <Box className="orders-tabs-wrap">
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            className="orders-tabs"
          >
            {tabs.map((t, i) => (
              <Tab
                key={i}
                label={
                  <Box className="tab-label-wrap">
                    <span>{t.label}</span>
                    <span className="tab-count">{t.orders.length}</span>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Loading skeletons */}
        {loading && (
          <Box className="orders-list">
            {[1, 2, 3].map((i) => (
              <Box key={i} className="order-card">
                <Box className="order-card-header">
                  <Skeleton width={120} height={24} />
                  <Skeleton width={80} height={28} sx={{ borderRadius: 4 }} />
                </Box>
                <Box className="order-items">
                  {[1, 2].map((j) => (
                    <Box key={j} className="order-item">
                      <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 1 }} />
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <Skeleton width="60%" />
                        <Skeleton width="40%" />
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Skeleton width="30%" height={20} sx={{ ml: 2, mb: 2 }} />
              </Box>
            ))}
          </Box>
        )}

        {/* Order list */}
        {!loading && (
          <Box className="orders-list">
            {currentOrders.length === 0 ? (
              <Box className="no-orders">
                <span className="no-orders-icon">📦</span>
                <p>해당 상태의 주문이 없습니다</p>
              </Box>
            ) : (
              currentOrders.map((order: Order) => {
                const isPause = order.orderStatus === OrderStatus.PAUSE;
                return (
                  <Box key={order._id} className="order-card">
                    {/* Card header */}
                    <Box className="order-card-header">
                      <Box className="order-id-wrap">
                        <span className="order-id-label">주문번호</span>
                        <span className="order-id">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <span className="order-date">
                          {new Date(order.createdAt).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <Chip
                          label={STATUS_LABEL[order.orderStatus] ?? order.orderStatus}
                          size="small"
                          className={`order-status-chip status-${order.orderStatus.toLowerCase()}`}
                        />
                      </Box>
                    </Box>

                    {/* Order items */}
                    <Box className="order-items">
                      {order.orderItems.map((item) => {
                        const product: Product | undefined = order.productData?.find(
                          (p) => p._id === item.productId
                        );
                        const imgSrc = product?.productImages?.[0]
                          ? `${serverApi}/${product.productImages[0]}`
                          : "/images/tteok1.jpg";
                        const productName =
                          product?.productName ?? "상품 정보 없음";

                        return (
                          <Box key={item._id} className="order-item">
                            <img
                              src={imgSrc}
                              alt={productName}
                              className="order-item-img"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/images/tteok1.jpg";
                              }}
                            />
                            <Box className="order-item-info">
                              <p className="order-item-name">{productName}</p>
                              <p className="order-item-qty">
                                {item.itemQuantity}개 ×{" "}
                                ₩{item.itemPrice.toLocaleString()}
                              </p>
                            </Box>
                            <span className="order-item-subtotal">
                              ₩
                              {(item.itemQuantity * item.itemPrice).toLocaleString()}
                            </span>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Card footer */}
                    <Box className="order-card-footer">
                      <Box className="order-totals">
                        {order.orderDelivery > 0 && (
                          <span className="order-delivery">
                            배송비 +₩{order.orderDelivery.toLocaleString()}
                          </span>
                        )}
                        <span className="order-total">
                          합계 ₩{order.orderTotal.toLocaleString()}
                        </span>
                      </Box>
                      {isPause && (
                        <Button
                          size="small"
                          variant="outlined"
                          className="order-cancel-btn"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          주문 취소
                        </Button>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        )}
      </Container>
    </div>
  );
}
