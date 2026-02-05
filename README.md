# Facebook Comment Moderation Bot 🤖

An AI-powered full-stack application for automated Facebook comment moderation with a comprehensive management dashboard. Built for educational purposes to demonstrate modern web development practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Facebook App Setup](#facebook-app-setup)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔧 Backend API
- **Express.js** server with comprehensive security middleware
- **MongoDB** database with Mongoose ORM
- **JWT-based** authentication system
- **AI moderation** using TensorFlow.js toxicity detection
- **Facebook Graph API** v18.0 integration
- RESTful API endpoints for comment management
- Automated comment syncing from Facebook pages
- Real-time moderation with configurable thresholds

### 🤖 AI Moderation Engine
- **TensorFlow.js** toxicity detection (6 categories)
- Sentiment analysis using keyword matching
- Configurable toxicity threshold (default: 0.7)
- Configurable sentiment threshold (default: -0.5)
- Auto-moderation actions (approve, hide, delete)

### 📱 Facebook Integration
- Fetch posts and comments from Facebook pages
- Hide toxic comments automatically
- Delete comments based on user settings
- Manage multiple Facebook pages per user
- Secure OAuth token handling

### 🎨 Frontend Dashboard
- Modern **React** with **Material-UI** components
- Login page with Facebook OAuth
- Dashboard with statistics cards and charts
- Comments management table with filtering
- Settings page for threshold configuration
- Responsive design for mobile and desktop
- Real-time data updates
- Protected routes requiring authentication

### 🐳 DevOps & Deployment
- Docker containers for all services
- Docker Compose for orchestration
- Environment variable management
- Production-ready build configurations
- Health check endpoints

## 🛠️ Technology Stack

### Backend
- **Node.js** 18+ with Express.js
- **MongoDB** 6 with Mongoose
- **TensorFlow.js** for AI moderation
- **Passport.js** for authentication
- **JWT** for session management
- **Helmet** & rate limiting for security

### Frontend
- **React** 18.2 with hooks
- **Material-UI** (MUI) v5 for components
- **React Router** v6 for navigation
- **Recharts** for data visualization
- **Axios** for API calls
- **React Query** for state management

### DevOps
- **Docker** & Docker Compose
- **Nginx** for frontend serving
- **MongoDB** with persistent volumes

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** 6 or higher ([Download](https://www.mongodb.com/try/download/community))
- **Docker** & **Docker Compose** (optional, for containerized deployment)
- **Facebook Developer Account** ([Sign up](https://developers.facebook.com/))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Sudan23/facebook-moderation-bot.git
cd facebook-moderation-bot
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

#### Backend Configuration

Create a `.env` file in the `backend` directory:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/facebook-moderation
JWT_SECRET=your_secure_random_jwt_secret_here
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback
CLIENT_URL=http://localhost:3000
FACEBOOK_API_VERSION=v18.0
```

#### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
```

## 🔑 Facebook App Setup

To use this application, you need to create a Facebook App:

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in app details:
   - **App Name**: Your app name
   - **Contact Email**: Your email
   - Click "Create App"

### Step 2: Configure Facebook Login

1. In your app dashboard, add "Facebook Login" product
2. Configure OAuth Redirect URIs:
   - Add `http://localhost:5000/auth/facebook/callback`
   - Add your production URL when deploying

### Step 3: Get App Credentials

1. Navigate to Settings → Basic
2. Copy your **App ID** and **App Secret**
3. Add these to your `.env` files

### Step 4: Request Permissions

Your app needs the following permissions:
- `pages_read_engagement` - Read page content
- `pages_manage_posts` - Manage page posts
- `pages_manage_metadata` - Access page metadata

## 💻 Local Development

### Start MongoDB

If running locally without Docker:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:6
```

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start at `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will start at `http://localhost:3000`

### Verify Installation

1. Check backend health: `http://localhost:5000/health`
2. Access frontend: `http://localhost:3000`

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Services

- **MongoDB**: `http://localhost:27017`
- **Backend API**: `http://localhost:5000`
- **Frontend Dashboard**: `http://localhost:3000`

### Environment Variables for Docker

Create a `.env` file in the root directory:

```env
JWT_SECRET=your_jwt_secret_change_this
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback
```

## 📚 API Documentation

### Authentication

All API endpoints (except `/health`) require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Health Check

```http
GET /health
```

Returns server health status.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

#### Sync Comments

```http
POST /api/comments/sync
```

Syncs comments from Facebook and analyzes them with AI.

**Request Body:**
```json
{
  "pageId": "your_facebook_page_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comments synced successfully",
  "data": {
    "newComments": 15,
    "updatedComments": 5,
    "totalFetched": 20
  }
}
```

#### Get Comments

```http
GET /api/comments?status=pending&page=1&limit=20
```

Retrieves comments with filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, hidden, deleted)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `isHateful` (optional): Filter by hateful flag (true/false)
- `isNegative` (optional): Filter by negative flag (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

#### Moderate Comment

```http
POST /api/comments/:id/moderate
```

Moderates a specific comment.

**Request Body:**
```json
{
  "action": "approve" // or "hide" or "delete"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment approved successfully",
  "data": { ... }
}
```

#### Get Statistics

```http
GET /api/comments/stats
```

Retrieves moderation statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1000,
    "pending": 50,
    "approved": 800,
    "hidden": 100,
    "deleted": 50,
    "hateful": 75,
    "negative": 120,
    "autoModerated": 150
  }
}
```

## 📁 Project Structure

```
facebook-moderation-bot/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Comment.js          # Comment schema
│   │   │   └── User.js             # User schema
│   │   ├── services/
│   │   │   ├── moderationService.js # AI moderation logic
│   │   │   └── facebookService.js   # Facebook API client
│   │   ├── controllers/
│   │   │   └── commentController.js # Comment endpoints
│   │   ├── routes/
│   │   │   └── index.js            # API routes
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT authentication
│   │   └── server.js               # Express app
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js        # Dashboard component
│   │   │   ├── CommentsList.js     # Comments table
│   │   │   ├── Settings.js         # Settings page
│   │   │   └── Login.js            # Login page
│   │   ├── App.js                  # Main app component
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env.example
│   └── .gitignore
├── docker-compose.yml              # Docker orchestration
├── README.md                       # This file
├── LICENSE                         # MIT License
└── .gitignore                      # Root gitignore
```

## ⚙️ Configuration

### Moderation Thresholds

Configure AI moderation thresholds in the Settings page:

- **Toxicity Threshold** (0-1): Comments with toxicity score above this value are flagged
  - Default: 0.7
  - Lower values = more strict

- **Sentiment Threshold** (-1 to 1): Comments with sentiment below this value are flagged
  - Default: -0.5
  - Higher values = more strict

### Auto-Moderation Actions

- **Auto-Hide**: Automatically hide flagged comments on Facebook
- **Auto-Delete**: Automatically delete flagged comments (use with caution!)

### AI Model Categories

The TensorFlow toxicity model detects:
- Toxic
- Severe toxic
- Obscene
- Threat
- Insult
- Identity hate

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] Server starts successfully
- [ ] MongoDB connects properly
- [ ] AI model loads on startup
- [ ] Health check endpoint responds
- [ ] All API endpoints return proper responses
- [ ] Frontend builds without errors
- [ ] Components render correctly
- [ ] Navigation works properly
- [ ] Authentication flow functions
- [ ] Docker containers build and run

## 🤝 Contributing

Contributions are welcome! This project is designed for educational purposes.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ES6+ features
- Follow existing code patterns
- Add comments for complex logic
- Write meaningful commit messages
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TensorFlow.js** team for the toxicity detection model
- **Facebook** for the Graph API
- **Material-UI** for the beautiful React components
- **MongoDB** for the database
- **Express.js** community

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## 🔒 Security

- Never commit `.env` files
- Keep your Facebook App Secret secure
- Use strong JWT secrets in production
- Regularly update dependencies
- Follow security best practices

## 🚀 Roadmap

Future enhancements:
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Bulk comment actions
- [ ] Comment history tracking
- [ ] Custom moderation rules
- [ ] Export reports to CSV/PDF
- [ ] Webhook support

---

**Made with ❤️ for educational purposes**
