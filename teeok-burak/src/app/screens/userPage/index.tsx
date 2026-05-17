import { Box, Button, Container, TextField } from "@mui/material";
import { useState } from "react";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";

export default function UserPage() {
  const { authMember, setAuthMember } = useGlobals();
  const [memberNick, setMemberNick] = useState<string>(authMember?.memberNick ?? "");
  const [memberPhone, setMemberPhone] = useState<string>(authMember?.memberPhone ?? "");
  const [memberAddress, setMemberAddress] = useState<string>(authMember?.memberAddress ?? "");
  const [memberDesc, setMemberDesc] = useState<string>(authMember?.memberDesc ?? "");
  const [memberImage, setMemberImage] = useState<string>("");

  const handleUpdate = async () => {
    try {
      const memberService = new MemberService();
      const result = await memberService.updateMember({
        memberNick, memberPhone, memberAddress, memberDesc, memberImage,
      });
      setAuthMember(result);
      await sweetTopSuccessAlert("업데이트 완료!", 1500);
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  const avatarSrc = authMember?.memberImage
    ? `${serverApi}/${authMember.memberImage}`
    : "/icons/default-user.svg";

  return (
    <div className="user-page">
      <Container>
        <Box className="user-inner" sx={{ display: "flex" }}>
          <Box className="user-avatar-wrap">
            <img src={avatarSrc} className="user-avatar-big" alt="avatar" />
            <p className="user-nick">{authMember?.memberNick}</p>
          </Box>

          <Box className="user-form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="닉네임" value={memberNick} onChange={(e: T) => setMemberNick(e.target.value)} size="small" />
            <TextField label="전화번호" value={memberPhone} onChange={(e: T) => setMemberPhone(e.target.value)} size="small" />
            <TextField label="주소" value={memberAddress} onChange={(e: T) => setMemberAddress(e.target.value)} size="small" />
            <TextField label="자기소개" value={memberDesc} multiline rows={3} onChange={(e: T) => setMemberDesc(e.target.value)} size="small" />
            <Button variant="contained" className="update-btn" onClick={handleUpdate}>
              수정하기
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
