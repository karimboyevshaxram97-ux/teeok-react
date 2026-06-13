import { useRef, useState } from "react";
import { Box, Button, Container, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";
import "../../../css/user.css";

export default function UserPage() {
  const { authMember, setAuthMember } = useGlobals();
  const fileRef = useRef<HTMLInputElement>(null);

  const [memberNick, setMemberNick] = useState(authMember?.memberNick ?? "");
  const [memberPhone, setMemberPhone] = useState(authMember?.memberPhone ?? "");
  const [memberAddress, setMemberAddress] = useState(authMember?.memberAddress ?? "");
  const [memberDesc, setMemberDesc] = useState(authMember?.memberDesc ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const avatarSrc = previewUrl
    ?? (authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await new MemberService().updateMember({
        memberNick,
        memberPhone,
        memberAddress,
        memberDesc,
        memberImage: imageFile ?? "",
      });
      setAuthMember(result);
      setEditing(false);
      setPreviewUrl(null);
      setImageFile(null);
      await sweetTopSuccessAlert("프로필이 업데이트되었습니다!", 1500);
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setSaving(false);
    }
  };

  if (!authMember) {
    return (
      <div className="user-page">
        <Container>
          <Box className="user-login-prompt">
            <PersonIcon sx={{ fontSize: 64, color: "#ddd" }} />
            <p>로그인이 필요합니다</p>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div className="user-page">
      <Container maxWidth="md">
        {/* Header banner */}
        <Box className="user-banner" />

        <Box className="user-main">
          {/* Avatar */}
          <Box className="user-avatar-section">
            <Box className="user-avatar-wrap">
              {avatarSrc ? (
                <img src={avatarSrc} className="user-avatar-img" alt="avatar" />
              ) : (
                <Box className="user-avatar-placeholder">
                  {authMember.memberNick?.[0]?.toUpperCase() ?? "U"}
                </Box>
              )}
              {editing && (
                <IconButton className="user-avatar-edit-btn" onClick={() => fileRef.current?.click()}>
                  <PhotoCameraIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
            </Box>

            <Box className="user-info-brief">
              <h2 className="user-nick">{authMember.memberNick}</h2>
              <p className="user-phone">{authMember.memberPhone || "전화번호 없음"}</p>
              {authMember.memberDesc && <p className="user-desc-brief">{authMember.memberDesc}</p>}
            </Box>

            <Box sx={{ ml: "auto" }}>
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  className="user-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  프로필 수정
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  className="user-save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "저장 중..." : "저장하기"}
                </Button>
              )}
            </Box>
          </Box>

          {/* Form */}
          <Box className="user-form-section">
            <h3 className="user-form-title">내 정보</h3>

            <Box className="user-form-grid">
              <Box className="user-form-field">
                <Box className="user-field-label">
                  <PersonIcon sx={{ fontSize: 16 }} /> 닉네임
                </Box>
                <TextField
                  fullWidth size="small" value={memberNick}
                  disabled={!editing}
                  onChange={(e: T) => setMemberNick(e.target.value)}
                  className={editing ? "user-input-active" : "user-input-disabled"}
                />
              </Box>

              <Box className="user-form-field">
                <Box className="user-field-label">
                  <PhoneIcon sx={{ fontSize: 16 }} /> 전화번호
                </Box>
                <TextField
                  fullWidth size="small" value={memberPhone}
                  disabled={!editing}
                  onChange={(e: T) => setMemberPhone(e.target.value)}
                  className={editing ? "user-input-active" : "user-input-disabled"}
                />
              </Box>

              <Box className="user-form-field" sx={{ gridColumn: "1 / -1" }}>
                <Box className="user-field-label">
                  <LocationOnIcon sx={{ fontSize: 16 }} /> 주소
                </Box>
                <TextField
                  fullWidth size="small" value={memberAddress}
                  disabled={!editing}
                  onChange={(e: T) => setMemberAddress(e.target.value)}
                  className={editing ? "user-input-active" : "user-input-disabled"}
                />
              </Box>

              <Box className="user-form-field" sx={{ gridColumn: "1 / -1" }}>
                <Box className="user-field-label">
                  <InfoIcon sx={{ fontSize: 16 }} /> 자기소개
                </Box>
                <TextField
                  fullWidth size="small" multiline rows={3}
                  value={memberDesc} disabled={!editing}
                  onChange={(e: T) => setMemberDesc(e.target.value)}
                  className={editing ? "user-input-active" : "user-input-disabled"}
                  placeholder="자기소개를 입력해주세요"
                />
              </Box>
            </Box>

            {editing && (
              <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                <Button
                  variant="text"
                  className="user-cancel-btn"
                  onClick={() => { setEditing(false); setPreviewUrl(null); setImageFile(null); }}
                >
                  취소
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
