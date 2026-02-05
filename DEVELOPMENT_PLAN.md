# SME Readiness Portal - Software Requirements Specification (SRS)

**Version:** 2.0 - Production-Ready Stack

## 1. Executive Summary

This Software Requirements Specification (SRS) document outlines the development scope for an SME Readiness Certification Portal (SaaS) targeting SMEs in the UAE. This MVP provides data verification and registry listing capabilities for SME certification workflows.

**Important:** This platform does NOT enable investment transactions, collect money, or process investment commitments. It is a certification and registry portal only.

The platform will be built using a full custom tech stack: Next.js (React) frontend, Node.js/Express backend, and PostgreSQL database — production-ready architecture from day one.

**Project Highlights:**
- Custom Stack (Next.js + Node.js)
- PostgreSQL Database
- Role-Based Access Control
- Immutable Audit Trail
- MoSCoW Prioritized Scope
- UAT Acceptance Criteria
- Mobile Responsive
- Full Handover Package

---

## 2. Project Scope

**Project Name:** SME Readiness Portal
**Subtitle:** Certification SaaS Platform - Data Verification & Registry MVP (UAE)
**Platform:** Next.js (React) + Node.js/Express + PostgreSQL
**Client:** Saeed Albasti
**Total Budget:** $5,000

### 2.1 MVP Objectives

- Enable SMEs to submit business data for certification review
- Provide admin workflow for data verification and certification approval
- Display certified company profiles in a public registry listing
- Allow users to request introductions to certified SMEs
- Build production-ready architecture with immutable audit trails

### 2.2 Explicitly Out of Scope

- No investment transactions
- No payment/money collection
- No investment commitments
- No AI features
- No native iOS/Android apps
- No heavy automation
- No legal document drafting
- No full KYC/KYB integration

---

## 3. Technology Stack

Full custom stack providing production-ready architecture from the start with no future rebuild required.

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js (React) with Server-Side Rendering |
| Backend | Node.js with Express.js Framework |
| Database | PostgreSQL (Immutable Audit Trails) |
| Authentication | JWT + Email Verification |
| File Storage | S3-compatible private bucket (signed URLs) |
| Hosting | Client-provided (AWS/VPS recommended) |

### Detailed Stack Versions

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (React) | 16.x |
| Frontend Language | TypeScript | 5.x |
| Frontend Styling | Tailwind CSS | 4.x |
| Form Handling | React Hook Form + Zod | Latest |
| HTTP Client | Axios | Latest |
| Icons | Lucide React | Latest |
| Backend | Node.js + Express.js | Latest LTS |
| Backend Language | TypeScript | 5.x |
| Database | PostgreSQL | 15.x |
| ORM | Prisma | 7.x |
| Authentication | JWT (jsonwebtoken) + bcrypt | Latest |
| File Upload | Multer | Latest |
| Email Service | SendGrid (Nodemailer) | Latest |
| Validation | express-validator | Latest |

### 3.1 Document Storage & Access Rules

- Storage: S3-compatible private bucket (no public links)
- Access: Signed URLs with expiration (private access only)
- File types: PDF, JPG, PNG only
- Max file size: 10MB per document
- Access rules: SME sees own docs; Admin views only (no edit); Users see certified profile docs

### 3.2 KYC/KYB Boundary (MVP Phase)

**Important:** KYC/KYB features in this MVP are UI placeholders only (no vendor integration). The platform must not be represented as "verified" or "KYC-compliant" until actual KYC provider is integrated post-sandbox.

### Code Quality Guidelines

- All component and function naming must follow consistent conventions (PascalCase for components, camelCase for functions)
- Database field names must be descriptive and use camelCase format (Prisma convention)
- API route handlers must clearly indicate their purpose
- All business logic must be documented with inline comments
- Role-based access control must be explicitly defined via middleware for each route
- No placeholder or temporary naming allowed in final delivery
- Reusable React components must be created for repeated UI patterns
- TypeScript interfaces/types must be defined for all data structures
- API routes must follow RESTful naming conventions
- All user-facing text must be in proper English language only

### Documentation Requirements

- Every API controller must have inline documentation
- Database schema must be fully documented in Prisma schema with field descriptions
- RBAC middleware rules must be documented with justification
- Admin functions must have usage documentation
- All third-party integrations must be documented

---

## 4. UI/UX Scope (Phase 1 MVP)

### 4.1 Included (Within Current Scope)

- Clean, professional, trust-focused UI across all MVP screens
- Consistent navigation/layout and component styling across the app
- Desktop-first responsive design (mobile-responsive)
- Clear status indicators (draft/submitted/approved/published)
- Confirmation states and error states throughout
- Inline form validation and readable messaging (no dead ends)

### 4.2 Excluded (Scope Control)

- Brand identity design (logo, illustrations)
- Advanced animations and micro-interactions
- Marketing pages and landing page design
- UX research and usability testing

### 4.3 UI/UX Acceptance Criteria

- Core flows usable end-to-end without external guidance
- No broken or overlapping layouts on common screen sizes
- No placeholder/lorem ipsum content in final delivery

---

## 5. MoSCoW Scope Prioritization

Features prioritized using MoSCoW methodology to lock delivery scope and reduce rework.

### 5.1 Must Have (Critical for MVP)

| ID | Feature | Role | Milestone |
|----|---------|------|-----------|
| M-01 | User authentication (User, SME, Admin roles) | All | M1 |
| M-02 | Role-based access control (RBAC) | All | M1 |
| M-03 | User registration with profile setup | User | M1 |
| M-04 | SME certification application form with document uploads | SME | M2 |
| M-05 | Admin dashboard (review/approve/reject/return for revision) | Admin | M2 |
| M-06 | Certified Company Registry listing page | User | M2 |
| M-07 | Request Introduction / Request Full Access mechanism | User | M2 |
| M-08 | Immutable audit log system | Admin | M2 |
| M-09 | Mobile responsive design | All | M3 |

### 5.2 Should Have (Important)

| ID | Feature | Role | Milestone |
|----|---------|------|-----------|
| S-01 | Email notifications (certification status, introduction requests) | All | M2 |
| S-02 | User dashboard (view introduction requests made) | User | M1 |
| S-03 | SME dashboard (certification status tracking) | SME | M1 |
| S-04 | Password reset functionality | All | M1 |
| S-05 | Export audit logs to CSV | Admin | M2 |

### 5.3 Could Have (Nice to Have)

| ID | Feature | Description |
|----|---------|-------------|
| C-01 | Registry filtering and search | Filter by industry, location, keywords |
| C-02 | Admin activity analytics | Charts, trends, metrics |

### 5.4 Won't Have (This Phase)

| ID | Feature | Reason |
|----|---------|--------|
| W-01 | Investment transactions / money collection | Out of scope |
| W-02 | Payment processing | Out of scope |
| W-03 | Full KYC/KYB vendor integration | Requires third-party provider |
| W-04 | Native mobile applications | Web-first MVP, responsive design only |

---

## 6. Screen List

### 6.1 Public Screens

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| P1 | Landing Page | `/` | Minimal entry page with login/signup CTAs (non-marketing) |
| P2 | Login | `/login` | Email/password login for all roles |
| P3 | User Signup | `/register?role=user` | Registration form + email verification |
| P4 | SME Signup | `/register?role=sme` | Company registration form + email verification |
| P5 | Password Reset | `/forgot-password` | Email-based password recovery |

### 6.2 User Screens

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| U1 | User Dashboard | `/user` | Overview of profile, introduction requests made |
| U2 | Registry Listing | `/user/registry` | Browse certified company profiles |
| U3 | Company Profile | `/user/registry/:profileId` | View certified SME details + Request Introduction |
| U4 | My Requests | `/user/requests` | List of introduction requests made |
| U5 | Profile Settings | `/user/profile` | Edit user profile |

### 6.3 SME Screens

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| S1 | SME Dashboard | `/sme` | Certification status, company profile overview |
| S2 | Certification Form | `/sme/certification` | Multi-step form with company info + uploads |
| S3 | Certification Status | `/sme/certification/status` | Track: Draft > Submitted > Under Review > Certified |
| S4 | Revision Request | `/sme/certification/revision` | View admin comments + Request Partner Help link |
| S5 | Company Profile | `/sme/profile` | Edit company information (own data only) |

### 6.4 Admin Screens

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| A1 | Admin Dashboard | `/admin` | Overview stats, pending certifications |
| A2 | Certification Queue | `/admin/certifications` | List all applications with status filters |
| A3 | Application Review | `/admin/certifications/:id` | Read-only view, approve/reject/return for revision |
| A4 | Registry Management | `/admin/registry` | Control listing visibility, view intro requests |
| A5 | User Management | `/admin/users` | View users/SMEs, manage accounts |
| A6 | Audit Log | `/admin/audit-logs` | Immutable activity log with filters |

**Total Screens: 21**

---

## 7. Role-Based Access Control (RBAC) Matrix

