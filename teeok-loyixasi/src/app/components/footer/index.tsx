import { Box, Container, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import "../../../css/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Stack className="footer-inner">
          <Box className="footer-brand">
            <h2 className="footer-logo">떡<span>TTEOK</span></h2>
            <p className="footer-desc">
              전통의 맛, 현대의 감성<br />
              정성을 담아 만든 한국 떡 전문점
            </p>
          </Box>

          <Stack className="footer-links">
            <h4>페이지</h4>
            <NavLink to="/">홈</NavLink>
            <NavLink to="/products">상품</NavLink>
            <NavLink to="/holiday">선물세트</NavLink>
            <NavLink to="/orders">주문</NavLink>
            <NavLink to="/member-page">마이페이지</NavLink>
          </Stack>

          <Stack className="footer-links">
            <h4>안내</h4>
            <a href="#">회사 소개</a>
            <a href="#">배송 안내</a>
            <a href="#">반품 정책</a>
            <NavLink to="/help">고객센터</NavLink>
          </Stack>

          <Stack className="footer-contact">
            <h4>연락처</h4>
            <p>📞 +82-10-1234-5678</p>
            <p>✉ tteok@example.com</p>
            <p>📍 Seoul, South Korea</p>
          </Stack>
        </Stack>

        <Box className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Tteok. All rights reserved.</p>
        </Box>
      </Container>
    </footer>
  );
}
