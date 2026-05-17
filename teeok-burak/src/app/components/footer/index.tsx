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
              Traditsion ta'm, zamonaviy his
            </p>
          </Box>

          <Stack className="footer-links">
            <h4>Sahifalar</h4>
            <NavLink to="/">Bosh sahifa</NavLink>
            <NavLink to="/products">Mahsulotlar</NavLink>
            <NavLink to="/orders">Buyurtmalar</NavLink>
            <NavLink to="/member-page">Mening sahifam</NavLink>
          </Stack>

          <Stack className="footer-links">
            <h4>Ma'lumot</h4>
            <a href="#">Biz haqimizda</a>
            <a href="#">Yetkazib berish</a>
            <a href="#">Qaytarish siyosati</a>
            <a href="#">Aloqa</a>
          </Stack>

          <Stack className="footer-contact">
            <h4>Aloqa</h4>
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
