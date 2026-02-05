# Quick Start Guide

Get the Facebook Comment Moderation Bot up and running in minutes!

## 🚀 Prerequisites

Ensure you have installed:
- [Node.js 18+](https://nodejs.org/) 
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- [Git](https://git-scm.com/)

## ⚡ Quick Deploy (Docker - Recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/Sudan23/facebook-moderation-bot.git
cd facebook-moderation-bot
```

### 2. Set Environment Variables
```bash
# Create .env file in root directory
cat > .env << EOF
JWT_SECRET=$(openssl rand -base64 32)
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback
EOF
```

### 3. Start All Services
```bash
docker-compose up -d
```

### 4. Access the Application
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### 5. View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 6. Stop Services
```bash
docker-compose down
```

## 🔧 Manual Setup (Local Development)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor

# Start MongoDB (in separate terminal)
docker run -d -p 27017:27017 --name mongodb mongo:6

# Start backend server
npm run dev
```

Backend will be available at: http://localhost:5000

### Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env

# Start development server
npm start
```

Frontend will open automatically at: http://localhost:3000

## 🎯 First Steps After Installation

### 1. Verify Backend is Running
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

### 2. Access the Dashboard
1. Open browser to http://localhost:3000
2. You'll see the login page
3. Click "Login with Facebook"
4. For development, a mock token is created

### 3. Explore the Interface
- **Dashboard**: View statistics and sync comments
- **Comments**: Manage and moderate comments
- **Settings**: Configure moderation thresholds

## 📱 Facebook App Setup

To use real Facebook integration:

1. **Create Facebook App**
   - Go to https://developers.facebook.com/
   - Create a new app (Business type)
   - Add Facebook Login product

2. **Configure OAuth**
   - Add redirect URI: `http://localhost:5000/auth/facebook/callback`
   - Request permissions: `pages_read_engagement`, `pages_manage_posts`

3. **Get Credentials**
   - Copy App ID from Settings → Basic
   - Copy App Secret from Settings → Basic
   - Update `.env` files with these values

4. **Test OAuth Flow**
   - Restart backend: `docker-compose restart backend`
   - Login through the dashboard
   - Grant permissions to your app

## 🔍 Troubleshooting

### Backend Won't Start

**Issue**: MongoDB connection failed
```bash
# Solution: Check if MongoDB is running
docker ps | grep mongo

# If not running, start it
docker run -d -p 27017:27017 --name mongodb mongo:6
```

**Issue**: Port 5000 already in use
```bash
# Solution: Find and kill process using port
lsof -ti:5000 | xargs kill -9
```

### Frontend Won't Start

**Issue**: Port 3000 already in use
```bash
# Solution: Use different port
PORT=3001 npm start
```

**Issue**: Cannot connect to backend
```bash
# Solution: Check REACT_APP_API_URL in frontend/.env
# Should be: REACT_APP_API_URL=http://localhost:5000/api
```

### Docker Issues

**Issue**: Docker build fails
```bash
# Solution: Clean Docker cache
docker system prune -a
docker-compose build --no-cache
```

**Issue**: Container exits immediately
```bash
# Solution: Check logs
docker-compose logs backend
docker-compose logs frontend
```

## 📊 Test Data

For testing purposes, you can:

1. **Mock Comments**: Create test comments in MongoDB
2. **Sample Data**: Use the sync endpoint with test page ID
3. **Manual Testing**: Test each feature manually

## 🎓 Learning Path

1. **Start Here**: Explore the Dashboard UI
2. **Read Code**: Check backend/src/services/moderationService.js
3. **Test API**: Use curl or Postman to test endpoints
4. **Modify**: Try changing toxicity thresholds
5. **Deploy**: Learn Docker deployment

## 📚 Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [TESTING.md](TESTING.md) for testing guide
- Review [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for overview

## 🆘 Get Help

- Check [GitHub Issues](https://github.com/Sudan23/facebook-moderation-bot/issues)
- Review documentation files
- Create new issue if problem persists

## ✅ Verification Checklist

After installation, verify:

- [ ] Backend starts without errors
- [ ] MongoDB connects successfully
- [ ] Health endpoint returns 200
- [ ] Frontend builds and loads
- [ ] Can access login page
- [ ] Dashboard displays correctly
- [ ] All navigation links work
- [ ] No console errors in browser

## 🎉 Success!

You now have a fully functional Facebook Comment Moderation Bot!

### What You Can Do:
- ✅ Sync comments from Facebook pages
- ✅ View moderation statistics
- ✅ Manage comments (approve/hide/delete)
- ✅ Configure AI thresholds
- ✅ Auto-moderate toxic content

### Development Tips:
- Use `npm run dev` for auto-reload
- Check logs for debugging
- Test API with curl or Postman
- Modify components and see changes
- Learn from the well-commented code

---

**Happy Moderating! 🚀**

For more details, see the comprehensive documentation in this repository.
