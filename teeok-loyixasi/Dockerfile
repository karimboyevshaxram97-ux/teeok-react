FROM node:22-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
# npm ci talab qiladigan qat'iy lock-fayl mosligi Windows'da generatsiya
# qilingan lock bilan Linux konteyner o'rtasida platformaga xos optional
# bog'liqliklar tufayli buziladi — npm install shu holatda joriy platforma
# uchun to'g'ri qaror qabul qiladi.
RUN npm install

FROM deps AS build

WORKDIR /app

# CRA bu qiymatni build vaqtida client JS bundle'ga qattiq yozadi — shuning
# uchun runtime emas, aynan `docker build --build-arg` orqali kelishi shart.
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV CI=true

COPY . .

RUN npm run build

FROM nginx:1.27-alpine AS runner

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
