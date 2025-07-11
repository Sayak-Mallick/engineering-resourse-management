# Engineering Resource Management System

A full-stack web application for managing engineering resources, projects, and assignments with role-based access control and capacity tracking.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Project Manager, Team Lead, Engineer, User)
  - Secure password hashing with bcrypt

- **Project Management**
  - Create, read, update, and delete projects
  - Project status tracking (Planning, Active, On-Hold, Completed, Cancelled)
  - Priority levels (Low, Medium, High, Critical)
  - Budget tracking and technology stack management
  - Project timeline management

- **Engineer Management**
  - Comprehensive engineer profiles with skills, experience, and availability
  - Role-based engineer categorization
  - Capacity tracking and utilization monitoring
  - Skills-based filtering and search

- **Assignment Management**
  - Assign engineers to projects with role specifications
  - Allocation percentage tracking
  - Hours tracking and time management
  - Assignment status management

- **Dashboard & Analytics**
  - Real-time project statistics
  - Resource utilization metrics
  - Engineer capacity overview
  - Project progress tracking
  - Role-based dashboard views

### Technical Features
- **Backend**
  - Node.js with Express.js
  - MongoDB with Mongoose ODM
  - JWT authentication
  - Input validation with Joi
  - RESTful API design
  - Role-based middleware

- **Frontend**
  - React.js with modern hooks
  - Tailwind CSS for styling
  - React Router for navigation
  - React Toastify for notifications
  - Responsive design

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT, bcrypt
- **Validation**: Joi
- **CORS**: Enabled for frontend integration

### Frontend
- **Framework**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Notifications**: React Toastify
- **HTTP Client**: Fetch API

## 📁 Project Structure

```
engineering-resourse-management/
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.js
│   │   ├── ProjectController.js
│   │   ├── AssignmentController.js
│   │   ├── UserController.js
│   │   └── DashboardController.js
│   ├── Middlewares/
│   │   ├── AuthMiddleware.js
│   │   ├── AuthValidation.js
│   │   └── ValidationMiddleware.js
│   ├── Models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Assignment.js
│   │   └── db.js
│   ├── Routes/
│   │   ├── AuthRouter.js
│   │   ├── ProjectRouter.js
│   │   ├── AssignmentRouter.js
│   │   ├── UserRouter.js
│   │   └── DashboardRouter.js
│   ├── index.js
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Engineers.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils.js
│   │   ├── RefreshHandler.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vercel.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=8080
   MONGO_CONN=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📊 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `GET /projects/status/:status` - Get projects by status
- `POST /projects/:projectId/assign-engineer` - Assign engineer to project
- `DELETE /projects/:projectId/remove-engineer/:engineerId` - Remove engineer from project

### Assignments
- `GET /assignments` - Get all assignments
- `GET /assignments/engineer/:engineerId` - Get assignments by engineer
- `GET /assignments/project/:projectId` - Get assignments by project
- `POST /assignments` - Create new assignment
- `PUT /assignments/:id` - Update assignment
- `DELETE /assignments/:id` - Delete assignment
- `PUT /assignments/:id/hours` - Update hours worked
- `GET /assignments/capacity/:engineerId` - Get engineer capacity
- `GET /assignments/project/:projectId/resource-allocation` - Get project resource allocation

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/engineers` - Get all engineers
- `GET /users/project-managers` - Get all project managers
- `GET /users/dashboard/:id` - Get user dashboard data
- `GET /users/available-engineers` - Get available engineers

### Dashboard
- `GET /dashboard/stats` - Get overall dashboard statistics
- `GET /dashboard/project/:projectId/analytics` - Get project analytics
- `GET /dashboard/engineer/:engineerId/analytics` - Get engineer analytics
- `GET /dashboard/resource-capacity` - Get resource capacity overview

## 👥 User Roles & Permissions

### Admin
- Full system access
- Can manage all users, projects, and assignments
- Can view all analytics and reports

### Project Manager
- Can create and manage projects
- Can assign engineers to projects
- Can view project analytics and resource allocation
- Can manage project timelines and budgets

### Team Lead
- Can manage assignments
- Can update hours worked
- Can view team capacity and utilization
- Can assign engineers to projects

### Engineer
- Can view their own assignments
- Can update hours worked
- Can view their capacity and utilization
- Limited project management access

### User
- Basic system access
- Can view public project information
- Limited functionality

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Joi schema validation for all inputs
- **Role-based Access Control**: Middleware-based authorization
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## 📱 Features by Role

### Dashboard Views
- **Admin**: Complete system overview with all metrics
- **Project Manager**: Project-focused dashboard with team metrics
- **Engineer**: Personal assignment and capacity view
- **User**: Basic welcome screen

### Project Management
- **Admin/Project Manager**: Full CRUD operations
- **Team Lead**: Assignment management
- **Engineer**: View-only access to assigned projects

### Resource Management
- **Admin/Project Manager**: Full engineer management
- **Team Lead**: Assignment and capacity management
- **Engineer**: Personal profile management

## 🚀 Deployment

### Backend (Vercel)
The backend is configured for deployment on Vercel with the `vercel.json` configuration.

### Frontend (Vercel)
The frontend is configured for deployment on Vercel with the `vercel.json` configuration.

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 8080)
- `MONGO_CONN`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing

### Database Schema
The system uses three main collections:
- **users**: User accounts and profiles
- **projects**: Project information and metadata
- **assignments**: Engineer-project assignments and time tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please create an issue in the repository or contact the development team.

---

**Engineering Resource Management System** - Streamlining engineering resource allocation and project management. 
