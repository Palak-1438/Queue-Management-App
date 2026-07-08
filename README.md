# QueueFlow - Modern Queue Management

QueueFlow is a premium SaaS dashboard tailored for complete queue management. Built from scratch to look and perform like a modern production application, drawing inspiration from high-quality design systems like Stripe, Linear, and Vercel.

## 🚀 Project Overview

QueueFlow provides secure and dynamic queue management with a beautiful interface. Admins can create distinct queues, issue tokens to visitors, and reorder, complete, or cancel tokens on-the-fly. Real-time statistics are visualized beautifully using animated charts.

## ✨ Features

- **Manager Login**: Secure authentication with NextAuth and bcrypt.
- **Dashboard & Analytics**: Track Active Queues, Wait Times, Completed Tokens, and visualize trends with Recharts.
- **Queue Creation & Listing**: Responsive card-based views.
- **Advanced Operations**: Drag/Move Up/Move Down tokens. Mark as Serving, Completed, or Cancelled.
- **Wait Time Calculations**: Smart duration tracking out of the box.
- **Export Capabilities**: Utilities to export data natively to CSV.
- **Premium UI/UX**: Dark/Light mode, Glassmorphism login, React Hook Form validations, Framer Motion animations, Radix UI toast notifications.

## 📸 Screenshots

![Dashboard Placeholder](#)
![Queue Management Placeholder](#)

## 🛠 Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- shadcn/ui & Radix Primitives
- Framer Motion, Lucide Icons, Recharts
- React Hook Form & Zod

**Backend**
- Next.js Server Actions
- Prisma ORM
- PostgreSQL (Neon via adapter)
- NextAuth.js (Auth.js)

**Deployment**
- Vercel (Frontend & Serverless Functions)

## 📦 Installation

\`\`\`bash
# Install all dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Apply Schema to Database
npx prisma db push

# Start the application
npm run build
npm start &
\`\`\`

## ⚙️ Environment Variables

Create a \`.env\` file at the root containing:

\`\`\`env
DATABASE_URL="postgres://user:password@localhost:5432/queueflow"
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

## 🗄 Database Setup & Prisma Commands

We use Prisma with a PostgreSQL provider. Standard commands:
- \`npx prisma db push\` to push schema without migrations tracking.
- \`npx prisma generate\` to rebuild TypeScript typings.
- \`npx ts-node prisma/seed.ts\` (or npm run seed if configured) to populate dummy data.

## 🌐 Deployment

This application is configured for a zero-touch deployment on Vercel. Connect your repository to Vercel, set your environment variables, and it will automatically run:
1. \`npm install\`
2. \`npx prisma generate\`
3. \`npm run build\`

## 📂 Folder Structure

- \`app/\` - Next.js App Router endpoints and layouts
- \`actions/\` - Server Actions for DB mutations
- \`components/\` - Highly reusable React Server & Client components
- \`hooks/\` - Custom utility hooks
- \`lib/\` - Shared configurations (Auth, Prisma, Validations)
- \`prisma/\` - Schema and Seeding scripts
- \`utils/\` - Global helper functions (CSV Export, etc.)

## 🔮 Future Improvements

- Add WebSocket support for real-time live-updating metrics across multiple clients.
- Print queue ticket capabilities directly to thermal printers.
- Role-Based Access Control (RBAC) to support standard user roles aside from Manager.
