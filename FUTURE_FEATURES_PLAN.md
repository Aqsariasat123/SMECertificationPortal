# NAIWA - Future Features, APIs & Automation Plan

## UAE API Integrations

### 1. UAE Pass (Identity Verification)
**Purpose:** National identity verification and secure login via Emirates ID

**Technical Implementation:**
- OAuth integration (code already ready)
- Login page UAE Pass button
- User profile Emirates ID linking

**Client Requirements:**
| Requirement | Description |
|-------------|-------------|
| UAE Pass Developer Account | Apply at https://selfcare.uaepass.ae |
| Client ID & Secret | Provided after approval |
| Callback URL Approval | Site URL whitelist required |
| Business Documents | Trade license, company details |

**Timeline:** 1-2 weeks (waiting for UAE Pass approval)

---

### 2. DED API (Trade License Validation)
**Purpose:** Verify trade license number, expiry, status, and company details

**Technical Implementation:**
- API integration for license verification
- Auto-fetch company details from license number
- Expiry date auto-populate

**Client Requirements:**
| Requirement | Description |
|-------------|-------------|
| DED Partnership | Contact Dubai DED / Dubai Pulse |
| API Credentials | Provided after agreement |
| Service Agreement | Possibly paid service |

**Timeline:** 2-4 weeks (depends on DED approval)

---

### 3. FTA API (Tax Verification)
**Purpose:** TRN (Tax Registration Number) and VAT status verification

**Technical Implementation:**
- TRN number validation
- VAT registration status check
- Auto-populate tax details

**Client Requirements:**
| Requirement | Description |
|-------------|-------------|
| FTA Developer Access | Apply at https://tax.gov.ae |
| API Key | Provided after registration |

**Timeline:** 1-2 weeks

---

### 4. AECB - Al Etihad Credit Bureau (Credit Score)
**Purpose:** Company credit scores and financial health reports

**Technical Implementation:**
- Credit report fetch for SMEs
- Risk scoring integration
- Financial health indicators

**Client Requirements:**
| Requirement | Description |
|-------------|-------------|
| AECB Commercial Partnership | Paid service - contract required |
| API Credentials | Provided after contract |
| Per-query Cost | ~AED 50-100 per report |

**Timeline:** 2-4 weeks + commercial agreement

---

### 5. MOHRE (Labor Compliance)
**Purpose:** Establishment card and workforce compliance verification

**Technical Implementation:**
- Establishment card verification
- Employee count validation
- Labor compliance status

**Client Requirements:**
| Requirement | Description |
|-------------|-------------|
| MOHRE API Access | Government partnership required |
| Authorization | May need special approval |

**Timeline:** 3-4 weeks

---

## Automation Features

### 1. Document Expiry Tracking (No Client Dependency)
**Purpose:** Auto alerts before document expiry

**Technical Implementation:**
- Add expiryDate field in documents table
- Admin panel expiry date input during review
- Daily cron job to check expiring documents
- Email alerts at 30, 15, 7 days before expiry
- Dashboard notification display

**Timeline:** 1-2 days

---

### 2. Certificate Renewal Reminders (No Client Dependency)
**Purpose:** Automated reminders before certificate expiry

**Technical Implementation:**
- Certificate expiry date already in database
- Cron job for renewal check (daily)
- Email templates for 90/60/30/7 day reminders
- SME dashboard "Renewal Due" badge
- Admin panel expiring certificates list

**Timeline:** 1-2 days

---

### 3. Application Status Notifications (No Client Dependency)
**Purpose:** Real-time email/SMS updates on application status

**Technical Implementation:**
- Trigger emails on status change
- SMS integration (optional - requires SMS gateway)
- In-app notifications (already exists)

**Timeline:** 1 day

---

## Already Automated Features

| Feature | Status |
|---------|--------|
| Certificate Generation | ✅ Automated |
| QR Code Verification | ✅ Automated |
| Duplicate Application Detection | ✅ Automated |
| Email Verification | ✅ Automated |
| 2FA Authentication | ✅ Automated |

---

## Summary Table

| Feature | Client Action Needed | Timeline |
|---------|---------------------|----------|
| UAE Pass | Apply for developer account | 1-2 weeks |
| DED API | Contact Dubai Pulse/DED | 2-4 weeks |
| FTA API | Register at tax.gov.ae | 1-2 weeks |
| AECB | Sign commercial agreement | 2-4 weeks |
| MOHRE | Government partnership | 3-4 weeks |
| **Document Expiry Alerts** | Nothing needed | **2 days** |
| **Renewal Reminders** | Nothing needed | **2 days** |
| **Status Notifications** | Nothing needed | **1 day** |

---

## Client Message Template

```
Hi,

For UAE API integrations, we need the following from your side:

1. UAE Pass Integration:
   - Register at https://selfcare.uaepass.ae for developer account
   - Provide: Client ID, Client Secret (after approval)
   - Share company trade license for registration

2. DED API (Trade License Validation):
   - Contact Dubai Pulse (https://dubaipulse.gov.ae) or DED directly
   - Request API access for trade license verification
   - Provide: API credentials after approval

3. FTA API (Tax Verification):
   - Register at https://tax.gov.ae developer portal
   - Provide: API Key after registration

4. AECB (Credit Score):
   - Contact AECB for commercial partnership
   - Sign service agreement (paid service ~AED 50-100 per query)
   - Provide: API credentials after contract

5. MOHRE (Labor Compliance):
   - Apply for government API partnership
   - Provide: Authorization documents & API access

Note: These registrations typically take 1-4 weeks for approval.
Meanwhile, we can proceed with Document Expiry Alerts and Renewal
Reminders - no credentials needed for these.
```

---

## Priority Recommendation

**Phase 1 (Immediate - No Dependencies):**
1. Document Expiry Tracking
2. Renewal Reminders
3. Application Status Notifications

**Phase 2 (After Client Provides Credentials):**
1. UAE Pass (highest priority - identity verification)
2. DED API (trade license validation)
3. FTA API (tax compliance)

**Phase 3 (Commercial Agreements Required):**
1. AECB Credit Score
2. MOHRE Labor Compliance

---

*Document Created: February 2026*
*Project: NAIWA SME Certification Platform*
