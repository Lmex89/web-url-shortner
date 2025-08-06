# ============================================
# DOCKERFILE FOR REACT PRODUCTION (WITHOUT NGINX)
# ============================================

# Use official Node.js runtime as base image
FROM node:20-alpine

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

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Change ownership of app directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 3000
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3010/ || exit 1

# Serve the built application
CMD ["serve", "-s", "build", "-l", "3010"] 
