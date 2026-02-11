# Naywa Development & Deployment Guide

## Project Overview
**Naywa** - SME Certification Platform for UAE businesses.

**Live URL:** https://naywa.ae

---

## Infrastructure

### Production Server (LXC Container)
| Property | Value |
|----------|-------|
| **Proxmox Host** | 65.109.60.53 (Hetzner) |
| **LXC VMID** | 106 |
| **LXC Name** | `sme-portal` |
| **LXC IP** | 10.10.10.241 |
| **OS** | Ubuntu 22.04 |
| **Project Path** | `/var/www/sme-portal` |

### Services
| Service | Port | PM2 Name |
|---------|------|----------|
| Backend API | 5001 | `sme-server` |
| Frontend (Next.js) | 3000 | `sme-client` |
| PostgreSQL | 5432 | - |

### Domain & SSL
| Domain | SSL | Expires |
|--------|-----|---------|
| naywa.ae | Let's Encrypt | 2026-05-12 |
| www.naywa.ae | Let's Encrypt | 2026-05-12 |

---

## Server Access

### Via Proxmox Host (Recommended)
```bash
# SSH to Proxmox
ssh root@65.109.60.53

# Execute commands in LXC
pct exec 106 -- <command>

# Examples:
pct exec 106 -- pm2 list
pct exec 106 -- pm2 logs
pct exec 106 -- bash
```

### Direct SSH to LXC (from internal network)
```bash
ssh root@10.10.10.241
# Password: Jash123qwe..
```

---

## Deployment Commands

### Check Status
```bash
# From Proxmox host
pct exec 106 -- pm2 list
pct exec 106 -- pm2 logs --lines 50
```

### Restart Services
```bash
pct exec 106 -- pm2 restart all
```

### Pull Latest Changes & Rebuild
```bash
# SSH into LXC first
pct exec 106 -- bash

# Inside LXC:
cd /var/www/sme-portal

# Pull latest code
git pull origin main

# Rebuild client
cd client && npm run build

# Restart services
pm2 restart all
```

### Database Operations
```bash
# Inside LXC
cd /var/www/sme-portal/server

# Run migrations
npx prisma db push

# Generate Prisma client
npx prisma generate

# Database connection
PGPASSWORD=Jash123qwe.. psql -U sme_user -d sme_portal
```

---

## Configuration Files

### Server Environment (`/var/www/sme-portal/server/.env`)
```env
DATABASE_URL=postgresql://sme_user:Jash123qwe..@localhost:5432/sme_portal?schema=public
JWT_SECRET=sme-portal-jwt-secret-key-2024-production-secure-token
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://naywa.ae
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=catalyst@theredstone.ai
SMTP_PASS=eabmyznwwllfibsj
FROM_EMAIL=catalyst@theredstone.ai
```

### Client Environment (`/var/www/sme-portal/client/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://naywa.ae/api
```

### Nginx Config (`/etc/nginx/sites-available/naywa.ae`)
- Proxies `/api` to `10.10.10.241:5001`
- Proxies `/uploads` to `10.10.10.241:5001/uploads`
- Proxies `/` to `10.10.10.241:3000`
- SSL via Let's Encrypt

---

## Database

### Connection Details
| Property | Value |
|----------|-------|
| Host | localhost |
| Port | 5432 |
| Database | sme_portal |
| User | sme_user |
| Password | Jash123qwe.. |

### Backup Database
```bash
# Inside LXC
PGPASSWORD=Jash123qwe.. pg_dump -U sme_user sme_portal > /var/www/sme-portal/database/backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
PGPASSWORD=Jash123qwe.. psql -U sme_user -d sme_portal -f /path/to/backup.sql
```

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx
- **SSL:** Let's Encrypt (Certbot)

---

## Ports Summary

| Service | Internal Port | External Access |
|---------|---------------|-----------------|
| Next.js Frontend | 3000 | https://naywa.ae |
| Express API | 5001 | https://naywa.ae/api |
| PostgreSQL | 5432 | Internal only |

---

## Troubleshooting

### Services Not Running
```bash
pct exec 106 -- pm2 list
pct exec 106 -- pm2 restart all
```

### Check Logs
```bash
pct exec 106 -- pm2 logs sme-server --lines 100
pct exec 106 -- pm2 logs sme-client --lines 100
```

### Nginx Issues
```bash
# On Proxmox host (65.109.60.53)
nginx -t
systemctl reload nginx
cat /var/log/nginx/error.log | tail -50
```

### Database Connection Issues
```bash
pct exec 106 -- systemctl status postgresql
pct exec 106 -- systemctl restart postgresql
```

---

## Legacy Domain

The old domain `sme.byredstone.com` still works and points to the same server. It can be deprecated once naywa.ae is fully operational.

---

## Auto-Start on Reboot

PM2 is configured to auto-start on LXC reboot:
- Service: `pm2-root.service`
- Dump file: `/root/.pm2/dump.pm2`

---

## Credentials Reference

| Service | Username | Password |
|---------|----------|----------|
| Proxmox SSH | root | Jash123qwe.. |
| LXC SSH | root | Jash123qwe.. |
| PostgreSQL | sme_user | Jash123qwe.. |

---

*Last Updated: February 11, 2026*
