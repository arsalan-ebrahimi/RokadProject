# ==========================================
# Base Image
# ==========================================
FROM node:22-alpine AS base

# Install libc6-compat (for native binaries) and curl/wget (for diagnostics/healthchecks)
RUN apk add --no-cache curl wget libc6-compat

WORKDIR /app

# Copy package dependency manifests
COPY package*.json ./

# ==========================================
# Development Target (Hot Reload via nodemon)
# ==========================================
FROM base AS development
ENV NODE_ENV=development

# Install all dependencies (including nodemon)
RUN npm install

# Copy application source code
COPY . .

# Ensure Public directory exists for uploads
RUN mkdir -p /app/Public

EXPOSE 5000

CMD ["npm", "run", "dev"]

# ==========================================
# Production Target (Optimized & Non-Root)
# ==========================================
FROM base AS production
ENV NODE_ENV=production

# Install only production dependencies
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Ensure Public directory exists and set proper permissions
RUN mkdir -p /app/Public && chown -R node:node /app

# Switch to non-root security user
USER node

EXPOSE 5000

CMD ["npm", "start"]
