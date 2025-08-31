# Blog Website

A modern, responsive blog website built with React frontend and Node.js backend, featuring user authentication and full CRUD operations for blog posts.

## Features

- ✨ **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 🔐 **User Authentication** - Registration, login, and logout functionality
- 📝 **Blog Management** - Create, read, update, and delete blog posts
- 🎨 **Rich Text Editor** - WYSIWYG editor for creating beautiful blog posts
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔍 **Search & Filter** - Find posts easily with search and category filtering
- 💾 **Database** - MongoDB integration for data persistence
- 🚀 **Deployment Ready** - Configured for Heroku/Netlify deployment

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- React Query for state management
- React Hook Form for forms
- React Quill for rich text editing

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing


### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-website
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend (.env)
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Frontend (.env)
   cd ../frontend
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

4. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from frontend directory, in new terminal)
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Project Structure

```
blog-website/
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads
│   └── server.js          # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   └── services/      # API services
│   └── public/            # Static assets
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Blog Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## Deployment

### Backend (Heroku)
1. Create Heroku app
2. Set environment variables
3. Deploy with Git

### Frontend (Netlify)
1. Connect GitHub repository
2. Set build settings
3. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
