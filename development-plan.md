# SME Certification Portal - Development Plan (Phase 1 Hardening)

**Date:** February 2025
**Version:** v4.6
**Status:** Pending Implementation

---

## Executive Summary

This document outlines the remaining items to harden Phase 1 before onboarding real SMEs. Focus areas: document revision workflow, audit trail completeness, email logging, and file governance.

---

## Current Status Assessment

### 1) Document Revision Workflow

| Feature | Status | Details |
|---------|--------|---------|
| Admin request revision (application-level) | ✅ EXISTS | `revision_requested` status + notes |
| SME sees revision notes | ✅ EXISTS | Dashboard pe dikhta hai |
| SME can re-upload after revision | ✅ EXISTS | `draft` or `revision_requested` mein allowed |
| **Individual document status** | ❌ MISSING | Documents ka apna status nahi hai |
| **Document version history** | ❌ MISSING | Replace pe purana delete ho jata hai |
| **Document-level feedback** | ❌ MISSING | Sirf application-level notes hai |
| Audit: Document uploaded | ✅ EXISTS | `DOCUMENT_UPLOADED` |
| Audit: Document deleted | ✅ EXISTS | `DOCUMENT_DELETED` |
| **Audit: Document replaced** | ❌ MISSING | Replace = upload, differentiate nahi hota |
| **Audit: Admin viewed document** | ❌ MISSING | Admin document access track nahi hota |

---

### 2) Conditional Documents

| Feature | Status | Details |
|---------|--------|---------|
| Conditional docs always visible | ✅ YES | Marked with amber badge |
| Dynamic show/hide based on sector | ❌ NO | All documents always visible |
| Clear labeling | ✅ YES | "Required", "Conditional", "Optional" badges |

**Current Behavior:** All documents always visible, only badge differs (Required/Conditional/Optional).

---

### 3) File Governance

| Feature | Status | Details |
|---------|--------|---------|
| File types enforced | ✅ EXISTS | PDF, JPG, PNG, DOC, DOCX |
| Max file size (10MB) | ✅ EXISTS | Server + client both validate |
| Limit visible to users | ✅ EXISTS | "max 10MB each" shown |
| Replace documents | ✅ EXISTS | Replace button available |
| **Virus/malware scanning** | ❌ MISSING | No scanning implemented |

---

### 4) Audit Trail - Document Level

| Event | Status |
|-------|--------|
| SME uploaded document | ✅ Logged |
| SME replaced document | ⚠️ Partial (logs as upload, not replace) |
| Admin viewed/downloaded document | ❌ NOT logged |
| Admin requested revision | ✅ Logged |
| Admin updated dimension status | ✅ Logged |
| Admin added/edited notes | ✅ Logged |

---

### 5) KYB Scope

| Feature | Status |
|---------|--------|
| Documentation-based only | ✅ YES |
| No external KYB integrations | ✅ Correct |
| UBO declaration | ❌ Not in document list |
| VAT certificate | ❌ Not in document list |

---

### 6) WPS Handling

| Feature | Status |
|---------|--------|
| WPS marked as Optional | ✅ YES |
| Does not block certification | ✅ Correct |
| Admin can request during review | ⚠️ Via revision request only (not document-specific) |

---

### 7) Internal Dimensions Indicator

| Feature | Status |
|---------|--------|
| 5 dimensions exist | ✅ YES |
| Individual status tracking | ✅ YES |
| **"0/5 reviewed" indicator** | ❌ MISSING |

---

### 8) Email System

| Feature | Status |
|---------|--------|
| Email service (Nodemailer) | ✅ EXISTS |
| Application submitted email | ✅ EXISTS |
| Revision requested email | ✅ EXISTS |
| Certification approved email | ✅ EXISTS |
| Certification rejected email | ✅ EXISTS |
| **Email audit logging** | ❌ MISSING |
| **EMAIL_SENT action** | ❌ MISSING |
| **Email delivery tracking** | ❌ MISSING |

---

## Implementation Plan

### Priority 1: Critical (Audit Defensibility)

#### 1.1 Document Version History
**Scope:**
- Add `DocumentVersion` table in Prisma schema
- Store old version metadata before replace (not file - just metadata)
- Track: version number, timestamp, uploader ID, original filename
- Retain audit trail even after document replacement

**Files to modify:**
- `server/prisma/schema.prisma`
- `server/src/controllers/sme.controller.ts`
- Run migration

---

#### 1.2 Document-Level Status & Feedback
**Scope:**
- Enhance document storage with per-document status
- Status options: `pending`, `approved`, `requires_revision`
- Per-document admin feedback field
- Admin can flag specific documents for revision

**Files to modify:**
- `server/src/controllers/sme.controller.ts`
- `server/src/controllers/admin.controller.ts`
- `client/src/app/admin/applications/[id]/page.tsx`
- `client/src/app/sme/profile/page.tsx`

---

#### 1.3 Audit Logging Enhancements
**Scope:**
- Add `DOCUMENT_REPLACED` action (differentiate from upload)
- Add `ADMIN_DOCUMENT_VIEWED` action
- Add `ADMIN_DOCUMENT_DOWNLOADED` action
- Add `EMAIL_SENT` action
- Add `EMAIL_FAILED` action

