import { useState } from "react";
import { Dialog, DialogContent, Box, TextField, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

interface AuthModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
  onDeleteAll: () => void;
  clearLikes: () => void;
}

export default function AuthenticationModal(props: AuthModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose, onDeleteAll, clearLikes } = props;
  const { setAuthMember } = useGlobals();
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");

  const handleKeyDown = (e: T) => {
    if (e.key === "Enter") {
      if (signupOpen) handleSignupRequest().then();
      else if (loginOpen) handleLoginRequest().then();
    }
  };

  const handleSignupRequest = async () => {
    try {
      if (!memberNick || !memberPhone || !memberPassword)
        throw new Error(Messages.error3);
      const input: MemberInput = { memberNick, memberPhone, memberPassword };
      const result = await new MemberService().signup(input);
      onDeleteAll();
      clearLikes();
      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
      if (!memberNick || !memberPassword) throw new Error(Messages.error3);
      const input: LoginInput = { memberNick, memberPassword };
      const result = await new MemberService().login(input);
      onDeleteAll();
      clearLikes();
      setAuthMember(result);
      handleLoginClose();
    } catch (err) {
      sweetErrorHandling(err).then();
      handleLoginClose();
    }
  };

  const formBox = { display: "flex", flexDirection: "column", alignItems: "center", gap: 2.5 };

  return (
    <>
      <Dialog open={signupOpen} onClose={handleSignupClose} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={formBox}>
            <Box className="auth-header">
              <PersonAddIcon sx={{ color: "#C85A2A", fontSize: 36 }} />
              <h2 className="auth-title">회원가입</h2>
              <p className="auth-sub">함께해 주셔서 감사합니다</p>
            </Box>
            <TextField fullWidth label="닉네임" variant="outlined" size="small"
              onChange={(e: T) => setMemberNick(e.target.value)} />
            <TextField fullWidth label="전화번호" variant="outlined" size="small"
              onChange={(e: T) => setMemberPhone(e.target.value)} />
            <TextField fullWidth label="비밀번호" type="password" variant="outlined" size="small"
              onChange={(e: T) => setMemberPassword(e.target.value)} onKeyDown={handleKeyDown} />
            <Button fullWidth variant="contained" startIcon={<PersonAddIcon />}
              onClick={handleSignupRequest} className="auth-submit-btn">
              회원가입
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={loginOpen} onClose={handleLoginClose} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={formBox}>
            <Box className="auth-header">
              <LoginIcon sx={{ color: "#C85A2A", fontSize: 36 }} />
              <h2 className="auth-title">로그인</h2>
              <p className="auth-sub">다시 만나서 반갑습니다</p>
            </Box>
            <TextField fullWidth label="닉네임" variant="outlined" size="small"
              onChange={(e: T) => setMemberNick(e.target.value)} />
            <TextField fullWidth label="비밀번호" type="password" variant="outlined" size="small"
              onChange={(e: T) => setMemberPassword(e.target.value)} onKeyDown={handleKeyDown} />
            <Button fullWidth variant="contained" startIcon={<LoginIcon />}
              onClick={handleLoginRequest} className="auth-submit-btn">
              로그인
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