Permissions matrix defining access levels for each user role.

### 7.1 Permission Summary

| Permission | User | SME | Admin |
|------------|------|-----|-------|
| View certified profiles (registry) | Yes | No | Yes |
| Request introduction | Yes | No | No |
| View profile documents (certified) | Yes | No | Yes |
| Submit certification application | No | Yes | No |
| Upload documents | No | Yes | No |
| Edit own business data | No | Yes | No |
| View own profile | Yes | Yes | Yes |
| Edit own profile | Yes | Yes | Yes |
| View certification status | No | Yes | Yes |
| Review applications (read-only) | No | No | Yes |
| Approve/Reject/Return for Revision | No | No | Yes |
| Edit SME business data | No | No | **No** |
| Control listing visibility | No | No | Yes |
| View all users | No | No | Yes |
| View audit logs | No | No | Yes |

### 7.2 Data Integrity Restriction (Admin)

**Critical:** Admins have NO ability to edit SME-submitted financial or business data fields.

Admin actions are limited to:
- Review (read-only)
- Comment/Request Revision
- Approve Certification
- Reject (with reason)

### 7.3 API Endpoint Access

| Endpoint | User | SME | Admin | Public |
|----------|------|-----|-------|--------|
| **Authentication** | | | | |
| `POST /auth/register` | - | - | - | Yes |
| `POST /auth/login` | - | - | - | Yes |
| `GET /auth/profile` | Yes | Yes | Yes | No |
| `POST /auth/forgot-password` | - | - | - | Yes |
| **User** | | | | |
| `GET /user/profile` | Yes | No | No | No |
| `PUT /user/profile` | Yes | No | No | No |
| `GET /user/requests` | Yes | No | No | No |
| **SME** | | | | |
| `GET /sme/profile` | No | Yes | No | No |
| `PUT /sme/profile` | No | Yes | No | No |
| `POST /sme/submit-certification` | No | Yes | No | No |
| `POST /sme/upload-document` | No | Yes | No | No |
| `GET /sme/certification-status` | No | Yes | No | No |
| **Registry** | | | | |
| `GET /registry` (certified, visible) | Yes | No | Yes | No |
| `GET /registry/:id` | Yes | No | Yes | No |
| `POST /registry/:id/request-introduction` | Yes | No | No | No |
| **Admin** | | | | |
| `GET /admin/dashboard` | No | No | Yes | No |
| `GET /admin/users` | No | No | Yes | No |
| `GET /admin/certifications` | No | No | Yes | No |
| `POST /admin/certifications/:id/review` | No | No | Yes | No |
| `PUT /admin/registry/:id/visibility` | No | No | Yes | No |
| `GET /admin/audit-logs` | No | No | Yes | No |
| `GET /admin/introduction-requests` | No | No | Yes | No |

### 7.4 Screen Access

| Screen | User | SME | Admin | Unauthenticated |
|--------|------|-----|-------|-----------------|
| Login / Register | Redirect to dashboard | Redirect to dashboard | Redirect to dashboard | Yes |
| User Dashboard | Yes | No (redirect) | No (redirect) | No (redirect to login) |
| User Profile | Yes | No | No | No |
| Registry Listing | Yes | No | Yes | No |
| Company Profile | Yes | No | Yes | No |
| My Requests | Yes | No | No | No |
| SME Dashboard | No | Yes | No | No |
| SME Profile | No | Yes | No | No |
| SME Certification | No | Yes | No | No |
| Admin Dashboard | No | No | Yes | No |
| Admin Users | No | No | Yes | No |
| Admin Certifications | No | No | Yes | No |
| Admin Registry | No | No | Yes | No |
| Admin Audit Logs | No | No | Yes | No |

### 7.5 Data Visibility Rules

| Data Type | Owner | Other User | SME | Admin |
|-----------|-------|------------|-----|-------|
| User (sensitive fields) | Full access | No access | No access | Full access |
| User Profile | Full access | No access | No access | Read-only |
| SME Profile | - | Limited (certified only) | Full access (own) | Read-only |
| SME Profile (draft) | - | No access | Own only | Read-only |
| SME Profile (certified, visible) | - | Read-only | Own only | Read-only |
| Introduction Request | Own only | No access | Notified | Read-only |
| Audit Log | No access | No access | No access | Full access |

---

## 8. Audit Log Schema

Immutable audit trail for regulatory compliance. All entries are append-only.

### Table: `audit_log`

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier (primary key) |
| `timestamp` | TIMESTAMP | UTC timestamp (auto-generated) |
| `user_id` | UUID | Reference to user who performed action |
| `user_role` | ENUM | Role at time of action |
| `action_type` | VARCHAR | CREATE, UPDATE, SOFT_DELETE (logical) |
| `resource_type` | VARCHAR | Entity type (user, certification, registry) |
| `resource_id` | UUID | ID of affected resource |
| `old_value` | JSONB | Previous state (for updates) |
| `new_value` | JSONB | New state (for creates/updates) |
| `ip_address` | INET | Client IP address |

### 8.1 Immutability Controls (DB-Level)

- Application database role has INSERT-only permission on audit_log table
- UPDATE and DELETE operations blocked at database permission level
- SOFT_DELETE action_type = logical deletion (record retained, marked as deleted)
- No physical deletion of audit records permitted

### Standardized Action Types

| Action Type | Trigger | Target Type |
|-------------|---------|-------------|
| `USER_REGISTERED` | New user signs up | User |
| `USER_LOGIN` | User logs in | User |
| `USER_LOGOUT` | User logs out | User |
| `PASSWORD_RESET_REQUEST` | Forgot password submitted | User |
| `PASSWORD_CHANGED` | Password successfully changed | User |
| `PROFILE_UPDATE` | User or SME updates profile | UserProfile / SMEProfile |
| `DOCUMENT_UPLOADED` | Certification document uploaded | SMEProfile |
| `CERTIFICATION_SUBMITTED` | SME submits certification application | SMEProfile |
| `CERTIFICATION_APPROVE` | Admin approves certification | SMEProfile |
| `CERTIFICATION_REJECT` | Admin rejects certification | SMEProfile |
| `CERTIFICATION_REVISION_REQUESTED` | Admin requests revision | SMEProfile |
| `LISTING_PUBLISHED` | Certified SME published to registry | SMEProfile |
| `LISTING_UNPUBLISHED` | Certified SME removed from registry | SMEProfile |
| `INTRODUCTION_REQUESTED` | User requests introduction to SME | IntroductionRequest |
| `INTRODUCTION_VIEWED` | Admin views introduction request | IntroductionRequest |

### Retention and Access Policy

- Audit logs are **append-only**; no update or delete operations are permitted.
- Logs are retained for the full lifecycle of the platform.
- Only users with the `admin` role may query audit logs.
- Audit log queries support filtering by: `user_id`, `action_type`, `target_type`, `date range`.
- No sensitive data (passwords, tokens) is stored in audit log values.

---

## 9. UAT Acceptance Criteria

User Acceptance Testing criteria for milestone sign-off.

### 9.1 Authentication & Access

- User can register and receive verification email
- SME can register company account with verification
- Users can login with correct credentials
- Invalid credentials show appropriate error
- Users are redirected to role-appropriate dashboard

### 9.2 SME Certification Flow

- SME can complete multi-step certification application form
- Documents can be uploaded (PDF, images)
- Certification status visible in SME dashboard
- Email notification sent on status change
- Revision request shows admin comments + Request Partner Help link

### 9.3 User (Registry Visitor) Flow

- User can view list of certified company profiles
- Profile shows: company summary, sector, location, certification status, key documents
- User can click Request Introduction (no investment fields)
- Request triggers email notification to Admin (and optionally SME)
- Request is recorded and visible in user dashboard

### 9.4 Admin Functions

- Admin can view all pending certification applications
- Admin can review SME data (read-only, no edit capability)
- Admin can approve certification / publish listing
- Admin can reject with reason
- Admin can return for revision: SME receives email with comments
- Admin can control listing visibility
- All admin actions logged in audit trail
- Audit log displays complete activity history

### 9.5 Responsiveness

- All screens render correctly on desktop (1920px)
- All screens render correctly on tablet (768px)
- All screens render correctly on mobile (375px)

---

## 10. Development Milestones

### Milestone 1: Foundation & Backend Setup

**Duration:** 28 Jan - 10 Feb 2026
**Budget:** $2,500
**Scope:** Project setup, database schema, authentication, RBAC, registration flows, admin foundation, API endpoints

**Deliverables:**
- GitHub repository access from Day 1 (28 Jan)
- Project setup (Next.js + Node.js + PostgreSQL)
- Database schema design with immutable audit log
- User authentication system (JWT + email verification)
- Role-based access control implementation
- User & SME registration flows
- Admin secure login and dashboard foundation
- Live staging URL with auth working (10 Feb 2026)

### Phase 1.1: Project Setup

