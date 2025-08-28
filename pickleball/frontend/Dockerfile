# Stage 1: Build app with Vite
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files và cài dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ source
COPY . .

# Build production
RUN npm run build

# Stage 2: Serve với Nginx
FROM nginx:stable-alpine

# Copy file build từ Vite sang thư mục nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy file config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