**Files to modify:**
- `server/src/utils/auditLogger.ts`
- `server/src/controllers/sme.controller.ts`
- `server/src/controllers/admin.controller.ts`
- `server/src/services/email.service.ts`

---

#### 1.4 Email Audit Log
**Scope:**
- Create `EmailLog` table in database
- Fields: id, recipientEmail, entityType, entityId, eventType, subject, timestamp, status (sent/failed), templateId
- Log every email attempt with delivery status
- Admin can view email logs per application/certificate

**Files to modify:**
- `server/prisma/schema.prisma`
- `server/src/services/email.service.ts`
- `server/src/controllers/admin.controller.ts`
- `client/src/app/admin/applications/[id]/page.tsx`

---

### Priority 2: Important

#### 2.1 Virus/Malware Scanning (Lightweight)
**Scope:**
- Option A: ClamAV integration (if available on server)
- Option B: Enhanced file validation
  - Magic byte verification (file header check)
  - Extension whitelist enforcement
  - Reject files with mismatched MIME/extension

**Files to modify:**
- `server/src/middleware/upload.ts`
- Add new utility: `server/src/utils/fileValidator.ts`

---

#### 2.2 Internal Dimensions Progress Indicator
**Scope:**
- Add "X/5 dimensions reviewed" counter in admin UI
- Show in application header section
- Visual indicator (progress bar or text)

**Files to modify:**
- `client/src/app/admin/applications/[id]/page.tsx`

---

#### 2.3 Optional Documents Addition
**Scope:**
- Add UBO Declaration (Conditional) to document types
- Add VAT Certificate (Conditional) to document types

**Files to modify:**
- `client/src/app/sme/profile/page.tsx` (DOCUMENT_TYPES constant)

---

### Priority 3: Nice to Have

#### 3.1 Admin Document Viewer Endpoint
**Scope:**
- API endpoint to fetch document list for admin
- Include document metadata and status
- Log view events to audit trail

**Files to modify:**
- `server/src/controllers/admin.controller.ts`
- `server/src/routes/admin.routes.ts`

---

#### 3.2 Document Checklist for Admin
**Scope:**
- Show required docs completion status
- Highlight missing required documents
- Visual checklist in admin review UI

**Files to modify:**
- `client/src/app/admin/applications/[id]/page.tsx`

---

## Effort Estimates

| Task | Priority | Effort | Database Change |
|------|----------|--------|-----------------|
| Document Version History | P1 | Medium | Yes (new table) |
| Document-Level Status | P1 | Medium | Yes (schema update) |
| Audit Logging Enhancements | P1 | Low | No |
| Email Audit Log | P1 | Medium | Yes (new table) |
| Virus Scanning (basic) | P2 | Low | No |
| Dimensions Progress Indicator | P2 | Low | No |
| UBO/VAT Documents | P2 | Low | No |
| Admin Document Viewer | P3 | Low | No |
| Document Checklist | P3 | Low | No |

---

## Database Schema Changes Required

### New Table: DocumentVersion
```prisma
model DocumentVersion {
  id            String   @id @default(cuid())
  smeProfileId  String
  documentType  String
  originalName  String
  fileName      String
  version       Int      @default(1)
  uploadedById  String
  uploadedAt    DateTime @default(now())
  replacedAt    DateTime?

  smeProfile    SMEProfile @relation(fields: [smeProfileId], references: [id])
  uploadedBy    User       @relation(fields: [uploadedById], references: [id])

  @@index([smeProfileId])
  @@index([documentType])
}
```

### New Table: EmailLog
```prisma
model EmailLog {
  id            String   @id @default(cuid())
  recipientEmail String
  entityType    String   // 'SMEProfile', 'Certificate', 'User'
  entityId      String?
  eventType     String   // 'application_submitted', 'revision_requested', etc.
  subject       String
  templateId    String?
  status        String   // 'sent', 'failed'
  errorMessage  String?
  sentAt        DateTime @default(now())

  @@index([entityType, entityId])
  @@index([recipientEmail])
  @@index([sentAt])
}
```

### Update: Document JSON Structure
```typescript
interface UploadedDocument {
  id: string;
  type: string;
  name: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  // NEW FIELDS:
  status: 'pending' | 'approved' | 'requires_revision';
  adminFeedback?: string;
  version: number;
}
```

---

## Implementation Order

1. **Phase A (Database):** Schema changes + migration
2. **Phase B (Backend):** Audit logging enhancements + email logging
3. **Phase C (Backend):** Document version history + status
4. **Phase D (Frontend):** Admin UI updates (document status, dimensions indicator)
5. **Phase E (Security):** File validation enhancements
6. **Phase F (Testing):** End-to-end testing
7. **Phase G (Deploy):** Production deployment + backup

---

## Success Criteria

- [ ] All document uploads tracked with version history
- [ ] Admin can request revision on specific documents
- [ ] All email sends logged with delivery status
- [ ] Admin can view email log per application
- [ ] "X/5 dimensions reviewed" indicator visible
- [ ] File validation includes magic byte check
- [ ] All audit events properly logged

---

## Notes

- No external KYB integrations in Phase 1
- No sanctions screening required
- Registry record is source of truth
- All changes must be backward compatible