#### Tasks
1. Initialize Next.js client application with TypeScript and Tailwind CSS
2. Initialize Node.js/Express server application with TypeScript
3. Configure PostgreSQL database and Prisma ORM with schema
4. Define all Prisma enums and models as specified above
5. Set up environment configuration (.env files)
6. Create base page routing structure in Next.js

#### Routes to Create
- `/` (landing/redirect page)
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password/:token`
- `/verify/:token`

#### Infrastructure Configuration
- Configure CORS and security middleware (helmet, rate limiting)
- Set up JWT authentication middleware
- Create role-based authorization middleware
- Configure error handling middleware
- Set up SendGrid/Nodemailer for transactional emails
- Configure Multer for file uploads

### Phase 1.2: Authentication System

#### API Endpoints to Build

**POST /api/auth/register**
```
Request Body: { email, password, fullName, role }
Logic:
1. Validate input with express-validator
2. Check if email already exists in database
3. Hash password with bcrypt (salt rounds: 10)
4. Create User record with Prisma
5. Create corresponding profile (UserProfile or SMEProfile)
6. Generate JWT token with user ID and role
7. Send verification email via SendGrid
8. Create audit log entry (USER_REGISTERED)
9. Return JWT token and user data
```

**POST /api/auth/login**
```
Request Body: { email, password }
Logic:
1. Validate credentials
2. Find user by email with Prisma
3. Compare password with bcrypt
4. Update lastLogin timestamp
5. Generate JWT token
6. Create audit log entry (USER_LOGIN)
7. Return JWT token and user data (client redirects by role)
```

**POST /api/auth/forgot-password**
```
Request Body: { email }
Logic:
1. Validate email exists in database
2. Generate password reset token (crypto.randomBytes)
3. Store token with expiry in database
4. Send password reset email via SendGrid
5. Create audit log entry (PASSWORD_RESET_REQUEST)
6. Return success message
```

**POST /api/auth/reset-password**
```
Request Body: { token, newPassword }
Logic:
1. Validate token exists and has not expired
2. Hash new password with bcrypt
3. Update user password in database
4. Invalidate reset token
5. Create audit log entry (PASSWORD_CHANGED)
6. Return success message
```

**GET /api/auth/verify/:token**
```
Logic:
1. Validate verification token
2. Update user isVerified to true
3. Create audit log entry
4. Return success (client redirects to login)
```

### Phase 1.3: Role-Based Access Control

#### Express Middleware

**Authentication Middleware (`authenticate`)**
- Extract JWT from Authorization header (Bearer token)
- Verify token with jsonwebtoken
- Attach decoded user payload to `req.user`
- Return 401 if token is missing or invalid

**Authorization Middleware (`authorize(...roles)`)**
- Accept array of allowed roles
- Check `req.user.role` against allowed roles
- Return 403 if user role is not permitted

#### Data Access Rules (Prisma Query Filters)

**User Model**
- Authenticated users can read their own record (WHERE id = req.user.id)
- Admin can query all users with filters
- Other users cannot access sensitive fields (password, phone)

**SMEProfile Model**
- Owner can read/update own profile (WHERE userId = req.user.id)
- Admin can read all profiles (NO UPDATE capability)
- Users can only read profiles WHERE certificationStatus = "certified" AND listingVisible = true

**UserProfile Model**
- Owner can read/update own profile (WHERE userId = req.user.id)
- Admin can read all profiles
- SMEs have no access to user profiles

**IntroductionRequest Model**
- User can read own requests (WHERE requesterId = req.user.id)
- Admin can read all requests
- SME receives notification but limited access

**AuditLog Model**
- Only admin role can query audit logs

#### Client-Side Route Protection

React Auth Context handles client-side guards:
```
On route render:
If no JWT in localStorage -> redirect to /login
If user role does not match route prefix -> redirect to correct dashboard
```

### Phase 1.4: User Registration Flow

#### Routes (Next.js)
- `/register` (shared, with role selection)
- `/user/profile` (profile setup)
- `/user` (user dashboard)

#### API Endpoints

**PUT /api/user/profile**
```
Request Body: { fullName, phoneNumber, company, jobTitle }
Logic:
1. Validate input with express-validator
2. Update UserProfile via Prisma (WHERE userId = req.user.id)
3. Create audit log entry (PROFILE_UPDATE)
4. Return updated profile
```

### Phase 1.5: SME Registration Flow

#### Routes (Next.js)
- `/register` (shared, with role selection)
- `/sme/profile` (company profile setup)
- `/sme` (SME dashboard)

#### API Endpoints

**PUT /api/sme/profile**
```
Request Body: { companyName, tradeLicenseNumber, companyDescription, industrySector, foundingDate, employeeCount, annualRevenue, website, address }
Logic:
1. Validate input with express-validator
2. Update SMEProfile via Prisma (WHERE userId = req.user.id)
3. Create audit log entry (PROFILE_UPDATE)
4. Return updated profile
```

### Phase 1.6: Admin Foundation

#### Routes (Next.js)
- `/admin` (admin dashboard)
- `/admin/users` (user management)

#### Admin Dashboard Components
- Stats cards: total users (by role), pending certifications, certified SMEs
- Recent audit log entries (last 10) via GET /api/admin/audit-logs?limit=10
- Quick navigation links to management sections

#### Admin User Management

**GET /api/admin/users**
```
Query Params: { search, role, status, page, limit }
Logic:
1. Build Prisma WHERE clause from query filters
2. Return paginated user list with role, isVerified, createdAt
```

### Phase 1.7: Audit Log System

#### Reusable Audit Logger Utility
```typescript
// server/src/utils/auditLogger.ts
interface AuditLogParams {
  userId: string;
  actionType: string;
  actionDescription: string;
  targetType?: string;
  targetId?: string;
  ipAddress?: string;
  previousValue?: string;
  newValue?: string;
}

async function createAuditLog(params: AuditLogParams): Promise<void> {
  await prisma.auditLog.create({
    data: {
      ...params,
      timestamp: new Date(),
    },
  });
}
```

#### Events to Log
- User signup (USER_REGISTERED)
- User login (USER_LOGIN)
- User logout (USER_LOGOUT)
- Password reset request (PASSWORD_RESET_REQUEST)
- Password change (PASSWORD_CHANGED)
- Profile update (PROFILE_UPDATE)
- Document upload (DOCUMENT_UPLOADED)
- Certification submission (CERTIFICATION_SUBMITTED)
- Certification status change (CERTIFICATION_APPROVE / CERTIFICATION_REJECT / CERTIFICATION_REVISION_REQUESTED)
- Listing visibility change (LISTING_PUBLISHED / LISTING_UNPUBLISHED)
- Introduction request (INTRODUCTION_REQUESTED)

### Milestone 1 Deliverables Checklist

- [ ] Next.js client and Node.js server projects initialized
- [ ] GitHub repository access provided from Day 1 (28 Jan)
- [ ] PostgreSQL database configured with Prisma schema and all models
- [ ] All Prisma enums defined and migrated
- [ ] JWT authentication system functional (register, login, token refresh)
- [ ] Email verification working via SendGrid
- [ ] Password reset working via email token
- [ ] User registration flow complete
- [ ] User profile setup complete
- [ ] SME registration flow complete
- [ ] SME profile setup complete
- [ ] Admin login and role-based redirect functional
- [ ] Admin dashboard with stats cards and recent activity
- [ ] Admin user management page with search, filters
- [ ] Express middleware for authentication and role-based authorization
- [ ] Prisma query filters enforcing data access rules per role
- [ ] Audit log system operational with all action types logging
- [ ] API endpoints documented with request/response formats
- [ ] Live staging URL with authentication working (10 Feb 2026)

---

### Milestone 2: Features & Integration

**Duration:** 11 Feb - 24 Feb 2026
**Budget:** $1,500
**Scope:** SME certification form, admin review (read-only), registry listing, request introduction, email notifications, secure document storage, audit log CSV export

**Deliverables:**
- SME certification application form with document uploads
- Secure document storage (S3-compatible, signed URLs)
- Certification status tracking workflow
- Admin review interface (read-only + approve/reject/return)
- Certified company registry listing pages
- Request Introduction mechanism + email notifications
- Return for Revision workflow + Partner Help link
- Audit log CSV export

### Phase 2.1: SME Certification Form

#### Routes (Next.js)
- `/sme/certification` (certification form with checklist and document upload)
- `/sme` (dashboard shows certification status)

#### Certification Form Fields (React Hook Form + Zod Validation)
**Section 1: Company Information**
- Company name (required, min 2 chars)
- Trade license number (required)
- Industry sector (select dropdown from IndustrySector enum)
- Founding date (date picker)
- Company description (textarea)

**Section 2: Business Details**
- Employee count (number input)
- Annual revenue (decimal input)
- Business model description (textarea)
- Target market (textarea)
- Website URL (optional)
- Business address (textarea)

**Section 3: Documents**
- Trade license copy (file upload, PDF only)
- Company registration documents (multiple file upload)
- Financial statements (optional, multiple file upload)
- Additional documents (optional, multiple file upload)

#### API Endpoint: POST /api/sme/submit-certification
```
Logic:
1. Validate all required fields with express-validator
2. Update SMEProfile with form data via Prisma
3. Set certificationStatus to "submitted"
4. Set submittedDate to new Date()
5. Create audit log entry (CERTIFICATION_SUBMITTED)
6. Send confirmation email to SME via SendGrid
7. Send notification email to admin via SendGrid
8. Return updated certification data
```

#### API Endpoint: POST /api/sme/upload-document
```
Request: multipart/form-data (Multer middleware)
Logic:
1. Save file to server storage directory
2. Update SMEProfile document fields (JSON array)
3. Create audit log entry (DOCUMENT_UPLOADED)
4. Return file path confirmation
```

### Phase 2.2: Certification Status Tracking

#### SME Dashboard Status Section
- Current status displayed with color-coded badge component
- Status-specific messaging and next steps checklist
- Submitted documents list with download links
- Admin feedback display (revision comments shown when status is revision_requested or rejected)
- Edit certification button (enabled only when certificationStatus is "draft" or "revision_requested")

#### API Endpoint: GET /api/sme/certification-status
```
Logic:
1. Query SMEProfile via Prisma (WHERE userId = req.user.id)
2. Include revisionNotes, submittedDate, certificationStatus
3. Return status data with human-readable status messages
```

#### Status Display Logic (React Component)
```
- draft: "Your certification application is saved as draft"
- submitted: "Application submitted, awaiting review"
- under_review: "Your application is being reviewed by our team"
- revision_requested: "Revision requested" + display revisionNotes + "Request Partner Help" link
- certified: "Congratulations! Your company has been certified"
- rejected: "Certification not approved" + display revisionNotes
```

### Phase 2.3: Admin Review Interface (Read-Only)

#### Routes (Next.js)
- `/admin/certifications` (certifications table with filters)
- Review modal opens inline (no separate page needed)

#### Certifications List Page (React Component)
- Table component with all SME applications (Prisma query with includes)
- Filter dropdowns: certificationStatus, industrySector
- Search input filtering by companyName
- Sortable columns: submittedDate
- Status badge components with color coding
- Click row to open review modal

#### Review Modal Components
- Full certification details (READ-ONLY display - NO edit capability)
- Document download links
- Revision notes textarea (required for reject/revision request)
- Action buttons: Approve & Publish, Reject, Return for Revision

**CRITICAL: Admin cannot edit any SME-submitted data fields**

#### API Endpoint: POST /api/admin/certifications/:certificationId/review
```
Request Body: { action: "approve" | "reject" | "revision_requested", notes?: string }
Logic (approve):
1. Update SMEProfile certificationStatus to "certified" via Prisma
2. Set reviewedById to req.user.id
3. Set listingVisible to true (publish to registry)
4. Create audit log entry (CERTIFICATION_APPROVE)
5. Create audit log entry (LISTING_PUBLISHED)
6. Send approval email to SME via SendGrid
7. Return updated certification

