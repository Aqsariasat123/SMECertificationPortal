# SME Certification Portal - Server Documentation

## Project Overview
A full-stack SME (Small & Medium Enterprise) certification and registry management portal for Dubai/UAE.

## Tech Stack
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend:** Node.js + Express.js, PostgreSQL + Prisma ORM, JWT Authentication
- **Ports:** Frontend :3000, Backend :5001

## Key Features
- SME Dashboard: Profile management, document uploads, certification application
- Investor Dashboard: Browse certified SMEs, request introductions, messaging
- Admin Dashboard: Review applications, manage users, support tickets, audit logs
- Support System: Real-time chat between users and admin
- Messaging: Real-time chat between investors and SMEs

## Project Structure
```
SMECertificationPortal/
├── client/          # Next.js frontend
├── server/          # Express.js backend
├── database/        # Database dumps and scripts
├── backups/         # Database backups
```

## Key Files
- `server/prisma/schema.prisma` - Database schema
- `server/src/controllers/` - API controllers (admin, sme, auth, etc.)
- `server/src/services/email.service.ts` - Email notifications
- `server/src/utils/auditLogger.ts` - Audit logging
- `client/src/app/admin/` - Admin dashboard pages
- `client/src/app/sme/` - SME dashboard pages

## Current Development Phase
**Phase 1 Hardening** (v6.4) - NAIWA Rebrand Complete

### Recently Completed
- Domain migration from naywa.ae to naiwa.ae
- Trade License Validation & Account Suspension (governance controls)
- Legal notification emails (async)
- isVerified field implementation
- Legal page update email notifications

### Pending Priority 1 (Critical)
- Document Version History (DocumentVersion table)
- Document-Level Status & Feedback
- Audit Logging Enhancements (DOCUMENT_REPLACED, ADMIN_DOCUMENT_VIEWED, EMAIL_SENT)
- Email Audit Log (EmailLog table)

### Pending Priority 2 (Important)
- Virus/Malware Scanning (file validation)
- Internal Dimensions Progress Indicator (X/5 reviewed)
- UBO Declaration & VAT Certificate documents

## Brand Guidelines
- Uses formal/professional tone for UAE government context
- See BRAND_VOICE_UX_WRITING_GUIDE.md for UX writing standards

## Production Deployment

**Live URL:** https://naiwa.ae (Primary)
**Legacy URLs:**
- https://naywa.ae (redirects to naiwa.ae)
- https://sme.byredstone.com (can be deprecated)

> **Full deployment documentation:** See `NAIWA_DEVELOPMENT.md` for complete server access, deployment commands, database operations, and troubleshooting.

### Quick Reference
- **LXC Container:** VMID 106, IP `10.10.10.241`
- **Proxmox Host:** `65.109.60.53`
- **Project Path:** `/var/www/sme-portal`

### Quick Commands
```bash
# Check status
ssh root@65.109.60.53
pct exec 106 -- pm2 list

# Restart services
pct exec 106 -- pm2 restart all

# View logs
pct exec 106 -- pm2 logs --lines 50
```

## Local Development Commands
```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev

# Database
npx prisma db push
npx prisma generate
```
