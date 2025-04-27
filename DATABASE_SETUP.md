# Database Setup for LearnHub LMS

This guide will help you set up your database with comprehensive seed data including users, courses, categories, and chapters.

## Prerequisites

- PostgreSQL database (local or Neon)
- Node.js and npm installed
- Environment variables properly configured in `.env.local`

## Database Connection

1. Make sure your `.env.local` file has the correct DATABASE_URL:

   ```
   # For local PostgreSQL
   DATABASE_URL="postgresql://postgres:password@localhost:5432/lms?schema=public"
   
   # For Neon PostgreSQL
   DATABASE_URL="postgresql://username:password@endpoint/dbname"
   ```

## Running Database Setup

### Option 1: Using the setup script (recommended)

1. Make the setup script executable:
   ```bash
   chmod +x prisma/setup-db.sh
   ```

2. Run the setup script:
   ```bash
   ./prisma/setup-db.sh
   ```

### Option 2: Manual steps

1. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

2. Run database migrations:
   ```bash
   npx prisma migrate dev --name initial_migration
   ```

3. Seed the database with initial data:
   ```bash
   npm run seed
   ```

## Seed Data Overview

The seed script creates a comprehensive set of data for your LMS:

### Users

- **Admin**: admin@learnhub.com (password: admin123)
- **Teachers**: 6 teacher accounts with different specializations 
  - john@learnhub.com (password: teacher123) - Web Development
  - sarah@learnhub.com (password: teacher123) - Data Science
  - ahmed@learnhub.com (password: teacher123) - Mobile Development
  - lisa@learnhub.com (password: teacher123) - Design
  - michael@learnhub.com (password: teacher123) - Business
  - priya@learnhub.com (password: teacher123) - Marketing
- **Students**: 2 student accounts for testing
  - student1@example.com (password: student123)
  - student2@example.com (password: student123)

### Categories

- Web Development
- Data Science
- Mobile Development
- Business
- Design
- Marketing

### Courses

A total of 14 comprehensive courses across all categories:

- **Web Development**: 3 courses
  - Modern Full-Stack Web Development Bootcamp
  - Advanced JavaScript: Modern ES6+ Features
  - React and Next.js: Server-Side Rendering Mastery
  
- **Data Science**: 3 courses
  - Data Science and Machine Learning Bootcamp with Python
  - Deep Learning Specialization: Neural Networks and AI
  - Data Analytics and Visualization for Business
  
- **Mobile Development**: 2 courses
  - React Native: Build Mobile Apps for iOS and Android
  - Flutter Development: Cross-Platform Mobile Apps
  
- **Business**: 2 courses
  - Entrepreneurship: Start and Grow Your Business
  - Project Management Professional (PMP) Certification
  
- **Design**: 2 courses
  - UI/UX Design: Create User-Centered Digital Experiences
  - Graphic Design Masterclass
  
- **Marketing**: 2 courses
  - Digital Marketing Strategy and Implementation
  - Social Media Marketing Mastery

Each course includes 16 chapters with detailed titles and a free introduction.

## Database Maintenance

### Resetting the Database

If you need to reset the database and start fresh:

```bash
npx prisma migrate reset
```

This command will drop all tables, reapply migrations, and run the seed script.

### Viewing Database Data

You can use Prisma Studio to view and edit your database data:

```bash
npx prisma studio
```

This will open a web interface at http://localhost:5555 where you can browse and manage your data. 