Logic (reject):
1. Validate notes is not empty
2. Update SMEProfile certificationStatus to "rejected"
3. Set reviewedById and revisionNotes
4. Create audit log entry (CERTIFICATION_REJECT)
5. Send rejection email with reason to SME via SendGrid
6. Return updated certification

Logic (revision_requested):
1. Validate notes is not empty
2. Update SMEProfile certificationStatus to "revision_requested"
3. Set reviewedById and revisionNotes
4. Create audit log entry (CERTIFICATION_REVISION_REQUESTED)
5. Send revision request email with comments to SME via SendGrid
6. Return updated certification
```

### Phase 2.4: Certified Company Registry

#### Routes (Next.js)
- `/user/registry` (registry grid with filters)
- `/user/registry/:profileId` (company profile page)

#### Registry Listing Page Components (React)
- Responsive card grid (1 col mobile, 2 col tablet, 3 col desktop)
- Search input filtering by companyName
- Industry sector dropdown filter
- Pagination component with page size of 12
- Company card showing: company name, industry badge, location, certification badge

#### API Endpoint: GET /api/registry
```
Query Params: { search, industry, page, limit }
Logic:
1. Build Prisma WHERE clause: certificationStatus = "certified", listingVisible = true
2. Add search filter (companyName CONTAINS)
3. Add industry filter if provided (industrySector = value)
4. Return paginated results with total count
```

#### Company Profile Page Components (React)
- Company information section (name, industry, description)
- Business details section (employees, revenue, website)
- Sector, location display
- Certification status badge
- Key documents section (with signed URL access for certified profile docs)
- Request Introduction CTA button

#### API Endpoint: GET /api/registry/:profileId
```
Logic:
1. Query SMEProfile by ID via Prisma
2. Enforce certificationStatus = "certified" AND listingVisible = true
3. Return profile data (limited public fields only)
```

### Phase 2.5: Request Introduction Mechanism

#### Request Introduction Modal (React Component)
- Company summary display
- Message textarea (required)
- Contact preferences (optional)
- Submit button with loading state

#### API Endpoint: POST /api/registry/:profileId/request-introduction
```
Request Body: { message, contactPreferences? }
Middleware: authenticate, authorize("user")
Logic:
1. Verify SMEProfile is certified and visible
2. Create IntroductionRequest via Prisma:
   - requesterId: req.user.id
   - smeProfileId: req.params.profileId
   - message: request value
   - status: "pending"
   - requestedDate: new Date()
