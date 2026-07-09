# ────────────────────────────────────────────────────
#  Stage 1: Build  (installs all deps + builds frontend)
# ────────────────────────────────────────────────────
FROM node:20-slim AS builder

# Install OS build tools required by better-sqlite3 (native addon)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Install dependencies first (layer cache friendly)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build the Vite frontend
COPY . .
RUN npm run build

# ────────────────────────────────────────────────────
#  Stage 2: Production runtime
# ────────────────────────────────────────────────────
FROM node:20-slim AS production

# Install OS tools needed at runtime by better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy built frontend and server source from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY server.ts tsconfig.json ./
COPY src ./src
COPY vite.config.ts ./

# Create a data directory for the SQLite database volume
RUN mkdir -p /usr/src/app/data

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/settings', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start the server
CMD ["npm", "start"]
