# Tasklr Dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy app
COPY . .

# Default envs (should be provided by host)
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