3. Create audit log entry (INTRODUCTION_REQUESTED)
4. Send notification email to Admin via SendGrid
5. Optionally send notification email to SME via SendGrid
6. Return created request data
```

#### User Requests Management

**GET /api/user/requests**
```
Logic:
1. Query IntroductionRequest via Prisma (WHERE requesterId = req.user.id)
2. Include SMEProfile relation
3. Order by requestedDate descending
4. Return all requests
```

### Phase 2.6: Admin Registry Management

#### Routes (Next.js)
- `/admin/registry` (registry management with visibility controls)

#### Admin Registry Page Components
- Table of certified SMEs with visibility toggle
- View introduction requests per SME
- Unpublish button (with confirmation)

#### API Endpoint: PUT /api/admin/registry/:profileId/visibility
```
Request Body: { visible: boolean }
Logic:
1. Update SMEProfile listingVisible via Prisma
2. Create audit log entry (LISTING_PUBLISHED or LISTING_UNPUBLISHED)
3. Return updated profile
```

#### API Endpoint: GET /api/admin/introduction-requests
```
Query Params: { smeProfileId?, status?, page, limit }
Logic:
1. Query all IntroductionRequest records
2. Include User and SMEProfile relations
3. Return paginated list
```

### Phase 2.7: Email Notification System

#### Email Service Setup (SendGrid via Nodemailer)
```typescript
// server/src/utils/email.ts
// Configure Nodemailer transport with SendGrid SMTP or API
// All emails use HTML templates with consistent branding
```

#### Email Templates to Create

**User Emails**
- Welcome email (triggered on POST /api/auth/register with role=user)
- Email verification (triggered on registration)
- Password reset (triggered on POST /api/auth/forgot-password)
- Introduction request confirmation (triggered on POST /api/registry/:id/request-introduction)

**SME Emails**
- Welcome email (triggered on POST /api/auth/register with role=sme)
- Certification received confirmation (triggered on POST /api/sme/submit-certification)
- Certification status update (triggered on POST /api/admin/certifications/:id/review)
- Revision requested with admin comments
- New introduction request notification (optional)

**Admin Emails**
- New SME certification submission notification
- New introduction request notification

### Phase 2.8: Audit Log CSV Export

#### API Endpoint: GET /api/admin/audit-logs/export
```
Query Params: { startDate, endDate, actionType?, userId? }
Logic:
1. Query audit logs with filters
2. Format as CSV
3. Return as downloadable file
```

### Milestone 2 Deliverables Checklist

- [ ] SME certification form complete with Zod validation
- [ ] Document upload functionality working via Multer
- [ ] Secure document storage with S3-compatible signed URLs
- [ ] Certification status tracking on SME dashboard
- [ ] Revision request shows admin comments + Request Partner Help link
- [ ] Admin certifications list page with filters
- [ ] Admin certification review modal (READ-ONLY + approve/reject/revision)
- [ ] Admin CANNOT edit SME business data (enforced)
- [ ] Publish to registry on certification approval
- [ ] Registry listing page with search and industry filter
- [ ] Company profile page with Request Introduction CTA
- [ ] Introduction request modal
- [ ] User requests management (view requests made)
- [ ] Admin registry management (visibility controls)
- [ ] Admin introduction requests view
- [ ] All email templates created with SendGrid
- [ ] Email notifications working for all events
- [ ] Audit log CSV export functionality
- [ ] API endpoints documented with request/response formats
- [ ] Audit logging for all new state-changing actions

---

### Milestone 3: Testing & Handover

**Duration:** 25 Feb - 10 Mar 2026
**Budget:** $1,000
**Scope:** Mobile responsiveness, UI/UX polish, end-to-end UAT testing, bug fixes, documentation, final staging hardening, deployment documentation, repository handover

**Deliverables:**
- Mobile responsiveness optimization
- UI/UX polish and consistency review
- End-to-end UAT testing
- Bug fixes and refinements
- Documentation package
- Final staging hardening + deployment documentation
- Repository handover and training session

### Phase 3.1: Mobile Responsiveness

#### Responsive Breakpoints
- Desktop: 1920px and above
- Tablet: 768px to 1919px
- Mobile: below 768px

#### Pages to Optimize
All pages must be reviewed and adjusted for:
- Navigation menu (hamburger on mobile)
- Form layouts (single column on mobile)
- Table views (card view on mobile)
- Button sizes (minimum 44px touch target)
- Font sizes (readable on small screens)
- Image scaling
- Popup dimensions

#### Mobile-Specific Adjustments
- Sticky headers with reduced height
- Bottom navigation for key actions
- Collapsible sections for long content
- Touch-friendly input fields
- Swipe gestures where appropriate

### Phase 3.2: UI/UX Polish

#### Design Consistency Review
- Verify consistent color usage throughout
- Check font hierarchy (H1, H2, H3, body, caption)
- Validate spacing and padding consistency
- Review button styles (primary, secondary, danger)
- Check input field styles
- Verify loading states for all async operations
- Add empty states for lists with no data
- Error message styling consistency

#### Accessibility Checks
- Color contrast ratios (WCAG AA minimum)
- Form labels properly associated
- Focus indicators visible
- Alt text for images
- Keyboard navigation functional

#### Performance Optimization
- Optimize image sizes and implement lazy loading
- Review Prisma query efficiency (use select/include wisely, avoid N+1)
- Add database indexes on frequently queried columns
- Minimize unnecessary API calls with proper React state management
- Review Next.js page load times and bundle size
- Implement API response caching where appropriate

### Phase 3.3: End-to-End Testing

#### Test Scenarios

**User Flow**
1. New user signup
2. Email verification
3. Profile completion
4. Browse registry
5. View company profile
6. Request introduction
7. View request history
8. Password reset

**SME Flow**
1. New SME signup
2. Email verification
3. Profile completion
4. Start certification (save as draft)
5. Complete and submit certification
6. View certification status
7. Respond to revision request
8. View certified listing

**Admin Flow**
1. Admin login
2. View dashboard statistics
3. Manage users
4. Review SME certifications (read-only)
5. Approve certification
6. Reject certification
7. Return for revision with comments
8. Manage registry visibility
9. View introduction requests
10. View audit logs

#### Testing Documentation
Create test case document with:
- Test case ID
- Description
- Pre-conditions
- Steps to execute
- Expected result
- Actual result
- Status (Pass/Fail)

### Phase 3.4: Audit Trail Verification

#### Verification Tasks
- Confirm all user actions create audit entries
- Verify audit entries contain correct information
- Test audit log filtering and search
- Confirm audit data cannot be modified (DB-level immutability controls)
- Verify timestamp accuracy
- Test IP address capture
- Review audit entry format consistency

#### Audit Report Generation
Create admin functionality to:
- Export audit logs to CSV by date range
- Filter by user, action type, or target
- Generate summary reports

### Phase 3.5: Documentation

#### Technical Documentation

**Database Schema Document**
- All Prisma models with field descriptions and types
- Relationships between models (foreign keys, one-to-many, one-to-one)
- Prisma enums with allowed values
- Data access rules per role (Prisma query filter patterns)

**API Documentation**
- All REST endpoints grouped by resource (auth, user, sme, registry, admin)
- HTTP method, route, required middleware
- Request body / query parameter schemas
- Response formats with TypeScript interfaces
- Error codes and messages

**Architecture Documentation**
- Project structure (client/ and server/ directories)
- Authentication flow (JWT lifecycle)
- Middleware chain (CORS, helmet, auth, authorize, validation)
- File upload handling (Multer configuration)
- Email service integration (SendGrid/Nodemailer)

#### User Documentation

**Admin User Guide**
- Dashboard overview
- User management procedures
- Certification review process (read-only)
- Registry management
- Audit log usage

**User Flow Diagrams**
- User registration and introduction request flow
- SME certification and approval flow
- Admin review and management flow

**Deployment and Maintenance Guide**
- Server setup and configuration
- Database migration procedures
- Environment variable management
- Monitoring and troubleshooting

### Phase 3.6: Final Staging Hardening

#### Tasks
1. Final staging environment security review
2. Database backup and export procedures
3. Production deployment configuration
4. Environment variables documentation
5. Performance benchmarking
6. SSL/HTTPS verification
7. Deployment documentation for hosting provider

### Phase 3.7: Handover Session

#### Session Agenda
1. Platform walkthrough (all user roles: User, SME, Admin)
2. Database structure explanation (Prisma schema, migrations)
3. API architecture review (Express routes, middleware, controllers)
4. Frontend architecture review (Next.js pages, components, API client)
5. Admin functions training (user management, certification review, registry management)
6. Common maintenance tasks (database migrations, environment updates, dependency updates)
7. Deployment and hosting walkthrough
8. Troubleshooting guide (logs, common errors, database queries)
9. Q&A session

#### Training Materials
- Recorded session video
- Quick reference guides for admin operations
- FAQ document covering common scenarios

### Milestone 3 Deliverables Checklist

- [ ] All pages mobile responsive (375px, 768px, 1920px breakpoints)
- [ ] UI consistency verified (colors, typography, spacing, buttons)
- [ ] Accessibility checks passed (contrast, labels, focus indicators)
- [ ] Performance optimized (Prisma queries, bundle size, lazy loading)
- [ ] User flow tested end-to-end (register through request introduction)
- [ ] SME flow tested end-to-end (register through certified listing)
- [ ] Admin flow tested end-to-end (login through audit log review)
- [ ] Admin cannot edit SME data (verified)
- [ ] Test case documentation complete with pass/fail results
- [ ] Audit trail fully functional for all action types
- [ ] Audit log CSV export working
- [ ] DB-level immutability controls verified (INSERT-only on audit_log)
- [ ] Prisma schema documented with field descriptions
- [ ] All API endpoints documented with request/response formats
- [ ] Admin user guide complete
- [ ] User flow diagrams complete
- [ ] Deployment and maintenance guide complete
- [ ] Final staging hardening complete
- [ ] Source code repository transferred to client
- [ ] All credentials and API keys handed over securely
- [ ] Handover session completed and recorded
- [ ] Training materials provided

---

## 11. Handover Package

Complete deliverables package for project handover.

### 11.1 Source Code Repository

- Private GitHub repository with full commit history
- Repository access shared on Day 1 (28 Jan 2026)
- Frontend codebase (Next.js/React)
- Backend codebase (Node.js/Express)
- Database migrations and seed data
- Environment configuration templates

### 11.2 Staging Environment

- Hosted on Redstone Catalyst subdomain (for continuous deployment access)
- Live staging URL available from 10 Feb 2026 (Milestone 1)
- Admin credentials for all user roles
- Sample test data populated
- Deployment configuration documentation

### 11.3 Documentation

- API documentation (endpoints, request/response)
- Database schema documentation
- User flow diagrams
- Admin panel user guide
- Deployment and maintenance guide

### 11.4 Handover Session

- Live walkthrough of codebase structure
- Admin panel training
- Q&A session

### 11.5 Post-Handover Support (14 Days)

- Defects that fail agreed UAT criteria: fixed at no additional cost
- New feature requests or enhancements: treated as change requests
- Response within 24 hours for critical issues

---

## 12. Cost Summary

| Milestone | Cost |
|-----------|------|
| M1: Foundation & Backend Setup | $2,500 |
| M2: Features & Integration | $1,500 |
| M3: Testing & Handover | $1,000 |
| **TOTAL PROJECT COST** | **$5,000** |

### Payment Terms

- Milestone-based payment upon successful delivery
- No upfront payment required
- Each milestone subject to UAT acceptance
- Daily progress updates provided

### Kickoff Note

If project is awarded today (27 January 2026) and Milestone 1 is created, development will commence from tomorrow (28 January 2026). Timeline dates above are based on this assumption.

---

## 13. Database Schema Design

### Data Types

#### User
| Field | Prisma Type | PostgreSQL Type | Description |
|-------|-------------|-----------------|-------------|
| id | String @id @default(uuid()) | UUID (PK) | Unique identifier |
| email | String @unique | VARCHAR(255) | User email address |
| password | String | VARCHAR(255) | Bcrypt-hashed password |
| role | UserRole (enum) | VARCHAR(20) | user / sme / admin |
| fullName | String | VARCHAR(255) | Complete name |
| phoneNumber | String? | VARCHAR(50) | Contact number |
| isVerified | Boolean @default(false) | BOOLEAN | Email verification status |
| createdAt | DateTime @default(now()) | TIMESTAMP | Account creation timestamp |
| updatedAt | DateTime @updatedAt | TIMESTAMP | Last update timestamp |
| lastLogin | DateTime? | TIMESTAMP | Last login timestamp |

#### UserProfile
| Field | Prisma Type | PostgreSQL Type | Description |
|-------|-------------|-----------------|-------------|
| id | String @id @default(uuid()) | UUID (PK) | Unique identifier |
| userId | String @unique (FK -> User) | UUID | Reference to user |
| company | String? | VARCHAR(255) | User's company/organization |
| jobTitle | String? | VARCHAR(100) | User's job title |

#### SMEProfile
| Field | Prisma Type | PostgreSQL Type | Description |
|-------|-------------|-----------------|-------------|
| id | String @id @default(uuid()) | UUID (PK) | Unique identifier |
| userId | String @unique (FK -> User) | UUID | Reference to user |
| companyName | String? | VARCHAR(255) | Registered company name |
| tradeLicenseNumber | String? | VARCHAR(100) | UAE trade license |
| companyDescription | String? | TEXT | Business description |
| industrySector | IndustrySector? (enum) | VARCHAR(50) | Industry category |
| foundingDate | DateTime? | DATE | Company establishment date |
| employeeCount | Int? | INTEGER | Current employee count |
| annualRevenue | Decimal? | DECIMAL(15,2) | Latest annual revenue |
| website | String? | VARCHAR(255) | Company website URL |
| address | String? | TEXT | Business address |
| documents | Json? | JSONB | Array of file paths for uploaded documents |
| certificationStatus | CertificationStatus (enum) | VARCHAR(20) | draft / submitted / under_review / certified / rejected / revision_requested |
| submittedDate | DateTime? | TIMESTAMP | Certification submission date |
| reviewedById | String? (FK -> User) | UUID | Admin who reviewed |
| revisionNotes | String? | TEXT | Admin review comments |
| listingVisible | Boolean @default(false) | BOOLEAN | Whether visible in registry |

#### IntroductionRequest
| Field | Prisma Type | PostgreSQL Type | Description |
|-------|-------------|-----------------|-------------|
| id | String @id @default(uuid()) | UUID (PK) | Unique identifier |
| requesterId | String (FK -> User) | UUID | Reference to requesting user |
| smeProfileId | String (FK -> SMEProfile) | UUID | Reference to SME profile |
| message | String | TEXT | Introduction request message |
| contactPreferences | String? | TEXT | Preferred contact method |
| status | RequestStatus (enum) | VARCHAR(20) | pending / viewed / responded |
| requestedDate | DateTime @default(now()) | TIMESTAMP | When request was made |

#### AuditLog
| Field | Prisma Type | PostgreSQL Type | Description |
|-------|-------------|-----------------|-------------|
| id | String @id @default(uuid()) | UUID (PK) | Unique identifier |
| userId | String (FK -> User) | UUID | User who performed action |
| actionType | String | VARCHAR(50) | Type of action performed |
| actionDescription | String | TEXT | Detailed description |
| targetType | String? | VARCHAR(50) | Entity type affected |
| targetId | String? | UUID | ID of affected record |
| ipAddress | String? | VARCHAR(45) | User IP address (IPv6 compatible) |
| timestamp | DateTime @default(now()) | TIMESTAMP | When action occurred |
| previousValue | String? | TEXT | JSON string of value before change |
| newValue | String? | TEXT | JSON string of value after change |

### Prisma Enums

#### UserRole
- user
- sme
- admin

#### CertificationStatus
- draft
- submitted
- under_review
- certified
- rejected
- revision_requested

#### RequestStatus
- pending
- viewed
- responded

#### IndustrySector
- technology
- healthcare
- finance
- retail
- manufacturing
- real_estate
- hospitality
- education
- other

---

## 14. Appendix

### NPM Dependencies

#### Server (Node.js/Express)

| Package | Purpose |
|---------|---------|
| express | Web framework |
| typescript | Type safety |
| @prisma/client | Database ORM client |
| prisma | Schema management and migrations |
| jsonwebtoken | JWT authentication |
| bcrypt | Password hashing |
| express-validator | Input validation |
| multer | File upload handling |
| cors | Cross-origin resource sharing |
| helmet | Security headers |
| express-rate-limit | Rate limiting |
| nodemailer | Email sending |
| dotenv | Environment variables |
| uuid | Unique identifier generation |

#### Client (Next.js/React)

| Package | Purpose |
|---------|---------|
| next | React framework |
| react / react-dom | UI library |
| typescript | Type safety |
| tailwindcss | Utility-first CSS |
| axios | HTTP client |
| react-hook-form | Form state management |
| @hookform/resolvers | Form validation resolvers |
| zod | Schema validation |
| lucide-react | Icon library |

### External Service Integration

#### Email Service
- SendGrid (primary) or Nodemailer SMTP for transactional emails
- Client to provide SendGrid API key or SMTP credentials

#### File Storage
- S3-compatible private bucket with signed URLs for secure document access
- PDF, JPG, PNG only; 10MB max per document
- Access rules enforced per role (SME sees own; Admin views only; Users see certified profile docs)

### Security Considerations

- All passwords hashed with bcrypt (10 salt rounds)
- Password requirements: minimum 8 characters, uppercase, lowercase, number
- JWT tokens expire after configured duration (default 7 days)
- Rate limiting on authentication endpoints (express-rate-limit)
- HTTPS enforced in production
- CORS configured to allow only frontend origin
- Helmet middleware for security headers
- SQL injection prevented by Prisma parameterized queries
- XSS prevented by React DOM escaping and input validation
- File upload validation (type, size limits) via Multer
- Audit log table has INSERT-only permission at database level
- **Admin cannot edit SME business data (enforced at API level)**

### Naming Conventions

#### Routes (Next.js)
- kebab-case directory names under `app/`
- Example: `(dashboard)/user/registry/[profileId]/page.tsx`

#### React Components
- PascalCase for component names and filenames
- Example: `RegistryListingPage`, `CompanyCard`, `ReviewModal`

#### API Routes (Express)
- kebab-case URL paths
- Example: `/api/auth/forgot-password`, `/api/admin/audit-logs`

#### Prisma Models
- PascalCase for model names
- camelCase for field names
- Example: `SMEProfile`, `IntroductionRequest`, `companyName`, `certificationStatus`

#### TypeScript
- PascalCase for interfaces and types
- camelCase for variables, functions, and methods
- UPPER_SNAKE_CASE for constants and enum values in audit log action types
- Example: `interface SMEProfile {}`, `const fetchRegistry = async () => {}`, `CERTIFICATION_SUBMITTED`

#### Server Files
- camelCase for file names
- Example: `auth.controller.ts`, `registry.routes.ts`, `auditLogger.ts`

---

## 15. Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-27 | Initial development plan | Development Team |
| 2.0 | 2026-01-30 | Complete rewrite for SME Readiness Certification Portal: replaced Equity Crowdfunding concept with Certification SaaS; changed roles from Investor/SME/Admin to User/SME/Admin; removed all investment/deal/express-interest features; added certification workflow (submit/review/approve/reject/revision); added public registry listing; added Request Introduction mechanism; added Data Integrity Restriction (Admin cannot edit SME data); updated all screens, RBAC matrix, API endpoints, audit log actions, UAT criteria; updated milestone deliverables and dates | Development Team |
| 3.0 | 2026-02-05 | Client Scope Update: Added Section 16 — 4-Phase implementation plan for Legal & Trust Pages, Analytics Enhancements, Registry Tracking, and Optional Polish. All additions are non-breaking and additive only. | Development Team |

---

## 16. Client Scope Update — 4-Phase Implementation Plan

> All data MUST be dynamic (database-driven). Nothing hardcoded.

### NON-BREAKING GUARANTEE

> **IMPORTANT:** This scope update is ADDITIVE only. No existing functionality, database tables, frontend pages, or backend endpoints will be modified in a breaking way. All changes are new additions or safe extensions to existing code.
>
> - **Database:** Only NEW models/tables added (e.g., `LegalPage`). Existing models (`User`, `SMEProfile`, `AuditLog`, etc.) remain untouched except for adding new enum values to `AuditAction`.
> - **Backend:** Only NEW controllers/routes added (e.g., `legal.controller.ts`, `legal.routes.ts`). Existing controllers only get new functions appended — no existing function signatures or behavior changed.
> - **Frontend:** Only NEW pages/components added (e.g., `PublicFooter`, legal pages). Existing pages only get minor additions (e.g., footer component import, button color). No existing UI or logic removed or altered.
> - **Auth/RBAC:** No changes to existing authentication flow or role permissions.

---

### PHASE 1: Legal & Trust Pages + Public Footer

**Goal:** 4 legal pages (Terms, Privacy, Legal Notice, Contact) stored in DB, accessible from a consistent footer on all public pages.

#### Server Changes

| # | Task | File |
|---|------|------|
| 1 | New Prisma model: `LegalPage` (id, slug, title, content, lastUpdated, updatedBy, isPublished) | `server/prisma/schema.prisma` |
| 2 | New controller: `getLegalPage` (public), `updateLegalPage` (admin) | `server/src/controllers/legal.controller.ts` |
| 3 | New routes: `GET /api/legal/:slug`, `PUT /api/legal/:slug` | `server/src/routes/legal.routes.ts` |
| 4 | Register routes: `app.use('/api/legal', legalRoutes)` | `server/src/index.ts` |
| 5 | Add `LEGAL_PAGE_UPDATED` audit action | `server/src/utils/auditLogger.ts` |
| 6 | Seed script: upsert 4 pages with Draft.docx content | `server/prisma/seed-legal.ts` |

#### Client Changes

| # | Task | File |
|---|------|------|
| 7 | `PublicFooter` component (links, branding, copyright) | `client/src/components/PublicFooter.tsx` |
| 8 | Legal page layout (header + footer) | `client/src/app/(public)/layout.tsx` |
| 9 | Terms page (dynamic from DB) | `client/src/app/(public)/terms/page.tsx` |
| 10 | Privacy page (dynamic from DB) | `client/src/app/(public)/privacy/page.tsx` |
| 11 | Legal Notice page (dynamic from DB) | `client/src/app/(public)/legal-notice/page.tsx` |
| 12 | Contact page (dynamic from DB) | `client/src/app/(public)/contact/page.tsx` |
| 13 | Replace landing page inline footer with `PublicFooter` | `client/src/app/page.tsx` |
| 14 | Add compact footer to auth layout | `client/src/app/(auth)/layout.tsx` |
| 15 | Fix register page `#` links to `/terms` and `/privacy` | `client/src/app/(auth)/register/page.tsx` |
| 16 | API methods: `getLegalPage(slug)`, `updateLegalPage(slug, data)` | `client/src/lib/api.ts` |
| 17 | `LegalPageData` interface | `client/src/types/index.ts` |

