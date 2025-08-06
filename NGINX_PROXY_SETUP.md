# 🔒 Nginx Proxy Manager Setup Guide

## 📋 **Overview**

This guide shows how to set up the URL Shortener with Nginx Proxy Manager for SSL certificates and reverse proxy functionality.

## 🚀 **Quick Setup**

### 1. **Deploy URL Shortener**
```bash
# Set your API URL
export API_URL=http://192.168.68.53:9000

# Deploy the application
docker-compose -f docker-compose.prod.yml up -d

# Verify it's running
curl http://localhost:3000
```

### 2. **Configure Nginx Proxy Manager**

#### **Add Proxy Host:**
- **Domain Names**: `yourdomain.com` (or your actual domain)
- **Scheme**: `http`
- **Forward Hostname/IP**: `your-server-ip` or `localhost`
- **Forward Port**: `3000`
- **Cache Assets**: ✅ Enabled
- **Block Common Exploits**: ✅ Enabled
- **Websockets Support**: ✅ Enabled

#### **SSL Configuration:**
- **SSL Certificate**: Request a new certificate or use existing
- **Force SSL**: ✅ Enabled
- **HTTP/2 Support**: ✅ Enabled
- **HSTS Enabled**: ✅ Enabled
- **HSTS Subdomains**: ✅ Enabled (if needed)

## 🔧 **Docker Configuration**

### **Production Setup (Updated for NPM)**

The `docker-compose.prod.yml` now exposes port `3000` instead of `80`:

```yaml
services:
  url-shortener:
    ports:
      - "3000:3000"  # Expose for nginx proxy manager
    # ... rest of configuration
```

### **Network Configuration**

If running NPM and URL Shortener on the same Docker host:

```yaml
# Add to docker-compose.prod.yml
networks:
  url-shortener-prod-network:
    external: true  # Use NPM's network
    name: nginx-proxy-manager_default
```

Or create a shared network:

```bash
# Create shared network
docker network create nginx-proxy-network

# Update both NPM and URL Shortener to use this network
```

## 🌐 **Network Scenarios**

### **Scenario 1: Same Docker Host**
```bash
# URL Shortener and NPM on same server
# NPM forwards to: localhost:3000
# Or container name: url-shortener-prod:3000
```

### **Scenario 2: Different Servers**
```bash
# NPM on Server A, URL Shortener on Server B
# NPM forwards to: SERVER_B_IP:3000
```

### **Scenario 3: Docker Networks**
```bash
# Both in same Docker network
# NPM forwards to: url-shortener-prod:3000
```

## 📋 **NPM Configuration Examples**

### **Basic Proxy Host**
```
Domain: shortener.yourdomain.com
Forward to: localhost:3000
SSL: Let's Encrypt
```

### **Advanced Configuration**
```nginx
# Custom Nginx Configuration (Advanced tab in NPM)

# Optional: Add security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Optional: Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Optional: Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔍 **Verification Steps**

### 1. **Check Container Status**
```bash
docker-compose -f docker-compose.prod.yml ps
```

### 2. **Test Direct Access**
```bash
curl http://localhost:3000
```

### 3. **Test Through NPM**
```bash
curl https://yourdomain.com
```

### 4. **Check SSL Certificate**
```bash
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **502 Bad Gateway**
```bash
# Check if URL Shortener is running
docker logs url-shortener-prod

# Check if port 3000 is accessible
telnet localhost 3000

# Check NPM logs
docker logs nginx-proxy-manager
```

#### **SSL Certificate Issues**
```bash
# Check certificate status in NPM dashboard
# Verify domain DNS points to your server
# Check firewall rules for ports 80/443
```

#### **CORS Issues**
If you encounter CORS issues, add this to NPM custom config:
```nginx
add_header Access-Control-Allow-Origin "*" always;
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
```

## 📊 **Monitoring**

### **Health Checks**
```bash
# Container health
docker ps

# Application health
curl -f http://localhost:3000/ || echo "Health check failed"

# Through NPM
curl -f https://yourdomain.com/ || echo "NPM health check failed"
```

### **Logs**
```bash
# URL Shortener logs
docker logs -f url-shortener-prod

# NPM logs (if you have access)
docker logs -f nginx-proxy-manager
```

## 🔄 **Deployment Script Update**

Update the deployment script for NPM integration:

```bash
# Deploy with NPM integration
./deploy.sh -a http://192.168.68.53:9000 -p 3000 -d

# The app will be available at:
# - Direct access: http://localhost:3000
# - Through NPM: https://yourdomain.com
```

## 🎯 **Production Checklist**

- [ ] URL Shortener deployed and running on port 3000
- [ ] Nginx Proxy Manager configured with proxy host
- [ ] SSL certificate obtained and configured
- [ ] DNS pointing to your server
- [ ] Firewall rules allow ports 80/443
- [ ] Health checks passing
- [ ] Security headers configured
- [ ] Monitoring and logging set up

## 🔐 **Security Recommendations**

1. **Use strong SSL settings** in NPM
2. **Enable security headers** (CSP, HSTS, etc.)
3. **Keep containers updated** regularly
4. **Monitor access logs** for suspicious activity
5. **Use fail2ban** or similar for brute force protection
6. **Limit access** to Docker daemon and NPM admin

## 📝 **Example NPM Configuration**

### **Proxy Host Settings:**
```
Domain Names: shortener.example.com
Forward Hostname/IP: localhost  (or container name)
Forward Port: 3000
Cache Assets: ✅
Block Common Exploits: ✅
Websockets Support: ✅
```

### **SSL Settings:**
```
SSL Certificate: Request new certificate
Force SSL: ✅
HTTP/2 Support: ✅
HSTS Enabled: ✅
```

Your URL Shortener is now ready to work with Nginx Proxy Manager! 🎉 