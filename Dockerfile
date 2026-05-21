# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --ignore-scripts
COPY frontend/ .
ARG VITE_API_URL=/api
RUN VITE_API_URL=$VITE_API_URL npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY html/ /usr/share/nginx/view/
COPY nginx.conf /etc/nginx/conf.d/default.conf