---

### PHASE 2: Login Segmentation + Core Analytics API

**Goal:** Move analytics computation to server-side. Add login segmentation (SME/Partner/Admin), usage quality metrics, and certification lifecycle diagnostics.

#### Server Changes

| # | Task | File |
|---|------|------|
| 1 | Fix login audit to store role in `newValue` | `server/src/controllers/auth.controller.ts` |
| 2 | New endpoint: `GET /api/admin/analytics?timeRange=30` — all metrics server-side | `server/src/controllers/admin.controller.ts` |
| 3 | Register analytics route | `server/src/routes/admin.routes.ts` |

**Metrics:** Login counts by role, unique logins, repeat logins, inactive certified SMEs, avg days to submit, drop-off by stage, activity by day, actions by type, certification stats.

#### Client Changes

| # | Task | File |
|---|------|------|
| 4 | API method: `getAdminAnalytics(timeRange)` + `AnalyticsData` type | `client/src/lib/api.ts`, `client/src/types/index.ts` |
| 5 | Rewrite analytics page — fetch from server, remove client-side computation | `client/src/app/admin/analytics/page.tsx` |

---

### PHASE 3: Registry Tracking + Risk & Compliance

**Goal:** Track registry views/searches in audit log. Add registry consumption analytics and risk/compliance signals.

