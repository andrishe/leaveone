# LeaveOne - Leave Management Application

Modern leave management system for SMEs, built with Next.js 15, React 19, Prisma, and PostgreSQL.

## 🚀 Features

- **Leave Request Management**
  - Create, approve, reject leave requests
  - Multiple leave types (paid leave, RTT, sick leave, etc.)
  - Half-day support
  - Business days calculation
  - Document attachment support

- **Leave Balance Tracking**
  - Automatic balance deduction on approval
  - Carry-over support for certain leave types
  - Real-time balance updates
  - Annual balance reset system

- **Approval Workflow**
  - Manager and admin approval roles
  - Email notifications on approval/rejection
  - Rejection reason requirement
  - Authorization checks

- **Multi-Tenancy**
  - Company-level data isolation
  - Custom company settings (working days, policies)
  - Subscription plans (Trial, Starter, Business, Enterprise)

- **User Management**
  - Role-based access control (Admin, Manager, Employee)
  - CSV/XLSX employee import
  - Manager assignment
  - User activation/deactivation

- **Security**
  - BetterAuth authentication with Argon2 password hashing
  - Rate limiting on API endpoints
  - Comprehensive input validation with Zod
  - Company-level data isolation

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (recommended: Neon)
- npm/yarn/pnpm/bun

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd leaveone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```bash
   # Database
   DATABASE_URL="postgresql://user:password@host/database"

   # Auth (generate with: openssl rand -base64 32)
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"

   # Email (optional for development)
   RESEND_API_KEY="your-resend-api-key"
   ```

   See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

4. **Set up the database**
   ```bash
   # Run migrations
   npx prisma migrate deploy

   # Seed the database with demo data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply a new migration
- `npx tsx scripts/annual-balance-reset.ts [year]` - Reset annual balances

## 🏗️ Project Structure

```
leaveone/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Dashboard pages
│   ├── api/                 # API routes
│   └── ...
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── admin/              # Admin components
│   ├── dashboard/          # Dashboard components
│   ├── leaves/             # Leave management components
│   └── ...
├── lib/                    # Utility libraries
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # BetterAuth configuration
│   ├── validation.ts      # Zod schemas
│   ├── errors.ts          # Error handling
│   ├── rate-limit.ts      # Rate limiting
│   ├── leave-balance.ts   # Balance management
│   └── ...
├── prisma/                # Database
│   ├── schema.prisma      # Prisma schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Seed data
├── emails/                # React Email templates
├── scripts/               # Utility scripts
├── __tests__/             # Test files
└── ...
```

## 🔒 Security

**IMPORTANT**: Never commit secrets to Git!

- See [SECURITY.md](./SECURITY.md) for detailed security guidelines
- Rotate all secrets before deploying to production
- Use environment variables for sensitive data
- Enable rate limiting on all API endpoints

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set up environment variables on your hosting platform

3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Start the server:
   ```bash
   npm start
   ```

## 📊 Database Maintenance

### Annual Balance Reset

Run at the beginning of each year:
```bash
npx tsx scripts/annual-balance-reset.ts 2025
```

This will:
- Calculate carry-over from previous year
- Reset all leave balances
- Initialize balances for the new year

### Backup

Recommended backup strategy:
- Daily automated backups via your database provider
- Weekly manual backups before major changes
- Test restore procedures regularly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📧 Support

For support, email support@leaveone.com or open an issue.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Database ORM: [Prisma](https://www.prisma.io)
- Authentication: [BetterAuth](https://www.better-auth.com)
- Hosting: [Vercel](https://vercel.com) & [Neon](https://neon.tech)
