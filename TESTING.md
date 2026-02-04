# Testing and Deployment Guide

## Quick Start Testing

### 1. Test Backend Locally

```bash
# Install dependencies
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values

# Start MongoDB (if not running)
docker run -d -p 27017:27017 --name mongodb mongo:6

# Start backend server
npm start
# Or for development with auto-reload:
npm run dev

# Test health endpoint
curl http://localhost:5000/health
```

### 2. Test Frontend Locally

```bash
# Install dependencies
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values

# Start development server
npm start

# Access at http://localhost:3000
```

### 3. Build for Production

```bash
# Backend - No build needed, runs directly
cd backend
npm install --production

# Frontend - Create production build
cd frontend
npm run build
# Build output in: frontend/build/
```

## Docker Deployment

### Quick Deploy with Docker Compose

```bash
# Create environment file in root directory
cat > .env << EOF
JWT_SECRET=your_secure_random_secret_here
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback
EOF

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Access services:
# - Backend API: http://localhost:5000
# - Frontend Dashboard: http://localhost:3000
# - MongoDB: localhost:27017
```

### Individual Docker Builds

```bash
# Build backend image
cd backend
docker build -t facebook-moderation-backend:latest .

# Build frontend image
cd frontend
docker build -t facebook-moderation-frontend:latest .

# Run backend container
docker run -d \
  -p 5000:5000 \
  --name backend \
  --env-file .env \
  facebook-moderation-backend:latest

# Run frontend container
docker run -d \
  -p 3000:80 \
  --name frontend \
  facebook-moderation-frontend:latest
```

### Stop and Clean Up

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Remove images
docker rmi facebook-moderation-backend:latest
docker rmi facebook-moderation-frontend:latest
```

## Testing Checklist

### Backend Tests

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Health check endpoint returns 200
- [ ] AI model loads (or gracefully skips if no internet)
- [ ] All API routes are accessible
- [ ] JWT authentication works
- [ ] CORS headers are set correctly
- [ ] Rate limiting is active

### Frontend Tests

- [ ] Build completes without errors
- [ ] No linting errors
- [ ] All pages render correctly
- [ ] Navigation works
- [ ] API calls are made to correct endpoints
- [ ] Loading states display
- [ ] Error handling works
- [ ] Responsive design on mobile

### Docker Tests

- [ ] Backend container builds successfully
- [ ] Frontend container builds successfully
- [ ] MongoDB container starts
- [ ] All services communicate
- [ ] Health checks pass
- [ ] Volumes persist data
- [ ] Networks are configured correctly

## API Testing

### Test Health Endpoint

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### Test with Authentication (requires valid JWT)

```bash
# Get comments
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/comments

# Get statistics
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/comments/stats
```

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Check MongoDB logs
docker logs facebook-moderation-mongodb

# Restart MongoDB
docker restart facebook-moderation-mongodb
```

**AI Model Loading Failed**
- This is expected without internet access
- Server will continue without AI features
- In production, ensure internet access for model download

**Port Already in Use**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Frontend Issues

**Build Fails**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API Connection Refused**
- Check backend is running on port 5000
- Verify REACT_APP_API_URL in .env
- Check CORS configuration in backend

### Docker Issues

**Container Won't Start**
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild without cache
docker-compose build --no-cache

# Remove all containers and start fresh
docker-compose down -v
docker-compose up -d --build
```

**Permission Issues**
```bash
# On Linux, you may need sudo for Docker commands
sudo docker-compose up -d
```

## Performance Optimization

### Backend

- Use production Node.js settings
- Enable compression middleware
- Implement caching for frequently accessed data
- Use connection pooling for MongoDB
- Scale with PM2 or Kubernetes

### Frontend

- Enable gzip compression in nginx
- Use CDN for static assets
- Implement lazy loading for components
- Optimize bundle size with code splitting
- Use production build for deployment

### Database

- Create indexes for frequently queried fields
- Use aggregation pipelines for complex queries
- Implement data archiving for old comments
- Regular backups of MongoDB data

## Security Best Practices

1. **Never commit .env files**
2. Use strong JWT secrets (32+ characters)
3. Enable HTTPS in production
4. Keep dependencies updated
5. Implement rate limiting
6. Sanitize user inputs
7. Use environment-specific configurations
8. Regular security audits

## Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb://production-mongo-host:27017/facebook-moderation
JWT_SECRET=<strong-random-secret>
FACEBOOK_APP_ID=<production-app-id>
FACEBOOK_APP_SECRET=<production-app-secret>
FACEBOOK_CALLBACK_URL=https://your-domain.com/auth/facebook/callback
CLIENT_URL=https://your-domain.com
```

### Deployment Platforms

**Option 1: VPS (DigitalOcean, AWS EC2, etc.)**
- Install Docker and Docker Compose
- Clone repository
- Set environment variables
- Run `docker-compose up -d`

**Option 2: Heroku**
- Use Heroku MongoDB addon
- Deploy with Heroku CLI
- Set config vars in Heroku dashboard

**Option 3: AWS/GCP/Azure**
- Use managed MongoDB (Atlas, DocumentDB)
- Deploy containers to ECS/GKE/AKS
- Use load balancers for scaling

**Option 4: Kubernetes**
- Create Kubernetes manifests
- Use Helm charts
- Configure ingress and services
- Use persistent volumes for MongoDB

## Monitoring and Logging

### Application Logs

```bash
# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend

# View all logs
docker-compose logs -f
```

### Health Monitoring

- Set up health check endpoints
- Use monitoring tools (Prometheus, Grafana)
- Configure alerts for downtime
- Track API response times
- Monitor database performance

## Backup and Recovery

### MongoDB Backup

```bash
# Backup MongoDB data
docker exec facebook-moderation-mongodb mongodump \
  --out /data/backup

# Copy backup from container
docker cp facebook-moderation-mongodb:/data/backup ./backup

# Restore from backup
docker exec -i facebook-moderation-mongodb mongorestore \
  /data/backup
```

### Automated Backups

Set up cron job for regular backups:
```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

## Support

For issues and questions:
- Check the [README.md](README.md)
- Review this testing guide
- Open an issue on GitHub
- Check existing issues for solutions
