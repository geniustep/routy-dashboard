FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with cache
RUN npm ci --prefer-offline --no-audit

# Copy source files
COPY . .

# Build with increased memory and timeout
RUN NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=128" \
    npm run build || \
    (echo "Build failed, retrying with more memory..." && \
     NODE_OPTIONS="--max-old-space-size=6144" npm run build)

FROM nginx:1.27-alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


