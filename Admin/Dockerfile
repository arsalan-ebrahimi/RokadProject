# ==========================================
# Base Image
# ==========================================
FROM node:22-alpine AS base

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# ==========================================
# Development Target (Vite Dev Server with HMR)
# ==========================================
FROM base AS development
ENV NODE_ENV=development

# Install all dependencies
RUN npm install

# Copy application source code
COPY . .

EXPOSE 5173

# Run Vite dev server binding to 0.0.0.0 for external container access
CMD ["npm", "run", "dev", "--", "--host"]

# ==========================================
# Builder Target (Build Production Static Bundle)
# ==========================================
FROM base AS builder
ENV NODE_ENV=production

# Install dependencies needed to build the app (vite, tailwind, etc.)
RUN npm install

# Copy source code
COPY . .

# Build application assets into /app/dist
RUN npm run build

# ==========================================
# Production Target (Lightweight Nginx Web Server)
# ==========================================
FROM nginx:1.27-alpine AS production

# Remove default Nginx HTML content
RUN rm -rf /usr/share/nginx/html/*

# Copy built SPA assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy production Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
