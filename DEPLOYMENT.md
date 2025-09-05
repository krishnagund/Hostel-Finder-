# HostelFinder - Deployment Guide

## 🚀 Production Deployment Checklist

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account for image storage
- Email service (Gmail with App Password recommended)

### Environment Variables

#### Frontend (.env)
```env
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_APP_NAME=HostelFinder
VITE_APP_VERSION=1.0.0
```

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostelfinder
JWT_SECRET=your_strong_jwt_secret_key_here
NODE_ENV=production

# Email Configuration
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Steps

#### 1. Backend Deployment (Railway/Heroku/Vercel)

1. **Prepare the server:**
   ```bash
   cd server
   npm install
   ```

2. **Set environment variables** in your hosting platform

3. **Deploy:**
   ```bash
   npm start
   ```

#### 2. Frontend Deployment (Vercel/Netlify)

1. **Build the project:**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variables

#### 3. Database Setup

1. **MongoDB Atlas:**
   - Create a new cluster
   - Whitelist your server IP
   - Get connection string
   - Update MONGODB_URI in .env

#### 4. Image Storage Setup

1. **Cloudinary:**
   - Create account
   - Get API credentials
   - Update Cloudinary config in .env

### Features Included

✅ **User Authentication**
- Registration/Login with email verification
- Role-based access (Student/Owner/Admin)
- Password reset functionality

✅ **Property Management**
- Property listing with images
- Search and filter properties
- Favorites system
- Property details modal

✅ **Messaging System**
- Student-Owner communication
- WhatsApp, SMS, Call, Email integration
- Read/unread status tracking

✅ **Admin Dashboard**
- User management
- Property management
- Statistics and analytics

✅ **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimized
- Modern UI with Tailwind CSS

✅ **Multi-language Support**
- English and Hindi
- Easy language switching

### Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- File upload security

### Performance Optimizations

- Image optimization with Cloudinary
- Lazy loading
- Responsive images
- Code splitting
- Caching strategies

### Monitoring & Analytics

- Error logging
- User activity tracking
- Property view statistics
- Message interaction logging

### Support

For deployment issues or questions, please check:
1. Environment variables are correctly set
2. Database connection is working
3. CORS settings allow your frontend domain
4. All required services are running

### Production Checklist

- [ ] Environment variables configured
- [ ] Database connected and tested
- [ ] Email service working
- [ ] Image uploads working
- [ ] All API endpoints tested
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Error monitoring set up
- [ ] Backup strategy implemented

