FROM node:18-alpine AS builder
WORKDIR /app
COPY admin-dashboard/package.json ./admin-dashboard/
RUN cd admin-dashboard && npm install
COPY admin-dashboard ./admin-dashboard
RUN cd admin-dashboard && npm run build
COPY client-app/package.json ./client-app/
RUN cd client-app && npm install
COPY client-app ./client-app
RUN cd client-app && npm run build

FROM nginx:alpine
COPY --from=builder /app/admin-dashboard/dist /usr/share/nginx/html/admin
COPY --from=builder /app/client-app/dist /usr/share/nginx/html/client
EXPOSE 80