import { Box, Container, Grid } from "@mui/material";

const FEATURES = [
  { emoji: "🌾", title: "당일 제조", desc: "매일 아침 신선하게 만들어 당일 발송합니다" },
  { emoji: "🏺", title: "전통 방식", desc: "수십 년 전통 레시피로 정성껏 만든 떡" },
  { emoji: "🚚", title: "안전한 배송", desc: "냉장·냉동 배송으로 신선함을 그대로 전달합니다" },
  { emoji: "💰", title: "합리적 가격", desc: "좋은 재료, 착한 가격으로 더 많이 드립니다" },
];

export default function BrandFeatures() {
  return (
    <div className="brand-features">
      <Container>
        <Box className="section-title">왜 저희 떡인가요?</Box>
        <Box className="section-sub">전통의 맛과 현대의 감성이 만나는 곳</Box>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {FEATURES.map((feat, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Box className="brand-card">
                <span className="brand-emoji">{feat.emoji}</span>
                <h3 className="brand-title">{feat.title}</h3>
                <p className="brand-desc">{feat.desc}</p>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
