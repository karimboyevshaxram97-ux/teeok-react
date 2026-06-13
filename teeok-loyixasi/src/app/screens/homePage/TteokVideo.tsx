import { Box, Button, Container } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

const FLOATS = [
  { emoji: "🍡", top: "12%",  left: "8%",  size: 52, delay: "0s",    dur: "6s"  },
  { emoji: "🎋", top: "68%",  left: "5%",  size: 38, delay: "1.2s",  dur: "7s"  },
  { emoji: "🌸", top: "20%",  left: "88%", size: 44, delay: "0.6s",  dur: "5s"  },
  { emoji: "🍡", top: "75%",  left: "85%", size: 36, delay: "2s",    dur: "8s"  },
  { emoji: "🌕", top: "45%",  left: "92%", size: 50, delay: "0.3s",  dur: "6.5s"},
  { emoji: "🎑", top: "82%",  left: "42%", size: 32, delay: "1.8s",  dur: "7.5s"},
  { emoji: "✨", top: "8%",   left: "50%", size: 28, delay: "0.9s",  dur: "4.5s"},
  { emoji: "🌾", top: "55%",  left: "3%",  size: 40, delay: "2.5s",  dur: "6.8s"},
];

const CARDS = [
  { label: "30+ 년 전통", sub: "Since 1994" },
  { label: "5,000+",      sub: "월 판매량"  },
  { label: "★ 4.9",       sub: "고객 평점"  },
  { label: "당일 배송",    sub: "전국 가능"  },
];

export default function TteokVideo() {
  const navigate = useNavigate();

  return (
    <div className="tvid-section">
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box className="tvid-inner">

          {/* ── Left text ── */}
          <Box className="tvid-text">
            <span className="tvid-badge">🎬 브랜드 스토리</span>
            <h2 className="tvid-title">
              수백 년 전통,<br />
              <span className="tvid-accent">한 손으로 빚는 정성</span>
            </h2>
            <p className="tvid-desc">
              매일 새벽 직접 반죽하고 손으로 빚어낸 떡.<br />
              전통의 맛을 현대적 감성으로 전달합니다.
            </p>
            <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
              <Button variant="contained" className="tvid-btn-main"
                startIcon={<PlayArrowIcon />}
                onClick={() => navigate("/products")}>
                지금 주문하기
              </Button>
              <Button variant="outlined" className="tvid-btn-ghost"
                onClick={() => navigate("/holiday")}>
                선물세트 보기
              </Button>
            </Box>

            <Box className="tvid-stats">
              {CARDS.map((c) => (
                <Box key={c.label} className="tvid-stat">
                  <span className="tvid-stat-num">{c.label}</span>
                  <span className="tvid-stat-lbl">{c.sub}</span>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── Right animated stage ── */}
          <Box className="tvid-stage">
            {/* Rotating rings */}
            <Box className="tvid-ring tvid-ring-1" />
            <Box className="tvid-ring tvid-ring-2" />
            <Box className="tvid-ring tvid-ring-3" />

            {/* Pulsing glow core */}
            <Box className="tvid-glow" />

            {/* Floating emojis */}
            {FLOATS.map((f, i) => (
              <Box key={i} className="tvid-float"
                style={{
                  top: f.top, left: f.left,
                  fontSize: f.size,
                  animationDelay: f.delay,
                  animationDuration: f.dur,
                }}>
                {f.emoji}
              </Box>
            ))}

            {/* Center product showcase */}
            <Box className="tvid-center">
              <Box className="tvid-bowl">🍡</Box>
              <Box className="tvid-center-label">전통 떡</Box>
              <Box className="tvid-center-sub">Korean Rice Cake</Box>
            </Box>

            {/* Orbiting dots */}
            <Box className="tvid-orbit tvid-orbit-1">
              <Box className="tvid-dot" />
            </Box>
            <Box className="tvid-orbit tvid-orbit-2">
              <Box className="tvid-dot tvid-dot-gold" />
            </Box>
          </Box>

        </Box>
      </Container>
    </div>
  );
}
