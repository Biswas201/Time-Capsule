﻿# Time Capsule - Delayed Messaging Platform

![Time Capsule Banner](https://i.imgur.com/JfQ5Y9E.png)  
*A full-stack MERN application for sending messages to future recipients*

## 📌 Features
- ✉️ Send messages to be delivered at a future date
- 🔒 JWT authentication & authorization
- 📬 Inbox for received messages
- ⏳ Scheduled message delivery with Node-Cron
- 📅 Rate limiting (5 messages/day/user)
- 📧 Email notifications via Nodemailer

## 🛠 Tech Stack
| Component       | Technology                          |
|-----------------|-------------------------------------|
| Frontend        | React, Redux Toolkit, Material-UI   |
| Backend         | Node.js, Express                    |
| Database        | MongoDB (Mongoose ODM)              |
| Authentication  | JWT, bcrypt                         |
| Job Scheduler   | node-cron                           |
| Deployment      | Vercel (Frontend), Render (Backend) |

## 💻 GitHub Repository
- **Main Branch**: `https://github.com/Biswas201/Time-Capsule`  
- **Frontend Code**: `/frontend` directory  
- **Backend Code**: `/backend` directory  
- **Issues**: Report bugs [here](https://github.com/Biswas201/Time-Capsule/issues)  

*(Note: Replace `your-username` with your actual GitHub username)*

## 📂 Project Structure
## 📂 Project Structure
time-capsule/
├── backend/ # Node.js + Express server
│ ├── config/ # DB connection
│ ├── controllers/ # Business logic
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API endpoints
│ ├── scheduler/ # Message delivery jobs
│ └── server.js # Entry point
│
├── frontend/ # React application
│ ├── public/ # Static assets
│ ├── src/ # React components
│ │ ├── features/ # Redux slices
│ │ ├── pages/ # Route components
│ │ └── store/ # Redux store
│ └── package.json
│
├── .env.example # Environment variables template
└── README.md # Project documentation


## 🛠 Local Development Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Git

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Update with your credentials
npm run dev
2. Frontend Setup
bash
cd frontend
npm install
cp .env.example .env  # Set REACT_APP_API_URL
npm start
Environment Variables
Create .env files in both folders:

Backend (.env)
ini
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/timecapsule
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password  # Enable 2FA & use App Password
FRONTEND_URL=http://localhost:3000
Frontend (.env)
ini
REACT_APP_API_URL=http://localhost:5000/api
🌐 Production Deployment
1. Backend on Render
Push code to GitHub

Create new Web Service on Render

Configure:

Build Command: npm install

Start Command: npm start

Add environment variables (same as local .env)

Deploy!

2. Frontend on Vercel
Import GitHub repo in Vercel

Set framework to Create React App

Add environment variable:

ini
REACT_APP_API_URL=https://your-render-backend.onrender.com/api
Deploy!

🔍 Debugging Tips
bash
# Check backend logs on Render:
render logs --service time-capsule-backend

# Test email delivery:
curl -X POST https://your-backend/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"recipient@example.com"}'
📜 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	User login
POST	/api/messages	Create new time capsule message
GET	/api/messages/sent	Get all sent messages
GET	/api/messages/:id	Get specific message
🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/fooBar)

Commit your changes (git commit -am 'Add some fooBar')

Push to the branch (git push origin feature/fooBar)

Create a new Pull Request

📄 License
MIT © [Your Name]


### Key Features of This README:
1. **Visual Hierarchy**: Clear sections with emojis for better scanning
2. **Deployment Guides**: Step-by-step for both Render and Vercel
3. **Environment Setup**: Separate instructions for local and production
4. **Troubleshooting**: Common issues and solutions
5. **API Documentation**: Essential endpoints for frontend integration

### How to Use:
1. Copy this entire content
2. Create a new `README.md` in your project root
3. Paste and customize:
   - Update MongoDB URI
   - Add your own screenshots
   - Modify license/author info
4. Commit to GitHub - it will automatically render formatted

This README follows GitHub Flavored Markdown standards and includes all necessary information for developers to run, deploy, and contribute to your project.
