import { useState } from "react";
import {
  Box, Container, Grid, Paper, TextField, Button,
  Accordion, AccordionSummary, AccordionDetails, Typography,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationService from "../../services/NotificationService";
import "../../../css/help.css";

const FAQS = [
  { q: "주문 후 배송까지 얼마나 걸리나요?", a: "당일 오전 12시 이전 주문 시 당일 발송되며, 보통 1~2일 내에 수령하실 수 있습니다. 특별 주문 제품은 최대 3일이 소요될 수 있습니다." },
  { q: "환불 및 교환이 가능한가요?", a: "상품 수령 후 24시간 이내에 연락 주시면 환불 또는 교환이 가능합니다. 단, 식품 특성상 개봉된 제품은 교환이 어렵습니다. 불량 제품의 경우 전액 환불해 드립니다." },
  { q: "냉동·냉장 배송이 가능한가요?", a: "네, 냉동 및 냉장 배송 서비스를 모두 제공합니다. 주문 시 원하시는 배송 방식을 선택해 주세요. 냉동 배송은 별도 요금이 적용됩니다." },
  { q: "대량 주문 할인이 있나요?", a: "10만원 이상 주문 시 5% 할인, 20만원 이상 주문 시 10% 할인이 자동 적용됩니다. 기업 대량 주문(50만원 이상)은 별도 문의 시 추가 혜택을 드립니다." },
  { q: "알레르기 정보는 어디서 확인하나요?", a: "각 상품 페이지 상세 설명에 원재료 및 알레르기 유발 성분 정보가 표시됩니다. 추가 문의 사항은 고객센터(tteok@example.com)로 연락 주세요." },
  { q: "선물 포장 서비스가 있나요?", a: "네, 프리미엄 선물 포장 서비스를 제공합니다. 주문 시 '선물 포장' 옵션을 선택하시면 예쁜 포장과 함께 메시지 카드도 동봉해 드립니다." },
  { q: "유통기한은 얼마나 되나요?", a: "냉장 제품은 제조일로부터 3~5일, 냉동 제품은 30일입니다. 항상 신선한 제품을 당일 또는 전날 제조하여 발송합니다." },
  { q: "맞춤 제작 주문이 가능한가요?", a: "결혼식, 돌잔치 등 행사를 위한 맞춤 제작 주문이 가능합니다. 행사 최소 1주일 전에 문의 주시면 요청하신 디자인과 수량으로 제작해 드립니다." },
];

const INFO_CARDS = [
  { icon: <PhoneIcon sx={{ fontSize: 28 }} />, title: "전화 상담", value: "+82-10-1234-5678", sub: "평일 09:00 – 18:00" },
  { icon: <EmailIcon sx={{ fontSize: 28 }} />, title: "이메일", value: "tteok@example.com", sub: "24시간 접수 · 1일 내 답변" },
  { icon: <LocationOnIcon sx={{ fontSize: 28 }} />, title: "오시는 길", value: "서울시 종로구 인사동길 12", sub: "지하철 3호선 안국역 2번 출구" },
  { icon: <AccessTimeIcon sx={{ fontSize: 28 }} />, title: "영업시간", value: "매일 09:00 – 20:00", sub: "설날·추석 연휴 제외" },
];

export default function HelpPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await new NotificationService().createContact({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-page">
      {/* Hero */}
      <Box className="help-hero">
        <Container>
          <Box className="help-hero-content">
            <div className="help-hero-badge">🍡 고객 지원센터</div>
            <h1 className="help-hero-title">
              무엇을 <span>도와드릴까요?</span>
            </h1>
            <p className="help-hero-sub">언제나 최선을 다해 빠르게 답변 드리겠습니다</p>
          </Box>
        </Container>
      </Box>

      <Container>
        {/* Info cards */}
        <Grid container spacing={3} className="help-info-grid">
          {INFO_CARDS.map((card, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Paper className="help-info-card" elevation={0}>
                <Box className="help-info-icon">{card.icon}</Box>
                <Typography className="help-info-title">{card.title}</Typography>
                <Typography className="help-info-value">{card.value}</Typography>
                <Typography className="help-info-sub">{card.sub}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* FAQ */}
        <Box className="help-faq-section">
          <Box className="help-section-head">
            <span className="help-section-label">FAQ</span>
            <Typography className="help-section-title">자주 묻는 질문</Typography>
            <Typography className="help-section-sub">궁금한 점을 빠르게 해결해 드립니다</Typography>
          </Box>
          <Box className="help-faq-list">
            {FAQS.map((faq, i) => (
              <Accordion key={i} className="help-faq-item" disableGutters>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#ff6b6b" }} />}
                  className="help-faq-summary"
                >
                  <Box className="help-faq-q-wrap">
                    <span className="help-faq-q-num">Q{i + 1}</span>
                    <Typography className="help-faq-q">{faq.q}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails className="help-faq-a-wrap">
                  <Typography className="help-faq-a">{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Contact section — full-width bg */}
      <Box className="help-contact-section">
        <Container>
          <Box className="help-section-head">
            <span className="help-section-label">CONTACT</span>
            <Typography className="help-section-title">문의하기</Typography>
            <Typography className="help-section-sub">궁금하신 내용을 남겨주시면 빠르게 답변 드리겠습니다</Typography>
          </Box>

          {submitted ? (
            <Box className="help-contact-success">
              <span className="success-icon">✅</span>
              <Typography className="success-title">문의가 접수되었습니다!</Typography>
              <Typography className="success-text">
                빠른 시일 내에 이메일로 답변 드리겠습니다.<br />
                평균 답변 시간: 24시간 이내
              </Typography>
              <Button
                variant="outlined"
                className="help-back-btn"
                onClick={() => setSubmitted(false)}
              >
                새 문의 작성
              </Button>
            </Box>
          ) : (
            <Box className="help-contact-form-wrap">
              <form onSubmit={handleSubmit} className="help-contact-form">
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="이름" variant="outlined" required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="help-input"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="이메일" variant="outlined" type="email" required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="help-input"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth label="문의 내용" variant="outlined" multiline rows={6} required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="무엇이든 편하게 문의해 주세요."
                      className="help-input"
                    />
                  </Grid>
                  {error && (
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={{ color: "#e53935", fontSize: 14, fontWeight: 600 }}>
                        {error}
                      </Typography>
                    </Grid>
                  )}
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      className="help-submit-btn"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : null}
                    >
                      {loading ? "전송 중..." : "문의 보내기 →"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )}
        </Container>
      </Box>
    </div>
  );
}
