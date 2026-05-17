import { useEffect } from "react";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { useState } from "react";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { retrieveFinishedOrders, retrievePausedOrders, retrieveProcessOrders } from "./selector";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
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
  (pausedOrders, processOrders, finishedOrders) => ({ pausedOrders, processOrders, finishedOrders })
);

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } = actionDispatch(useDispatch());
  const { pausedOrders, processOrders, finishedOrders } = useSelector(ordersRetriever);
  const { authMember, orderBuilder } = useGlobals();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!authMember) return;
    const order = new OrderService();
    const base: OrderInquiry = { page: 1, limit: 5, orderStatus: OrderStatus.PAUSE };

    order.getMyOrders({ ...base, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data)).catch(console.log);
    order.getMyOrders({ ...base, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data)).catch(console.log);
    order.getMyOrders({ ...base, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data)).catch(console.log);
  }, [authMember, orderBuilder]);

  const currentOrders = [pausedOrders, processOrders, finishedOrders][tab];
  const labels = ["대기 중", "처리 중", "완료"];

  return (
    <div className="orders-page">
      <Container>
        <h2 className="orders-title">내 주문 내역</h2>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} className="orders-tabs">
          {labels.map((label, i) => (
            <Tab key={i} label={label} />
          ))}
        </Tabs>

        <Box className="orders-list">
          {currentOrders.length === 0 ? (
            <Box className="no-data">주문 내역이 없습니다</Box>
          ) : (
            currentOrders.map((order: Order) => (
              <Box key={order._id} className="order-card">
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className={`order-status status-${order.orderStatus.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </Box>
                <p className="order-total">합계: ₩{order.orderTotal.toLocaleString()}</p>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString("ko-KR")}</p>
              </Box>
            ))
          )}
        </Box>
      </Container>
    </div>
  );
}
