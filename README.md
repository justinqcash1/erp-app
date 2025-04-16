# ERP Application README

## Overview

This is a comprehensive web-based ERP application designed specifically for managing trucking tickets, invoices, material-freight alignment, and scope changes. The application is built using Next.js, React, TypeScript, and Prisma with PostgreSQL, optimized for deployment on Vercel.

## Key Features

- **Trucking Ticket Management**
  - Material and hourly trucking ticket entry
  - Duplicate ticket detection
  - Status tracking (logged, invoiced, disputed, void)
  - Monthly uninvoiced ticket reporting for accrual

- **Invoice Verification System**
  - Invoice creation from trucking tickets
  - Rate verification against operations
  - Cost phase coding
  - Invoice-to-ticket matching

- **Material-Freight Tracking**
  - Material purchase recording
  - Linking materials to trucking tickets
  - Material-freight alignment reporting
  - Discrepancy identification

- **Scope Change Calculator**
  - Automatic cost adjustment based on scope changes
  - Impact reporting for revenue and costs
  - Change history tracking
  - Cost phase relationship management

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes (serverless functions)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Project Structure

```
erp-app/
├── prisma/                  # Database schema and migrations
│   └── schema.prisma        # Prisma schema definition
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── trucking-tickets/# Trucking ticket pages
│   │   ├── invoices/        # Invoice pages
│   │   ├── material-purchases/ # Material purchase pages
│   │   └── scope-change-calculator/ # Scope change pages
│   ├── components/          # Reusable React components
│   └── lib/                 # Utility functions and shared code
├── .env.example             # Example environment variables
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/erp-app.git
   cd erp-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your database connection string and other required variables.

4. Set up the database
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application is optimized for deployment on Vercel. See the [deployment documentation](deployment_documentation.md) for detailed instructions.

## Documentation

- [User Guide](user_guide.md) - Instructions for end users
- [Deployment Documentation](deployment_documentation.md) - Setup and deployment guide
- [Database Schema](database_schema.md) - Database design and relationships

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or raise an issue in the repository.
