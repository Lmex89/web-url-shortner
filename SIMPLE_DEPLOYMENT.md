# 🚀 Simple Docker Deployment (Port 3010)

## 📦 **Quick Deployment**

### **1. Deploy with Docker Compose**
```bash
# Set your API URL
export API_URL=http://192.168.68.53:9000

# Deploy production
docker-compose -f docker-compose.prod.yml up --build -d

# Verify deployment
curl http://localhost:3010
```

### **2. Or use the deployment script**
```bash
# Make script executable
chmod +x deploy.sh

# Deploy with your API URL
./deploy.sh -a http://192.168.68.53:9000 -d

# Application will be available at: http://localhost:3010
```

## 🔧 **Configuration**

### **Port Configuration:**
- **Application runs on**: Port 3010
- **Internal container port**: 3000
- **Mapping**: `3010:3000`

### **Environment Variables:**
```bash
REACT_APP_API_URL=http://192.168.68.53:9000
REACT_APP_USE_MOCK_API=false
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_ANALYTICS=true
```

## 🌐 **Nginx Proxy Manager Setup**

### **Proxy Host Configuration:**
- **Domain Names**: `your-domain.com`
- **Scheme**: `http`
- **Forward Hostname/IP**: `localhost` (or your server IP)
- **Forward Port**: `3010`
- **Cache Assets**: ✅ Enabled
- **Block Common Exploits**: ✅ Enabled

### **SSL Configuration:**
- **SSL Certificate**: Request new Let's Encrypt certificate
- **Force SSL**: ✅ Enabled
- **HTTP/2 Support**: ✅ Enabled

## 📋 **Quick Commands**

```bash
# Start application
docker-compose -f docker-compose.prod.yml up -d

# Stop application
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart application
docker-compose -f docker-compose.prod.yml restart

# Check status
docker-compose -f docker-compose.prod.yml ps

# Update and restart
docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d
```

## ✅ **Verification**

### **1. Check Application Status**
```bash
# Container status
docker ps | grep url-shortener

# Application health
curl -f http://localhost:3010/
```

### **2. Test Functionality**
- Open browser: `http://localhost:3010`
- Enter a long URL
- Verify URL shortening works
- Test copy to clipboard

### **3. Check Logs**
```bash
# Application logs
docker logs url-shortener-prod

# Follow logs in real-time
docker logs -f url-shortener-prod
```

## 🔧 **Customization**

### **Change Port (if needed):**
Edit `docker-compose.prod.yml`:
```yaml
ports:
  - "YOUR_PORT:3000"  # Change YOUR_PORT to desired port
```

### **Update API URL:**
Edit environment in `docker-compose.prod.yml`:
```yaml
environment:
  - REACT_APP_API_URL=http://your-new-api:port
```

## 🚨 **Troubleshooting**

### **Port Already in Use:**
```bash
# Check what's using port 3010
sudo lsof -i :3010

# Kill process if needed
sudo kill -9 PID
```

### **Container Won't Start:**
```bash
# Check logs
docker logs url-shortener-prod

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

### **API Connection Issues:**
```bash
# Test API from container
docker exec url-shortener-prod wget -qO- http://192.168.68.53:9000/health

# Check environment variables
docker exec url-shortener-prod env | grep REACT_APP
```

## 📊 **Production Setup**

Your application is now:
- ✅ Running on port **3010**
- ✅ Ready for **Nginx Proxy Manager**
- ✅ Optimized for **production**
- ✅ **No Traefik** dependencies
- ✅ Simple and clean setup

Access your application at: **http://localhost:3010** 🎉 