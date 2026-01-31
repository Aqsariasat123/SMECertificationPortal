# Database Setup

## Option 1: Using the SQL Dump (Recommended)

1. Create the PostgreSQL database:
```bash
createdb sme_certification_db
```

2. Import the dump:
```bash
psql -d sme_certification_db < database_dump.sql
```

## Option 2: Fresh Setup with Prisma

1. Update the `DATABASE_URL` in `server/.env`

2. Run Prisma migrations:
```bash
cd server
npx prisma db push
```

3. (Optional) Seed the database:
```bash
npx prisma db seed
```
