# LearnHub - Learning Management System

A comprehensive Learning Management System (LMS) built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean and responsive design using Tailwind CSS and shadcn/ui components
- **Authentication**: Secure user authentication with NextAuth.js
- **Role-Based Access**: Different dashboards and permissions for students, teachers, and admins
- **Course Management**: Create, edit, and publish courses with rich content
- **Content Management**: Upload videos, documents, and other materials
- **Progress Tracking**: Track student progress through courses
- **Payment Integration**: Process payments with Stripe, adapted for the Kenyan market
- **Analytics**: View detailed analytics about course performance and revenue

## Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Lucide Icons
  - shadcn/ui components

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL Database

- **Authentication**:
  - NextAuth.js

- **Payment Processing**:
  - Stripe

- **Deployment**:
  - Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- Stripe account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/learnhub.git
   cd learnhub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/lms?schema=public
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   STRIPE_API_KEY=your_stripe_api_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Visit [http://localhost:3000](http://localhost:3000) to see the application running.

## Project Structure

```
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/                # App router pages and layouts
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (dashboard)/    # Dashboard pages
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── ui/             # UI components
│   │   └── providers/      # Context providers
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript types
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Preparing for GitHub Push

To reduce the repository size before pushing to GitHub, use the provided cleanup script:

```bash
node clean-repo.js
```

This script will:
- Remove large directories like node_modules, .next, and temp directories
- Run git garbage collection to compress the repository
- Clean up unnecessary files

After cloning the repository, just run `npm install` to restore the node_modules.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Stripe](https://stripe.com/)
