# SME Certification Portal

A full-stack application for SME certification and registry management.

## Features

- **SME Dashboard**: Company profile management, document uploads, certification application
- **Investor Dashboard**: Browse certified SMEs, request introductions, messaging
- **Admin Dashboard**: Review applications, manage users, support tickets, audit logs
- **Support System**: Real-time chat between users and admin support
- **Messaging**: Real-time chat between investors and SMEs

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Aqsariasat123/SMECertificationPortal.git
cd SMECertificationPortal
```

2. Setup Backend:
```bash
cd server
npm install
cp .env.example .env
# Update .env with your database credentials
npx prisma db push
npm run dev
```

3. Setup Frontend:
```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```

4. (Optional) Import database with sample data:
```bash
psql -d sme_certification_db < database/database_dump.sql
```

### Default Ports
- Frontend: http://localhost:3001
- Backend: http://localhost:5001

## Project Structure

```
SMECertificationPortal/
├── client/          # Next.js frontend
├── server/          # Express.js backend
├── database/        # Database dumps and scripts
└── README.md
```

## License

MIT
