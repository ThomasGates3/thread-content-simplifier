FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose ports
EXPOSE 5000

# Start backend server (frontend is built static)
CMD ["node", "server.js"]
