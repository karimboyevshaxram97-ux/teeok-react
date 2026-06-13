import { Box, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HolidayBanner() {
  const navigate = useNavigate();

  return (
    <div className="holiday-promo">
      <Container>
        <Box className="holiday-promo-inner">
          <Box className="holiday-promo-emojis">🎁 🌕 🎋</Box>
          <h2 className="holiday-promo-title">명절 · 기념일 특별 선물세트</h2>
          <p className="holiday-promo-sub">
            추석, 설날, 생일, 결혼식 — 소중한 날을 전통 떡으로 더욱 특별하게
          </p>
          <Button
            variant="contained"
            className="holiday-promo-btn"
            onClick={() => navigate("/holiday")}
          >
            선물세트 보러가기
          </Button>
        </Box>
      </Container>
    </div>
  );
}
