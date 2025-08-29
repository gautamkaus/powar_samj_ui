# Powar Pride Connect

A comprehensive platform for LGBTQ+ community connection, support, and resources.

## Project Structure

This project is organized into two main parts:

```
Powar/
├── frontend/          # React frontend application
└── backend/           # Node.js/Express backend API
```

## Frontend (`/frontend`)


A modern React application built with:
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** components for beautiful UI
- **React Router** for navigation
- **React Query** for data fetching
- **Internationalization** support

### Features
- Responsive design with mobile-first approach
- Multi-language support
- Modern component library
- Optimized build process

### Getting Started
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:8080`

## Backend (`/backend`)

A robust Node.js/Express API with:
- **Express.js** framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Input validation** with express-validator
- **Role-based access control**
- **RESTful API** design

### Features
- User authentication and authorization
- Community management (events, resources, discussions)
- File upload support
- Comprehensive error handling
- Security middleware (helmet, CORS)

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)

#### Community
- `GET /api/community/events` - Get all events
- `POST /api/community/events` - Create new event
- `PUT /api/community/events/:id` - Update event
- `DELETE /api/community/events/:id` - Delete event
- `POST /api/community/events/:id/join` - Join event
- `POST /api/community/events/:id/leave` - Leave event

- `GET /api/community/resources` - Get all resources
- `POST /api/community/resources` - Create new resource
- `PUT /api/community/resources/:id` - Update resource
- `DELETE /api/community/resources/:id` - Delete resource

- `GET /api/community/discussions` - Get all discussions
- `POST /api/community/discussions` - Create new discussion
- `PUT /api/community/discussions/:id` - Update discussion
- `DELETE /api/community/discussions/:id` - Delete discussion
- `POST /api/community/discussions/:id/comments` - Add comment
- `PUT /api/community/discussions/:id/comments/:commentId` - Update comment
- `DELETE /api/community/discussions/:id/comments/:commentId` - Delete comment

### Getting Started
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

The backend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/powar-pride-connect

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:8080

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## Database Models

### User
- Basic profile information
- Authentication details
- Community role and preferences
- Privacy settings

### Event
- Community events and meetups
- Participant management
- Location and scheduling

### Resource
- Educational materials
- Support resources
- File management

### Discussion
- Community forums
- Comment system
- Category organization

## Development

### Prerequisites
- Node.js 18+ 
- MongoDB 5+
- npm or yarn

### Installation
1. Clone the repository
2. Install frontend dependencies: `cd frontend && npm install`
3. Install backend dependencies: `cd backend && npm install`
4. Set up environment variables
5. Start MongoDB
6. Run both applications

### Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - Build TypeScript

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository.