#### Server Changes

| # | Task | File |
|---|------|------|
| 1 | New audit actions: `REGISTRY_SEARCH`, `REGISTRY_VIEW`, `REGISTRY_ZERO_RESULTS` | `server/src/utils/auditLogger.ts` |
| 2 | Instrument registry controller with audit logging | `server/src/controllers/registry.controller.ts` |
| 3 | Extend analytics endpoint with registry + risk metrics | `server/src/controllers/admin.controller.ts` |

**Metrics:** Views by sector, search filters used, zero-result searches, missing docs, near-expiry certs, expired certs, admin overrides, revocations by reason.

#### Client Changes

| # | Task | File |
|---|------|------|
| 4 | Extend analytics types with `registryConsumption` and `riskCompliance` | `client/src/types/index.ts` |
| 5 | Add "Registry Consumption" and "Risk & Compliance" sections | `client/src/app/admin/analytics/page.tsx` |

---

### PHASE 4: Optional Enhancements + Polish

**Goal:** Role-based analytics filters, metric tooltips, timezone normalization, admin legal page editor.

#### Server Changes

| # | Task | File |
|---|------|------|
| 1 | Role filter + timezone param on analytics endpoint | `server/src/controllers/admin.controller.ts` |

#### Client Changes

| # | Task | File |
|---|------|------|
| 2 | Role filter dropdown on analytics page | `client/src/app/admin/analytics/page.tsx` |
| 3 | Metric tooltips (info icons with hover) | `client/src/app/admin/analytics/page.tsx` |
| 4 | Timezone auto-detect + optional override | `client/src/app/admin/analytics/page.tsx` |
| 5 | Admin legal page editor | `client/src/app/admin/legal/page.tsx` |
| 6 | Add "Legal Pages" nav item | `client/src/components/DashboardShell.tsx` |

---

### Key Design Decisions

1. **Legal content in DB** — Not hardcoded. Admin can edit without code changes. Seed script provides initial content.
2. **Server-side analytics** — Replace current client-side computation (fetches 500 raw logs). All metrics computed via Prisma raw SQL.
3. **Login role via JOIN** — Historical logs lack role. JOIN with users table solves retroactively. Future logs also store role in newValue.
4. **Registry tracking via audit log** — Reuse existing AuditLog model with new action types (consistent with codebase pattern).
5. **Custom SVG charts** — No external chart library. Continue existing SVG pattern.
6. **Footer: component, not inline** — Reusable `PublicFooter` for public pages. Auth layout gets compact version. Dashboards get no footer.

---

## 17. Certificate Upgrade Specification — Registry-Grade Digital Credential

> **Version:** 1.1 | **Status:** Approved | **Target:** v4.0

### Objective

Upgrade the Naywa SME Certificate from a stateless PDF to a **verifiable, registry-grade digital credential** suitable for institutional use (banks, investors, regulators), while remaining fully within Phase 1 scope.

The certificate must be:
- Electronically issued
- Time-bound (auto-expiry)
- Verifiable via public registry page
- Tamper-evident (SHA-256 hash)
- Auditable (full lifecycle logging)

**The registry is the single source of truth. The PDF is a portable representation only.**

---

### PHASE 1: Database Schema

**File:** `server/prisma/schema.prisma`

#### New Enum: CertificateStatus
```prisma
enum CertificateStatus {
  active
  expired
  revoked
}
```

#### New Model: Certificate
```prisma
model Certificate {
  id                    String            @id @default(uuid())
  certificateId         String            @unique  // SME-CERT-XXXXXXXX (cryptographically random)
  certificateVersion    String            @default("v1.0")  // v1.0, v1.1, v1.2...

  // Linked SME Profile
  smeProfileId          String

  // Core certificate data (snapshot at issuance)
  companyName           String
  tradeLicenseNumber    String
  industrySector        String

  // Dates
  issuedAt              DateTime          @default(now())
  expiresAt             DateTime          // issuedAt + 12 months

  // Status & Governance
  status                CertificateStatus @default(active)
  revokedAt             DateTime?
  revocationReason      String?

  // Verification
  verificationUrl       String            // https://sme.byredstone.com/verify/{certificateId}
  verificationHash      String            // SHA-256 hash of deterministic payload

  // Issuance metadata
  issuedBy              String            // Admin user ID who approved
  lastReissuedAt        DateTime?

  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  // Relations
  smeProfile            SMEProfile        @relation(fields: [smeProfileId], references: [id], onDelete: Cascade)
  issuedByUser          User              @relation("CertificateIssuer", fields: [issuedBy], references: [id])

  @@index([smeProfileId])
  @@index([status])
  @@index([certificateId])
  @@map("certificates")
}
```

#### Model Updates
- Add `certificates Certificate[]` to SMEProfile
- Add `issuedCertificates Certificate[] @relation("CertificateIssuer")` to User

#### Migration
- Run `npx prisma migrate dev --name add_certificate_model`
- Create data migration script for existing certified SMEs

---

### PHASE 2: Certificate Utilities

**New File:** `server/src/utils/certificate.ts`

| Function | Purpose |
|----------|---------|
| `generateCertificateId()` | crypto.randomBytes(4) → `SME-CERT-XXXXXXXX` |
| `generateVerificationHash(payload)` | SHA-256 of sorted JSON (certId, company, license, sector, issuedAt, expiresAt, version) |
| `computeCertificateStatus(storedStatus, expiresAt)` | Dynamic: if revoked→Revoked, if now>expiresAt→Expired, else→Active |
| `incrementVersion(current)` | v1.0 → v1.1 → v1.2 |

**File:** `server/src/utils/auditLogger.ts`

