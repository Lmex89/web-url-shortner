
# ============================================
# DOCKERFILE FOR REACT PRODUCTION (WITHOUT NGINX)
# ============================================

# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Install serve globally to serve static files
RUN npm install -g serve



# Expose port 3000
EXPOSE 3000


# Serve the built application
CMD [ "serve", "-s", "dist" ]
