FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
RUN addgroup -g 101 -S nonroot && adduser -S nonroot -u 101 -G nonroot
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/hrms-web/browser /usr/share/nginx/html
RUN chown -R nonroot:nonroot /var/cache/nginx /var/run /usr/share/nginx/html
USER nonroot
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