Add new audit actions:
- `CERTIFICATE_ISSUED`
- `CERTIFICATE_DOWNLOADED`
- `CERTIFICATE_REISSUED`
- `CERTIFICATE_REVOKED`
- `REGISTRY_VERIFICATION_VIEWED`

---

### PHASE 3: Backend API Endpoints

#### 3.1 Auto-create Certificate on Approval
**File:** `server/src/controllers/admin.controller.ts`

In `reviewApplication` → `case 'approve'`:
- Wrap in `prisma.$transaction()`
- Create Certificate record atomically with profile status update
- Generate certificateId, verificationHash, verificationUrl
- Set expiresAt = now + 12 months
- Log `CERTIFICATE_ISSUED` audit action

#### 3.2 Revoke Certificate
**Endpoint:** `POST /api/admin/certificates/:certificateId/revoke`

- Set status = revoked, revokedAt = now, revocationReason = req.body.reason
- Log `CERTIFICATE_REVOKED`

#### 3.3 Reissue Certificate
**Endpoint:** `POST /api/admin/certificates/:certificateId/reissue`

- Increment version (v1.0 → v1.1)
- Generate new verificationHash
- Reset expiresAt = now + 12 months
- Set lastReissuedAt = now, status = active
- Log `CERTIFICATE_REISSUED`

#### 3.4 Rewrite downloadCertificate
**File:** `server/src/controllers/sme.controller.ts` (lines 1436-1542)

- Fetch Certificate record from DB
- Generate QR code via `qrcode.toBuffer()` (package already installed)
- Generate new institutional PDF layout (see Phase 4)
- Log `CERTIFICATE_DOWNLOADED`

#### 3.5 Public Verification API
**New File:** `server/src/controllers/verify.controller.ts`

**Endpoint:** `GET /api/verify/:certificateId` (PUBLIC, no auth)

Returns:
- certificateId, certificateVersion
- companyName, tradeLicenseNumber, industrySector
- issuedAt, expiresAt
- status (computed dynamically: Active/Expired/Revoked)
- verificationHash (truncated to 16 chars for display)
- revokedAt, revocationReason (if revoked)

**NO personal data** (emails, phones, IDs)

#### 3.6 Register Routes
**New File:** `server/src/routes/verify.routes.ts` (public, no auth middleware)

**File:** `server/src/index.ts`
- Mount `app.use('/api/verify', verifyRoutes)`

**File:** `server/src/routes/admin.routes.ts`
- Add `POST /admin/certificates/:certificateId/revoke`
- Add `POST /admin/certificates/:certificateId/reissue`

#### 3.7 Return Certificate in Application Detail
**File:** `server/src/controllers/admin.controller.ts` → `getApplicationDetail`

- Include latest Certificate record when status is certified

---

### PHASE 4: PDF Redesign — Institutional Layout

**File:** `server/src/controllers/sme.controller.ts`

Complete rewrite of PDF generation. A4 Landscape (842×595 pts).

| Block | Content |
|-------|---------|
| 1. Authority Header | "NAYWA" left-aligned + "SME Certification Authority" subtitle + hairline rule |
| 2. Certification Statement | "Certificate of SME Certification" 18pt + attestation paragraph |
| 3. Certified Entity | 2-column grid: Company Name (dominant 14pt), Trade License, Industry Sector |
| 4. Validity & Control Box | Gray bordered box: Certificate ID, Version, Issued, Expires, Status |
| 5. Verification Footer | Left: truncated SHA-256 hash + verification URL. Right: QR code (monochrome, 80×80) + "Verify via Naywa Registry" label |

**Footer Text:**
> *"Digitally issued via Naywa Registry System. This document is electronically generated and does not require a physical signature."*

**PROHIBITED:**
- No signatures (named or handwritten)
- No graphic stamps or seals
- No decorative borders
- No award/diploma styling
- No government-resembling insignia

---

### PHASE 5: Frontend

#### 5.1 Types
**File:** `client/src/types/index.ts`

```typescript
export type CertificateStatus = 'Active' | 'Expired' | 'Revoked';

export interface CertificateData {
  certificateId: string;
  certificateVersion: string;
  companyName: string;
  tradeLicenseNumber: string;
  industrySector: string;
  issuedAt: string;
  expiresAt: string;
  status: CertificateStatus;
  verificationHash: string;
  verificationUrl: string;
  revokedAt: string | null;
  revocationReason: string | null;
  issuedBy: string;
  lastReissuedAt: string | null;
}

export interface CertificateVerification {
  certificateId: string;
  certificateVersion: string;
  companyName: string;
  tradeLicenseNumber: string;
  industrySector: string;
  issuedAt: string;
  expiresAt: string;
  status: CertificateStatus;
  verificationHashTruncated: string;
  revokedAt: string | null;
  revocationReason: string | null;
}
```

#### 5.2 API Methods
**File:** `client/src/lib/api.ts`

- `verifyCertificate(certificateId)` — public, no auth token
- `revokeCertificate(certificateId, reason?)` — admin
- `reissueCertificate(certificateId)` — admin

#### 5.3 Public Verification Page
**New File:** `client/src/app/(public)/verify/[certificateId]/page.tsx`

- Uses existing `(public)` layout (Naywa header + footer)
- Calls `/api/verify/:certificateId` on mount
- 4 states: Active (green badge), Expired (amber badge), Revoked (red badge + reason), Not Found
- Shows: company name, trade license, industry, dates, cert ID, version, truncated hash
- Institutional design matching existing public pages

#### 5.4 Admin Certificate Management
**File:** `client/src/app/admin/applications/[id]/page.tsx`

When status = certified, show Certificate section:
- Certificate ID, version, issued date, expiry, status
- "Revoke Certificate" button + confirmation modal (with optional reason input)
- "Reissue Certificate" button + confirmation

#### 5.5 SME Certificate Info
**File:** `client/src/app/sme/certification/page.tsx`

When certified, display:
- Certificate ID, version, expiry
- Verification URL (clickable)
- Download button (works with new PDF)

---

### PHASE 6: Migration & Deployment

1. Run Prisma migration on production DB
2. Run data migration script for existing certified SMEs
3. Verify `FRONTEND_URL=https://sme.byredstone.com` in production env
4. Build client + server
5. Deploy via PM2 restart
6. Create database backup as v4.0
7. Create Git tag v4.0

---

### Files Modified/Created Summary

| Action | File |
|--------|------|
| MODIFY | `server/prisma/schema.prisma` |
| CREATE | `server/src/utils/certificate.ts` |
| MODIFY | `server/src/utils/auditLogger.ts` |
| MODIFY | `server/src/controllers/admin.controller.ts` |
| MODIFY | `server/src/controllers/sme.controller.ts` |
| CREATE | `server/src/controllers/verify.controller.ts` |
| CREATE | `server/src/routes/verify.routes.ts` |
| MODIFY | `server/src/routes/admin.routes.ts` |
| MODIFY | `server/src/index.ts` |
| CREATE | `scripts/migrate-existing-certificates.ts` |
| MODIFY | `client/src/types/index.ts` |
| MODIFY | `client/src/lib/api.ts` |
| CREATE | `client/src/app/(public)/verify/[certificateId]/page.tsx` |
| MODIFY | `client/src/app/admin/applications/[id]/page.tsx` |
| MODIFY | `client/src/app/sme/certification/page.tsx` |

---

### Audit Trail Requirements

| Action | Trigger | Data Logged |
|--------|---------|-------------|
| `CERTIFICATE_ISSUED` | Admin approves certification | certificateId, smeProfileId, issuedBy |
| `CERTIFICATE_DOWNLOADED` | SME downloads PDF | certificateId, userId |
| `CERTIFICATE_REISSUED` | Admin reissues certificate | certificateId, oldVersion, newVersion |
| `CERTIFICATE_REVOKED` | Admin revokes certificate | certificateId, reason, revokedBy |
| `REGISTRY_VERIFICATION_VIEWED` | Public verification page accessed | certificateId, IP (if available) |

---

### Governance Rules

1. **Expiry Enforcement:** Certificate auto-expires when `now > expiresAt`. Verification page reflects status immediately.

2. **Revocation (Admin Only):** Sets status = revoked, records reason. Reflected instantly on verification page.

3. **Reissue:** Creates new version (v1.1, v1.2), generates new hash, resets expiry. Old version marked superseded.

4. **Single Source of Truth:** In the event of any discrepancy between the PDF and the registry record, **the registry record shall prevail**.

---

### Definition of Done

Implementation is complete when:

- [ ] Certificate PDF includes: QR verification, expiry date, version number, hash, digital issuance statement
- [ ] Verification page works for: Active, Expired, Revoked, Not Found states
- [ ] Audit logs capture all certificate lifecycle actions
- [ ] No signatures or decorative stamps are present
- [ ] Admin can revoke and reissue certificates
- [ ] Existing certified SMEs have Certificate records (migration complete)
- [ ] All tests pass, deployed to production
