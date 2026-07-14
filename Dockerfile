# Development Dockerfile
FROM node:20-slim

# Install necessary OS dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package metadata first to leverage cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy application files
COPY . .

# Expose Nuxt default port
EXPOSE 3000

# Start development server
CMD ["pnpm", "run", "dev"]
