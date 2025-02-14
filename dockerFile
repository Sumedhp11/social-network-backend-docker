# Use Node Alpine as the base image
FROM node:alpine AS build

# Set working directory
WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache ffmpeg \
  && npm install -g typescript

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire source code
COPY . .

COPY .env .env


# Generate Prisma client and apply migrations
RUN npx prisma generate

# Build TypeScript code
RUN npm run build


# Set the environment to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Ensure Prisma migrations run on container start
CMD npx prisma migrate deploy && npm start
