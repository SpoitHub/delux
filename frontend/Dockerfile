FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Install dependencies (cache layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0"]
