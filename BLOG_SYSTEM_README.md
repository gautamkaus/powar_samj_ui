# Powar Community Blog System

## Overview
This document describes the implementation of a comprehensive blog system for the Powar Community platform, featuring user authentication, profile management, and a 10-second preview system for non-authenticated users.

## Features

### 🔐 Authentication & Profile Management
- **User Registration & Login**: Phone number and email-based authentication
- **Profile Management**: Complete user profile with personal information, location, and business details
- **Profile Picture**: Custom avatar support with fallback initials

### 📝 Blog System
- **Create Posts**: Rich text editor with image support and tagging
- **View Posts**: Grid layout with search and filtering capabilities
- **User Posts**: Individual user blog post collections
- **Search & Tags**: Advanced search functionality with tag-based categorization

### 👁️ Preview System
- **10-Second Preview**: Non-authenticated users can view blog content for 10 seconds
- **Auto-Blur**: Content automatically blurs after preview time expires
- **Login Prompt**: Seamless transition to authentication modal

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Beautiful Cards**: Material design-inspired blog post cards
- **Smooth Animations**: Hover effects and transitions
- **Dark/Light Mode**: Theme-aware components

## Database Schema

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500) NULL,
    tags VARCHAR(500) NULL,
    status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED') DEFAULT 'PUBLISHED',
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_title (title),
    INDEX idx_tags (tags),
    
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
```

### Supporting Tables
- **blog_comments**: For future comment functionality
- **blog_likes**: For future like/reaction system
- **user_profile**: Extended user profile information

## API Endpoints

### Public Routes (No Authentication Required)
- `GET /api/blog/posts` - Get all published blog posts
- `GET /api/blog/posts/search` - Search blog posts
- `GET /api/blog/posts/:id` - Get specific blog post
- `GET /api/blog/users/:userId/posts` - Get posts by user

### Protected Routes (Authentication Required)
- `POST /api/blog/posts` - Create new blog post
- `PUT /api/blog/posts/:id` - Update blog post
- `DELETE /api/blog/posts/:id` - Delete blog post

## Frontend Components

### Core Components
1. **Blog.tsx** - Main blog page with preview system
2. **CreateBlogPost.tsx** - Blog post creation modal
3. **UserProfile.tsx** - User profile management
4. **AuthModal.tsx** - Authentication interface

### Key Features
- **Preview Timer**: 10-second countdown for non-authenticated users
- **Auto-Blur**: Automatic content blurring after preview expires
- **Search Functionality**: Real-time search with debouncing
- **Responsive Grid**: Adaptive layout for different screen sizes

## User Experience Flow

### For Non-Authenticated Users
1. **Land on Blog Page**: See all published posts with 10-second preview timer
2. **Preview Content**: Read blog posts for 10 seconds
3. **Timer Expires**: Content blurs, login prompt appears
4. **Authentication**: Seamless transition to login/register modal

### For Authenticated Users
1. **Full Access**: Unlimited reading and interaction
2. **Create Posts**: Rich editor with image and tag support
3. **Profile Management**: Complete profile customization
4. **My Posts**: Personal blog post collection

## Technical Implementation

### Backend
- **Node.js/Express**: RESTful API with middleware
- **MySQL**: Relational database with proper indexing
- **JWT Authentication**: Secure token-based authentication
- **Validation**: Input validation and sanitization

### Frontend
- **React 18**: Modern React with hooks and context
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Shadcn/ui**: Beautiful, accessible components

### State Management
- **React Context**: Authentication and language state
- **Local State**: Component-level state management
- **API Integration**: RESTful API calls with error handling

## Security Features

- **JWT Tokens**: Secure authentication
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin handling
- **Rate Limiting**: API abuse prevention

## Performance Optimizations

- **Database Indexing**: Optimized query performance
- **Lazy Loading**: Component and image lazy loading
- **Debounced Search**: Efficient search implementation
- **Image Optimization**: Responsive image handling
- **Caching**: Browser and API response caching

## Future Enhancements

### Phase 2 Features
- **Comments System**: User interactions on posts
- **Like/Reaction System**: Social engagement features
- **Rich Text Editor**: Advanced content creation tools
- **Image Upload**: Direct file upload support
- **Categories**: Hierarchical content organization

### Phase 3 Features
- **Analytics Dashboard**: Post performance metrics
- **Moderation Tools**: Content approval workflow
- **Email Notifications**: User engagement alerts
- **Social Sharing**: Cross-platform content distribution
- **Mobile App**: Native mobile application

## Installation & Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure database connection in .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
```bash
# Run the blog schema SQL file
mysql -u username -p database_name < backend/database/blog_schema.sql
```

## Usage Examples

### Creating a Blog Post
```typescript
const newPost = await blogAPI.createPost({
  title: "My First Blog Post",
  content: "This is the content of my blog post...",
  image_url: "https://example.com/image.jpg",
  tags: ["community", "heritage", "culture"]
});
```

### Fetching Blog Posts
```typescript
const posts = await blogAPI.getAllPosts(1, 20, "heritage");
```

### User Profile Update
```typescript
const updatedProfile = await userAPI.updateProfile({
  first_name: "John",
  last_name: "Doe",
  about: "Community member passionate about heritage"
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests and documentation
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This blog system is designed to be scalable, secure, and user-friendly while maintaining the cultural heritage focus of the Powar Community platform.
