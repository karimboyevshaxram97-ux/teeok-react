import { Box, Container } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";

const SHOPS = [
  { name: "떡TTEOK 본점", addr: "서울시 종로구 인사동길 12", hours: "09:00 – 21:00", phone: "02-1234-5678" },
  { name: "떡TTEOK 강남점", addr: "서울시 강남구 테헤란로 45", hours: "10:00 – 22:00", phone: "02-9876-5432" },
  { name: "떡TTEOK 홍대점", addr: "서울시 마포구 홍익로 24", hours: "10:00 – 23:00", phone: "02-5555-1234" },
];

export default function MapSection() {
  return (
    <div className="map-section">
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Heading */}
        <Box className="map-heading">
          <Box className="section-title">매장 안내</Box>
          <Box className="section-sub">전국 떡TTEOK 매장에서 직접 맛보세요</Box>
        </Box>

        <Box className="map-body">
          {/* Google Maps iframe */}
          <Box className="map-iframe-wrap">
            <iframe
              className="map-iframe"
              title="Tteok shops Seoul"
              src="https://maps.google.com/maps?q=전통+떡집+서울&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>

          {/* Shop list */}
          <Box className="map-shop-list">
            {SHOPS.map((shop, i) => (
              <Box key={i} className="map-shop-card">
                <Box className="map-shop-num">{String(i + 1).padStart(2, "0")}</Box>
                <Box className="map-shop-info">
                  <h4 className="map-shop-name">{shop.name}</h4>
                  <Box className="map-shop-row">
                    <LocationOnIcon sx={{ fontSize: 14, color: "#ff6b6b" }} />
                    <span>{shop.addr}</span>
                  </Box>
                  <Box className="map-shop-row">
                    <AccessTimeIcon sx={{ fontSize: 14, color: "#ff6b6b" }} />
                    <span>{shop.hours}</span>
                  </Box>
                  <Box className="map-shop-row">
                    <PhoneIcon sx={{ fontSize: 14, color: "#ff6b6b" }} />
                    <span>{shop.phone}</span>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
