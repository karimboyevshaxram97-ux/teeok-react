import { useState } from "react";
import {
  Dialog, DialogContent, Box, Button, Typography,
  TextField, Divider, CircularProgress,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { Messages } from "../../../lib/config";
import Swal from "sweetalert2";
import "../../../css/payment.css";

/* ── Types ── */
type PayMethod = "kakao" | "samsung" | "apple" | "card" | null;

interface CardForm {
  number: string;
  expiry: string;
  cvv: string;
  holder: string;
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  shippingCost: number;
  onSuccess: () => void;
}

/* ── Payment method config ── */
const PAY_METHODS = [
  {
    id: "kakao" as PayMethod,
    label: "카카오페이",
    sublabel: "KakaoPay",
    bg: "#FAE100",
    color: "#3C1E1E",
    logo: (
      <svg viewBox="0 0 60 20" width="64" height="22" fill="#3C1E1E">
        <text x="0" y="16" fontSize="13" fontWeight="800" fontFamily="Arial">Kakao</text>
        <text x="37" y="16" fontSize="13" fontWeight="400" fontFamily="Arial">Pay</text>
      </svg>
    ),
  },
  {
    id: "samsung" as PayMethod,
    label: "삼성페이",
    sublabel: "Samsung Pay",
    bg: "linear-gradient(135deg, #1B48C0, #0d2d85)",
    color: "#fff",
    logo: (
      <svg viewBox="0 0 80 20" width="80" height="22" fill="#fff">
        <text x="0" y="16" fontSize="12" fontWeight="700" fontFamily="Arial">Samsung</text>
        <text x="57" y="16" fontSize="12" fontWeight="400" fontFamily="Arial">Pay</text>
      </svg>
    ),
  },
  {
    id: "apple" as PayMethod,
    label: "Apple Pay",
    sublabel: "Touch / Face ID",
    bg: "#000",
    color: "#fff",
    logo: (
      <svg viewBox="0 0 70 20" width="70" height="22" fill="#fff">
        <text x="0" y="16" fontSize="14" fontFamily="Arial">🍎</text>
        <text x="22" y="16" fontSize="12" fontWeight="600" fontFamily="-apple-system,Arial">Pay</text>
      </svg>
    ),
  },
  {
    id: "card" as PayMethod,
    label: "신용 / 체크카드",
    sublabel: "VISA · Mastercard · 국내카드",
    bg: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
    color: "#fff",
    logo: <CreditCardIcon sx={{ fontSize: 28, color: "#fff" }} />,
  },
];

/* ── Card number formatter ── */
const fmtCardNum = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const fmtExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/* ════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════ */
export default function PaymentModal({
  open, onClose, cartItems, totalAmount, shippingCost, onSuccess,
}: PaymentModalProps) {
  const { authMember, setOrderBuilder } = useGlobals();
  const [step, setStep] = useState(0);         // 0=method 1=detail 2=done
  const [method, setMethod] = useState<PayMethod>(null);
  const [loading, setLoading] = useState(false);
  const [cardForm, setCardForm] = useState<CardForm>({ number: "", expiry: "", cvv: "", holder: "" });
  const [flipped, setFlipped] = useState(false);

  const grandTotal = totalAmount + shippingCost;

  /* ── Reset on close ── */
  const handleClose = () => {
    setStep(0); setMethod(null); setLoading(false);
    setCardForm({ number: "", expiry: "", cvv: "", holder: "" });
    onClose();
  };

  /* ── Select method ── */
  const handleSelectMethod = (m: PayMethod) => {
    setMethod(m);
    setStep(1);
  };

  /* ── Pay ── */
  const handlePay = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (method === "card") {
        if (!cardForm.number || !cardForm.expiry || !cardForm.cvv || !cardForm.holder)
          throw new Error("카드 정보를 모두 입력해 주세요.");
      }

      setLoading(true);
      await new Promise((r) => setTimeout(r, 1800)); // simulate gateway

      await new OrderService().createOrder(cartItems);
      setOrderBuilder(new Date());
      onSuccess();
      setLoading(false);
      setStep(2);
    } catch (err) {
      setLoading(false);
      handleClose();
      await sweetErrorHandling(err);
    }
  };

  /* ── Success continue ── */
  const handleDone = () => {
    handleClose();
    Swal.fire({
      icon: "success",
      title: "결제 완료!",
      html: `<b>₩${grandTotal.toLocaleString()}</b> 결제가 완료되었습니다.<br/>주문 내역에서 확인하세요.`,
      confirmButtonText: "확인",
      confirmButtonColor: "#ff6b6b",
      timer: 4000,
    });
  };

  /* ── Card preview computed ── */
  const cardDisplay = cardForm.number || "XXXX XXXX XXXX XXXX";
  const expiryDisplay = cardForm.expiry || "MM/YY";
  const holderDisplay = cardForm.holder.toUpperCase() || "CARD HOLDER";

  const selectedMethod = PAY_METHODS.find((p) => p.id === method);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>

        {/* ── Header ── */}
        <Box className="pm-header">
          {step > 0 && step < 2 && (
            <button className="pm-back" onClick={() => setStep(step - 1)}>
              <ArrowBackIcon sx={{ fontSize: 20 }} />
            </button>
          )}
          <Box>
            <Typography className="pm-title">
              {step === 0 && "결제 수단 선택"}
              {step === 1 && selectedMethod?.label}
              {step === 2 && "결제 완료"}
            </Typography>
            <Typography className="pm-sub">
              {step === 0 && "원하시는 결제 방식을 선택해 주세요"}
              {step === 1 && selectedMethod?.sublabel}
              {step === 2 && "주문이 성공적으로 접수됐습니다"}
            </Typography>
          </Box>
          <Box className="pm-lock"><LockIcon sx={{ fontSize: 14 }} /> SSL 보안</Box>
        </Box>

        {/* ── Order summary ── */}
        {step < 2 && (
          <Box className="pm-summary">
            <Box className="pm-summary-row">
              <span>상품 합계</span>
              <span>₩{totalAmount.toLocaleString()}</span>
            </Box>
            <Box className="pm-summary-row">
              <span>배송비</span>
              <span>{shippingCost > 0 ? `₩${shippingCost.toLocaleString()}` : "무료"}</span>
            </Box>
            <Divider sx={{ my: 1.2 }} />
            <Box className="pm-summary-row total">
              <span>총 결제금액</span>
              <span>₩{grandTotal.toLocaleString()}</span>
            </Box>
          </Box>
        )}

        {/* ════ STEP 0: Method selection ════ */}
        {step === 0 && (
          <Box className="pm-methods">
            {PAY_METHODS.map((pm) => (
              <button
                key={pm.id}
                className="pm-method-btn"
                style={{ background: pm.bg, color: pm.color } as any}
                onClick={() => handleSelectMethod(pm.id)}
              >
                <Box className="pm-method-logo">{pm.logo}</Box>
                <Box className="pm-method-info">
                  <span className="pm-method-label" style={{ color: pm.color }}>{pm.label}</span>
                  <span className="pm-method-sub" style={{ color: pm.color, opacity: 0.7 }}>{pm.sublabel}</span>
                </Box>
                <span className="pm-method-arrow" style={{ color: pm.color }}>›</span>
              </button>
            ))}
          </Box>
        )}

        {/* ════ STEP 1: Detail / Card form ════ */}
        {step === 1 && (
          <Box className="pm-detail">
            {method !== "card" ? (
              /* Simple Pay (KakaoPay / Samsung / Apple) */
              <Box className="pm-simple-pay">
                <Box
                  className="pm-simple-logo-box"
                  sx={{ background: selectedMethod?.bg as any }}
                >
                  {selectedMethod?.logo}
                </Box>
                <Typography className="pm-simple-msg">
                  {method === "kakao" && "카카오페이 앱으로 연결하여 간편하게 결제합니다."}
                  {method === "samsung" && "삼성페이 인증 후 결제가 진행됩니다."}
                  {method === "apple" && "Touch ID / Face ID로 안전하게 결제합니다."}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  className="pm-pay-btn"
                  sx={{ background: selectedMethod?.bg as any, color: selectedMethod?.color }}
                  onClick={handlePay}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: selectedMethod?.color }} /> : `₩${grandTotal.toLocaleString()} 결제하기`}
                </Button>
              </Box>
            ) : (
              /* Credit card form */
              <Box className="pm-card-section">
                {/* Card visual */}
                <Box
                  className={`pm-card-visual${flipped ? " flipped" : ""}`}
                  onClick={() => setFlipped(!flipped)}
                >
                  <Box className="pm-card-front">
                    <Box className="pm-card-chip">
                      <svg viewBox="0 0 32 24" width="32" height="24">
                        <rect width="32" height="24" rx="4" fill="#d4af37" />
                        <line x1="0" y1="8" x2="32" y2="8" stroke="#b8961e" strokeWidth="1" />
                        <line x1="0" y1="16" x2="32" y2="16" stroke="#b8961e" strokeWidth="1" />
                        <line x1="10" y1="0" x2="10" y2="24" stroke="#b8961e" strokeWidth="1" />
                        <line x1="22" y1="0" x2="22" y2="24" stroke="#b8961e" strokeWidth="1" />
                      </svg>
                    </Box>
                    <Box className="pm-card-wifi">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="rgba(255,255,255,0.7)">
                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                      </svg>
                    </Box>
                    <Box className="pm-card-number">{cardDisplay}</Box>
                    <Box className="pm-card-bottom">
                      <Box>
                        <Box className="pm-card-lbl">카드 소지자</Box>
                        <Box className="pm-card-val">{holderDisplay}</Box>
                      </Box>
                      <Box>
                        <Box className="pm-card-lbl">유효기간</Box>
                        <Box className="pm-card-val">{expiryDisplay}</Box>
                      </Box>
                      <Box className="pm-card-brand">
                        <svg viewBox="0 0 50 30" width="44" height="28">
                          <circle cx="18" cy="15" r="13" fill="#eb001b" opacity="0.9" />
                          <circle cx="32" cy="15" r="13" fill="#f79e1b" opacity="0.9" />
                        </svg>
                      </Box>
                    </Box>
                  </Box>
                  <Box className="pm-card-back">
                    <Box className="pm-card-stripe" />
                    <Box className="pm-card-cvv-row">
                      <Box className="pm-card-sig" />
                      <Box className="pm-card-cvv-box">
                        <Box className="pm-card-lbl">CVV</Box>
                        <Box className="pm-card-cvv-val">{cardForm.cvv || "•••"}</Box>
                      </Box>
                    </Box>
                    <Box className="pm-card-back-lbl">카드 뒷면을 클릭하면 앞면이 보입니다</Box>
                  </Box>
                </Box>

                {/* Form */}
                <Box className="pm-card-form">
                  <TextField
                    label="카드번호"
                    fullWidth size="small"
                    placeholder="0000 0000 0000 0000"
                    value={cardForm.number}
                    onChange={(e) => setCardForm((f) => ({ ...f, number: fmtCardNum(e.target.value) }))}
                    slotProps={{ htmlInput: { maxLength: 19 } }}
                    className="pm-input"
                  />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="유효기간" size="small" placeholder="MM/YY"
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm((f) => ({ ...f, expiry: fmtExpiry(e.target.value) }))}
                      slotProps={{ htmlInput: { maxLength: 5 } }}
                      className="pm-input"
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="보안코드 (CVV)" size="small" placeholder="•••"
                      type="password"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      onFocus={() => setFlipped(true)}
                      onBlur={() => setFlipped(false)}
                      slotProps={{ htmlInput: { maxLength: 4 } }}
                      className="pm-input"
                      sx={{ flex: 1 }}
                    />
                  </Box>
                  <TextField
                    label="카드 소지자 이름"
                    fullWidth size="small"
                    placeholder="HONG GILDONG"
                    value={cardForm.holder}
                    onChange={(e) => setCardForm((f) => ({ ...f, holder: e.target.value }))}
                    className="pm-input"
                  />
                </Box>

                <Button
                  fullWidth variant="contained"
                  className="pm-pay-btn"
                  onClick={handlePay}
                  disabled={loading}
                >
                  {loading
                    ? <><CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />처리 중...</>
                    : `₩${grandTotal.toLocaleString()} 결제하기`}
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* ════ STEP 2: Success ════ */}
        {step === 2 && (
          <Box className="pm-success">
            <Box className="pm-success-icon">
              <CheckCircleIcon sx={{ fontSize: 72, color: "#22c55e" }} />
            </Box>
            <Typography className="pm-success-title">결제 완료!</Typography>
            <Typography className="pm-success-amount">₩{grandTotal.toLocaleString()}</Typography>
            <Typography className="pm-success-sub">
              {selectedMethod?.label}로 결제가 완료되었습니다.<br />
              주문 내역에서 배송 현황을 확인하세요.
            </Typography>
            <Button fullWidth variant="contained" className="pm-pay-btn" onClick={handleDone}>
              확인
            </Button>
          </Box>
        )}

        {/* ── Footer ── */}
        {step < 2 && (
          <Box className="pm-footer">
            <LockIcon sx={{ fontSize: 12 }} /> 256-bit SSL 암호화로 안전하게 보호됩니다
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
