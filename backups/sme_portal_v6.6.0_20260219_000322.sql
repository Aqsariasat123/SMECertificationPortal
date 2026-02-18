--
-- PostgreSQL database dump
--

\restrict 6a3Uxed1VzkJxHzML6j51MGc5zSMu7JdmoaqR6w9U0esDDqKLYAM7orvtQ7imDH

-- Dumped from database version 15.15 (Homebrew)
-- Dumped by pg_dump version 15.15 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AccountStatus; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."AccountStatus" AS ENUM (
    'active',
    'suspended'
);


ALTER TYPE public."AccountStatus" OWNER TO aqsariasat;

--
-- Name: BusinessModel; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."BusinessModel" AS ENUM (
    'b2b',
    'b2c',
    'b2b2c',
    'marketplace',
    'saas',
    'other'
);


ALTER TYPE public."BusinessModel" OWNER TO aqsariasat;

--
-- Name: CertificateStatus; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."CertificateStatus" AS ENUM (
    'active',
    'expired',
    'revoked'
);


ALTER TYPE public."CertificateStatus" OWNER TO aqsariasat;

--
-- Name: CertificationStatus; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."CertificationStatus" AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'certified',
    'rejected',
    'revision_requested'
);


ALTER TYPE public."CertificationStatus" OWNER TO aqsariasat;

--
-- Name: DocumentStatus; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."DocumentStatus" AS ENUM (
    'pending',
    'approved',
    'requires_revision'
);


ALTER TYPE public."DocumentStatus" OWNER TO aqsariasat;

--
-- Name: EmailStatus; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."EmailStatus" AS ENUM (
    'sent',
    'failed'
);


ALTER TYPE public."EmailStatus" OWNER TO aqsariasat;

--
-- Name: FundingStage; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."FundingStage" AS ENUM (
    'bootstrapped',
    'pre_seed',
    'seed',
    'series_a',
    'series_b',
    'series_c_plus',
    'profitable',
    'other'
);


ALTER TYPE public."FundingStage" OWNER TO aqsariasat;

--
-- Name: IndustrySector; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."IndustrySector" AS ENUM (
    'technology',
    'healthcare',
    'finance',
    'retail',
    'manufacturing',
    'real_estate',
    'hospitality',
    'education',
    'other'
);


ALTER TYPE public."IndustrySector" OWNER TO aqsariasat;

--
-- Name: InvestorType; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."InvestorType" AS ENUM (
    'individual',
    'company'
);


ALTER TYPE public."InvestorType" OWNER TO aqsariasat;

--
-- Name: KycStatus; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."KycStatus" AS ENUM (
    'not_submitted',
    'pending',
    'approved',
    'rejected',
    'revision_requested'
);


ALTER TYPE public."KycStatus" OWNER TO aqsariasat;

--
-- Name: LegalStructure; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."LegalStructure" AS ENUM (
    'llc',
    'partnership',
    'sole_proprietorship',
    'corporation',
    'free_zone',
    'branch',
    'other'
);


ALTER TYPE public."LegalStructure" OWNER TO aqsariasat;

--
-- Name: OfficeType; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."OfficeType" AS ENUM (
    'own_premises',
    'rented',
    'shared_coworking',
    'virtual',
    'home_based'
);


ALTER TYPE public."OfficeType" OWNER TO aqsariasat;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'not_requested',
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE public."PaymentStatus" OWNER TO aqsariasat;

--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'pending',
    'viewed',
    'responded'
);


ALTER TYPE public."RequestStatus" OWNER TO aqsariasat;

--
-- Name: SupportTicketPriority; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."SupportTicketPriority" AS ENUM (
    'low',
    'medium',
    'high'
);


ALTER TYPE public."SupportTicketPriority" OWNER TO aqsariasat;

--
-- Name: SupportTicketStatus; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."SupportTicketStatus" AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'closed'
);


ALTER TYPE public."SupportTicketStatus" OWNER TO aqsariasat;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: aqsariasat
--

CREATE TYPE public."UserRole" AS ENUM (
    'user',
    'sme',
    'admin'
);


ALTER TYPE public."UserRole" OWNER TO aqsariasat;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO aqsariasat;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    "userId" text NOT NULL,
    "actionType" text NOT NULL,
    "actionDescription" text NOT NULL,
    "targetType" text,
    "targetId" text,
    "ipAddress" text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "previousValue" text,
    "newValue" text
);


ALTER TABLE public.audit_logs OWNER TO aqsariasat;

--
-- Name: certificates; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.certificates (
    id text NOT NULL,
    "certificateId" text NOT NULL,
    "certificateVersion" text DEFAULT 'v1.0'::text NOT NULL,
    "smeProfileId" text NOT NULL,
    "companyName" text NOT NULL,
    "tradeLicenseNumber" text NOT NULL,
    "industrySector" text NOT NULL,
    "issuedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    status public."CertificateStatus" DEFAULT 'active'::public."CertificateStatus" NOT NULL,
    "revokedAt" timestamp(3) without time zone,
    "revocationReason" text,
    "verificationUrl" text NOT NULL,
    "verificationHash" text NOT NULL,
    "issuedById" text NOT NULL,
    "lastReissuedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.certificates OWNER TO aqsariasat;

--
-- Name: chat_attachments; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.chat_attachments (
    id text NOT NULL,
    "messageId" text NOT NULL,
    "fileName" text NOT NULL,
    "originalName" text NOT NULL,
    "filePath" text NOT NULL,
    "fileSize" integer NOT NULL,
    "mimeType" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.chat_attachments OWNER TO aqsariasat;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.chat_messages (
    id text NOT NULL,
    "introductionRequestId" text NOT NULL,
    "senderId" text NOT NULL,
    content text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "deletedForUsers" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "editedAt" timestamp(3) without time zone,
    "isDeletedForEveryone" boolean DEFAULT false NOT NULL,
    "isEdited" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.chat_messages OWNER TO aqsariasat;

--
-- Name: document_versions; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.document_versions (
    id text NOT NULL,
    "smeProfileId" text NOT NULL,
    "documentType" text NOT NULL,
    "originalName" text NOT NULL,
    "fileName" text NOT NULL,
    "filePath" text NOT NULL,
    "fileSize" integer,
    "mimeType" text,
    version integer DEFAULT 1 NOT NULL,
    status public."DocumentStatus" DEFAULT 'pending'::public."DocumentStatus" NOT NULL,
    "adminFeedback" text,
    "reviewedById" text,
    "reviewedAt" timestamp(3) without time zone,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "replacedAt" timestamp(3) without time zone,
    "isLatest" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.document_versions OWNER TO aqsariasat;

--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.email_logs (
    id text NOT NULL,
    "recipientEmail" text NOT NULL,
    "recipientName" text,
    "entityType" text NOT NULL,
    "entityId" text,
    "eventType" text NOT NULL,
    subject text NOT NULL,
    "templateId" text,
    status public."EmailStatus" DEFAULT 'sent'::public."EmailStatus" NOT NULL,
    "errorMessage" text,
    metadata jsonb,
    "sentAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.email_logs OWNER TO aqsariasat;

--
-- Name: introduction_requests; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.introduction_requests (
    id text NOT NULL,
    "requesterId" text NOT NULL,
    "smeProfileId" text NOT NULL,
    message text NOT NULL,
    "contactPreferences" text,
    status public."RequestStatus" DEFAULT 'pending'::public."RequestStatus" NOT NULL,
    "requestedDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "respondedAt" timestamp(3) without time zone,
    "smeResponse" text
);


ALTER TABLE public.introduction_requests OWNER TO aqsariasat;

--
-- Name: legal_pages; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.legal_pages (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "isPublished" boolean DEFAULT true NOT NULL,
    "lastUpdated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.legal_pages OWNER TO aqsariasat;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.payments (
    id text NOT NULL,
    "paymentId" text NOT NULL,
    "smeProfileId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'AED'::text NOT NULL,
    description text DEFAULT 'SME Certification Fee'::text NOT NULL,
    status public."PaymentStatus" DEFAULT 'not_requested'::public."PaymentStatus" NOT NULL,
    "stripePaymentIntentId" text,
    "stripeClientSecret" text,
    "stripeChargeId" text,
    "requestedById" text,
    "requestedAt" timestamp(3) without time zone,
    "paidAt" timestamp(3) without time zone,
    "failedAt" timestamp(3) without time zone,
    "failureReason" text,
    "invoiceNumber" text,
    "receiptUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payments OWNER TO aqsariasat;

--
-- Name: sme_profiles; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.sme_profiles (
    id text NOT NULL,
    "userId" text NOT NULL,
    "companyName" text,
    "tradeLicenseNumber" text,
    "companyDescription" text,
    "industrySector" public."IndustrySector",
    "foundingDate" timestamp(3) without time zone,
    "employeeCount" integer,
    "annualRevenue" numeric(15,2),
    website text,
    address text,
    documents jsonb,
    "certificationStatus" public."CertificationStatus" DEFAULT 'draft'::public."CertificationStatus" NOT NULL,
    "submittedDate" timestamp(3) without time zone,
    "reviewedById" text,
    "revisionNotes" text,
    "listingVisible" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "auditorName" text,
    "bankAccountNumber" text,
    "bankName" text,
    "boardMembers" jsonb,
    "businessModel" public."BusinessModel",
    "complianceOfficerEmail" text,
    "complianceOfficerName" text,
    "existingCertifications" jsonb,
    "fundingStage" public."FundingStage",
    "hasAmlPolicy" boolean DEFAULT false NOT NULL,
    "hasDataProtectionPolicy" boolean DEFAULT false NOT NULL,
    "headOfficeAddress" text,
    "headOfficeLatitude" numeric(10,8),
    "headOfficeLongitude" numeric(11,8),
    "lastAuditDate" timestamp(3) without time zone,
    "legalStructure" public."LegalStructure",
    "licenseExpiryDate" timestamp(3) without time zone,
    "linkedinUrl" text,
    "majorClients" jsonb,
    "officeType" public."OfficeType",
    "operatingCountries" jsonb,
    "ownerIdNumber" text,
    "ownerName" text,
    "ownerNationality" text,
    "profitMargin" numeric(5,2),
    "registrationCity" text,
    "registrationCountry" text,
    "registrationNumber" text,
    "regulatoryLicenses" jsonb,
    "secondaryContactEmail" text,
    "secondaryContactName" text,
    "secondaryContactPhone" text,
    "shareholderStructure" jsonb,
    "socialMedia" jsonb,
    "vatNumber" text,
    "internalDimensions" jsonb,
    "internalNotes" text,
    "internalReviewStartedAt" timestamp(3) without time zone,
    "lastInternalReviewAt" timestamp(3) without time zone
);


ALTER TABLE public.sme_profiles OWNER TO aqsariasat;

--
-- Name: support_messages; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.support_messages (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.support_messages OWNER TO aqsariasat;

--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.support_tickets (
    id text NOT NULL,
    "userId" text NOT NULL,
    subject text NOT NULL,
    status public."SupportTicketStatus" DEFAULT 'open'::public."SupportTicketStatus" NOT NULL,
    priority public."SupportTicketPriority" DEFAULT 'medium'::public."SupportTicketPriority" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "closedAt" timestamp(3) without time zone
);


ALTER TABLE public.support_tickets OWNER TO aqsariasat;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.user_profiles (
    id text NOT NULL,
    "userId" text NOT NULL,
    company text,
    "jobTitle" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "annualIncome" text,
    "authRepEmail" text,
    "authRepEmiratesId" text,
    "authRepName" text,
    "authRepPhone" text,
    "authRepPosition" text,
    "beneficialOwners" jsonb,
    city text,
    "companyAddress" text,
    "companyAnnualRevenue" text,
    "companyCity" text,
    "companyCountry" text,
    "companyEmployeeCount" integer,
    "companyName" text,
    "companyPoBox" text,
    "companyType" text,
    country text,
    "dateOfBirth" timestamp(3) without time zone,
    "emiratesId" text,
    "emiratesIdExpiry" timestamp(3) without time zone,
    "employerName" text,
    "employmentStatus" text,
    gender text,
    "investmentBudget" text,
    "investmentInterests" jsonb,
    "investorType" public."InvestorType",
    "kycDocuments" jsonb,
    "kycRejectionReason" text,
    "kycReviewedAt" timestamp(3) without time zone,
    "kycReviewedBy" text,
    "kycRevisionNotes" text,
    "kycStatus" public."KycStatus" DEFAULT 'not_submitted'::public."KycStatus" NOT NULL,
    "kycSubmittedAt" timestamp(3) without time zone,
    nationality text,
    occupation text,
    "passportCountry" text,
    "passportExpiry" timestamp(3) without time zone,
    "passportNumber" text,
    "poBox" text,
    "registrationAuthority" text,
    "registrationDate" timestamp(3) without time zone,
    "registrationNumber" text,
    "residencyStatus" text,
    "residentialAddress" text,
    "riskTolerance" text,
    "sourceOfFunds" text,
    "tradeLicenseExpiry" timestamp(3) without time zone,
    "tradeLicenseNumber" text
);


ALTER TABLE public.user_profiles OWNER TO aqsariasat;

--
-- Name: users; Type: TABLE; Schema: public; Owner: aqsariasat
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."UserRole" NOT NULL,
    "fullName" text NOT NULL,
    "phoneNumber" text,
    "isVerified" boolean DEFAULT false NOT NULL,
    "verificationToken" text,
    "resetPasswordToken" text,
    "resetPasswordExpires" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLogin" timestamp(3) without time zone,
    "profilePicture" text,
    "accountStatus" public."AccountStatus" DEFAULT 'active'::public."AccountStatus" NOT NULL,
    "suspendedAt" timestamp(3) without time zone,
    "suspendedBy" text,
    "suspendedReason" text
);


ALTER TABLE public.users OWNER TO aqsariasat;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a1e145aa-2661-42f0-bbf9-28b56be7df3b	4155536762de1a3303b6457aac9d1513cc1300327eaa07f967e7fa471f7f8418	2026-01-30 23:22:00.397637+08	20260130152200_init	\N	\N	2026-01-30 23:22:00.351614+08	1
32eba1e6-ac43-43a9-92ee-23fd8a9f5249	3f66b16690d3ad9aa6d7dab553dd46398b4be8db3ce2c6762f24829d57f18a52	2026-01-31 04:22:51.584763+08	20260130202251_add_sme_response_field	\N	\N	2026-01-31 04:22:51.579103+08	1
683d14c3-61d7-426c-8e57-c734a2e45809	da430607c1c441cd03fe9c6d0f5ab08de33a36d9648a8645423b6b7784eb8767	2026-01-31 04:28:09.702087+08	20260130202809_add_chat_messages	\N	\N	2026-01-31 04:28:09.679599+08	1
7e12e67a-b735-4518-b0cc-3f0108f4900f	76906e053a1a4ccc7b75ef46874e5ffea7afee7d4f0a2981c1c0cbadc24bc50d	2026-01-31 04:38:00.877826+08	20260130203800_add_message_edit_delete	\N	\N	2026-01-31 04:38:00.872697+08	1
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.audit_logs (id, "userId", "actionType", "actionDescription", "targetType", "targetId", "ipAddress", "timestamp", "previousValue", "newValue") FROM stdin;
278cedda-8838-4e8e-9fba-09a1953ed6a0	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	Admin logged in successfully	\N	\N	192.168.1.1	2026-01-30 15:24:47.067	\N	\N
ba97afdd-e6c6-48b0-af1d-32073febd77e	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_APPROVED	Approved certification for TechStart UAE	SMEProfile	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	192.168.1.1	2026-01-30 15:24:47.067	\N	\N
f8a5a236-e35a-4e85-9d17-79a63e9a89a2	9a29bfa2-6177-45a8-a308-61c1f34fb13b	PROFILE_UPDATED	Updated company profile information	SMEProfile	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	192.168.1.10	2026-01-30 15:24:47.067	\N	\N
b17dd7b0-fe17-46e9-adb6-913778d799dd	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-30 16:03:48.058	\N	\N
e0551a8e-1b94-4e30-8e08-01d68f5ccf16	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-30 16:04:06.892	\N	\N
8fe56899-c6e7-4bfe-a328-fe5fe959a522	86af4e7b-adaa-4e7d-b51f-806697d2e80e	USER_REGISTERED	New user account registered	\N	\N	::1	2026-01-30 16:53:51.693	\N	\N
442a252c-b514-4e3d-92f1-39b4c515caf9	e873e8bb-4435-4562-b595-59ba8898c092	USER_REGISTERED	New user account registered	\N	\N	::1	2026-01-30 16:54:23.391	\N	\N
afb52038-f883-42e3-9156-df10024b58a8	a1025933-1b48-4623-91db-0ff13a091b7c	USER_REGISTERED	New user account registered	\N	\N	::1	2026-01-30 17:04:32.695	\N	\N
fd6045ff-f4c7-4bac-89ef-1e3f0874560a	258cb6d6-85be-4e4f-9830-107bac843987	USER_REGISTERED	New user account registered	\N	\N	::1	2026-01-30 17:05:25.93	\N	\N
d4613d91-018e-4e5c-9314-b0d399fcab58	258cb6d6-85be-4e4f-9830-107bac843987	EMAIL_VERIFIED	Email address verified successfully	\N	\N	::1	2026-01-30 17:05:47.643	\N	\N
9128be03-82d3-4b8a-90d9-a422e9e2086e	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-30 17:06:15.452	\N	\N
dfc304ce-369f-4b56-8a5c-61a2003f2423	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-30 17:16:46.221	\N	\N
ebdafa5a-5854-4f5e-bd67-0bf1e239979c	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-30 18:23:56.093	\N	\N
d8528ab5-4d73-4e2e-a363-9743309d1a6b	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-30 18:25:30.817	\N	\N
fa8b3488-e1f1-4898-83bc-9479e559a847	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_REGISTERED	New sme account registered	\N	\N	::1	2026-01-30 18:41:19.558	\N	\N
d6e2c3f1-5796-4536-b143-30e00e0b5c3b	eb13f924-6e62-47a6-a3c2-7708e677861c	EMAIL_VERIFIED	Email address verified successfully	\N	\N	::1	2026-01-30 18:41:38.056	\N	\N
1342e775-30b2-48c4-b922-b0d368053f51	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-30 18:42:03.997	\N	\N
f1867419-05f1-406f-97f0-19ab11ed4dc8	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 19:54:44.061	\N	\N
7e5cbd41-0470-42a7-93b8-0d9df5e19d06	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 19:55:08.309	\N	\N
cb9d05ef-2351-44c6-9589-3522fdcd13cd	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 19:55:22.306	\N	\N
9eb458f5-4e3c-4dc2-a771-368227a77b58	eb13f924-6e62-47a6-a3c2-7708e677861c	DOCUMENT_UPLOADED	Document uploaded: Trade License	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 19:55:32.403	\N	\N
3f157770-9abf-4a31-adb5-805bd2eb2439	eb13f924-6e62-47a6-a3c2-7708e677861c	DOCUMENT_UPLOADED	Document uploaded: Certificate of Incorporation	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 19:55:55.804	\N	\N
49b4369b-0c3e-41f0-bb5c-c5d5b4f1dc7f	eb13f924-6e62-47a6-a3c2-7708e677861c	DOCUMENT_UPLOADED	Document uploaded: Financial Statements (Last 2 years)	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 19:56:39.968	\N	\N
71f117b3-aa58-4560-9b77-76824a762572	eb13f924-6e62-47a6-a3c2-7708e677861c	DOCUMENT_UPLOADED	Document uploaded: Company Profile / Brochure	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 19:56:52.295	\N	\N
5f266352-3e77-4d8f-a84d-4b6488ca508c	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 20:04:51.821	\N	\N
04af056b-eee6-4a54-8f1a-a9411cbea597	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 20:05:01.494	\N	\N
cdd9b34b-70ec-4cf9-a4b7-d71129b05d7e	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 20:05:05.066	\N	\N
d03a30af-5b4c-446b-8864-789fe7bbabe7	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATION_SUBMITTED	Certification application submitted for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 20:05:08.346	\N	\N
a1433bf9-87d4-472c-b6e4-f9136b53acc9	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 20:05:59.339	\N	{"status":"under_review"}
dfd6ae3a-eb84-40ee-aa75-330ad40d1dc7	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_APPROVE	Approved certification for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-30 20:06:07.546	\N	{"status":"certified"}
a37ffcd2-1e36-4a4c-81c8-3889038c5bfc	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-30 20:07:02.742	\N	\N
bfade303-0e14-455b-8eca-cf495dd3f489	258cb6d6-85be-4e4f-9830-107bac843987	INTRODUCTION_REQUESTED	Requested introduction to tjara	IntroductionRequest	133e1536-b3d6-486d-a049-70a1f15847e4	::1	2026-01-30 20:07:32.111	\N	\N
1664888c-fcf2-4f4a-bdfa-90860865b050	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-30 20:16:34.522	\N	\N
0986b6de-c13c-4dc1-b022-128c9e84d668	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-30 20:16:43.767	\N	\N
0a7f0d69-dd01-488a-94e8-5f1325b49cd1	eb13f924-6e62-47a6-a3c2-7708e677861c	INTRODUCTION_RESPONDED	tjara responded to introduction request from aqsa aqsa	IntroductionRequest	133e1536-b3d6-486d-a049-70a1f15847e4	::1	2026-01-30 20:26:35.881	\N	\N
4fa5dd03-bd13-4309-8f57-34ba671bf7f3	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-30 20:36:09.07	\N	\N
5676a8b6-d7c7-40f6-970f-2982ccd0881f	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-30 20:36:19.383	\N	\N
ffc3661d-655d-4128-b495-b83a457e08cf	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-30 20:41:41.62	\N	\N
09a23af3-a442-4748-9135-4ef71e636650	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-30 20:41:53.259	\N	\N
3d105c1c-2a51-4124-a897-f4a08e266aff	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 07:36:53.851	\N	\N
86429da5-65de-4471-8573-6680945cbb4d	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 07:40:02.81	\N	\N
6a5af88f-9d31-4fb7-aac2-77c457fa22a0	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 07:57:24.137	\N	\N
c6fae955-db1b-4710-9a12-0db2fc121ef9	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 07:57:28.357	\N	\N
bd9a110e-572f-4f57-a23f-8e6396e6fe5e	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 07:57:39.336	\N	\N
8dc83f96-2319-40bb-baff-ec2565dc9499	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:09:13.131	\N	\N
d86da081-eaa9-4bab-b80e-adab34264867	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:22:51.017	\N	\N
4493f662-139f-44a9-9625-de4ee8365b34	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:23:29.77	\N	\N
06dd4011-163f-44c1-999a-57542929e53f	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:25:12.984	\N	\N
1191fb62-4a35-42c1-9727-ae96f6c8ae61	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:25:46.699	\N	\N
fc3da446-766e-4dec-bd20-606f34cdfa0a	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 08:30:28.477	\N	\N
5c204f29-450c-45fa-a62a-36be63e2a516	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 08:31:29.192	\N	\N
89fe015d-90e0-4acb-9439-9537a2ff31f1	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 08:31:37.143	\N	\N
2bfde5fb-54fb-4d38-a9eb-fb673a0f1b55	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 08:32:16.249	\N	\N
fccc48bc-5718-4b24-8877-294268092f2a	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 08:32:24.864	\N	\N
4d41c138-6981-4074-8744-c0fc86852e86	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 08:32:46.177	\N	\N
18bfc73e-46d6-4486-a0f7-d968ea5d6859	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 08:32:56.543	\N	\N
a2eab301-9d23-4601-935c-ca75a524e302	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_PICTURE_UPDATED	Updated profile picture	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:33:08.409	\N	\N
eaf75268-c6a9-4cea-a1ef-f9fa57be07a0	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:33:13.124	\N	\N
83de91d6-e391-4c71-a2d2-49b688dfbf0e	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_PICTURE_UPDATED	Updated profile picture	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:33:28.261	\N	\N
ce23a2b0-c581-4ddc-ad8e-ae58d82a582f	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:33:41.656	\N	\N
994c8652-9697-4762-9429-0ca6d18c3602	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:33:53.826	\N	\N
ee5d9aa0-ea14-492f-9579-9f96ba1e970e	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_PICTURE_UPDATED	Updated profile picture	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:37:36.959	\N	\N
637baffb-000c-458c-8788-2a9eb5962431	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 08:37:47.432	\N	\N
ab78fe3d-4b71-499f-b708-86b7d58181d8	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 10:48:32.181	\N	\N
ecc86a1c-4e5d-475d-bd92-6a082354656f	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 10:51:43.548	\N	\N
e5bfbd10-4a38-4e1f-a2e3-3c4be4190559	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 10:52:51.205	\N	\N
63555373-5c15-4c4c-8218-f5835e0fe437	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 10:53:03.008	\N	\N
65032f0a-92a8-4c85-8371-cef026cb7e2b	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 10:53:16.785	\N	\N
731c7462-00ff-4627-b567-26d9846ad7b6	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 11:21:55.738	\N	\N
5c19eb1e-74f5-452a-a75d-9c47397a7ba6	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 11:25:22.449	\N	\N
1a17a8a7-a320-485a-bc1c-8a83f24d0c7a	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 11:28:09.286	\N	\N
dee3f469-670d-4c41-83e4-76e4e45d3ad4	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 11:37:44.116	\N	\N
c3ade2e0-83de-4719-a1c0-ad1b209b74de	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 11:46:53.871	\N	\N
97e60f1a-6533-4f65-9ec8-ba624f0e1337	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 11:50:54.958	\N	\N
4b01cccc-06a6-4e91-ab85-115b91643a96	258cb6d6-85be-4e4f-9830-107bac843987	INTRODUCTION_REQUESTED	Requested introduction to HealthPlus Medical Center	IntroductionRequest	05c5763c-32e2-434a-b62d-d1650c031ee7	::1	2026-01-31 11:59:47.722	\N	\N
d66bfff5-927c-4ed0-8305-957cef10dbed	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 12:00:17.792	\N	\N
148f0253-1294-4199-85d9-260e1287b0f7	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:05:33.764	\N	\N
ed279798-d347-4a92-881b-5c28421af362	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:20:10.819	\N	\N
df847c40-e802-42f3-bcd7-74b88e47ccde	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_PICTURE_UPDATED	Updated profile picture	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:24:16.967	\N	\N
1c618037-98bb-455c-bc2d-04a607dd67e3	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:24:21.252	\N	\N
e4735939-3f14-4e9b-aa28-525b37eeb0f9	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:24:32.275	\N	\N
19b81ddd-8a3d-4159-869e-2056da69b2c8	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_PICTURE_UPDATED	Updated profile picture	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:28:16.398	\N	\N
2109f4a5-b229-4172-a9ad-7a000dc271ad	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:28:18.388	\N	\N
8665aa91-234c-4e15-a7d8-68cd52d07697	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_PICTURE_UPDATED	Updated profile picture	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:28:57.222	\N	\N
1d0d0634-08a5-4113-9019-dc64abfbc8b1	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:29:04.106	\N	\N
ef6851ac-e54b-49e9-bc97-958c35a8cfbc	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:57:35.46	\N	\N
2aa7a98b-3f49-47e7-bc5c-a36e6ea9faef	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:30:29.956	\N	\N
0ce9193c-c960-4467-a477-9adc95f81c08	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:32:12.316	\N	\N
5501fbf3-d786-45eb-83b0-0cca4b54c7f7	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:32:20.58	\N	\N
d124ab3a-838e-422a-983a-4c4dea3e1e64	258cb6d6-85be-4e4f-9830-107bac843987	PASSWORD_CHANGED	Changed account password	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 12:33:41.63	\N	\N
cebe3439-0baf-40de-a0f3-fce5cb1dc0b4	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_PICTURE_UPDATED	Updated profile picture	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 15:10:50.267	\N	\N
71d80452-d9b0-4fc1-b74c-d5fdacfbb0c5	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_PICTURE_UPDATED	Updated profile picture	User	258cb6d6-85be-4e4f-9830-107bac843987	::1	2026-01-31 15:11:08.932	\N	\N
535be87b-c202-4dae-aee7-ce0e3e13c138	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 15:29:47.102	\N	\N
6736a21c-bdc0-4fad-89b2-e28f8a6034c7	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 15:45:51.689	\N	\N
68807fc8-e59a-4d05-9145-caee2ae15531	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATE_REQUEST	tjara requested profile update: i want to update logio	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:36:26.24	\N	{"reason":"i want to update logio","companyName":"tjara","userEmail":"email@theredstone.ai","currentStatus":"certified"}
6dac3df7-23c1-441d-a12d-0d2fb4e85341	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:36:53.593	\N	\N
2503c077-a90b-4cfe-bce0-9409e9a48377	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:37:07.122	\N	\N
86e435c5-96b3-4aaf-8945-2b6ba931f331	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_REJECT	Rejected certification for RetailHub Trading	SMEProfile	f68a5830-0b06-49b3-b08f-0ebb2f219350	::1	2026-01-31 16:37:56.446	\N	{"status":"rejected","notes":"nothing"}
c8206e5b-2eaa-4c00-b8f1-dad3b8f9a7a4	674d623b-c2d4-4648-8115-5d0b1d164865	PROFILE_UPDATE_APPROVED	Approved profile update request for tjara. SME can now edit their profile.	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:42:20.861	{"status":"certified"}	{"status":"revision_requested"}
8dd19b04-60b2-4bae-a85d-90ca26c363bb	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:44:17.045	\N	\N
fe7c9986-8035-4be8-9f89-62dbfe5ff666	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:44:24.04	\N	\N
a001f901-21b1-49bf-9775-0ab4c1b82093	eb13f924-6e62-47a6-a3c2-7708e677861c	LOGO_UPLOADED	Company logo uploaded for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:44:45.77	\N	\N
17ebd48e-bac9-42d9-9630-d511303b397a	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATION_SUBMITTED	Certification application submitted for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:44:50.549	\N	\N
8f041b50-84dd-4c66-a2bf-abfaaca3ea2e	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:45:06.412	\N	\N
52823ae6-d59e-4396-8588-ec541517fb85	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:45:38.241	\N	\N
aefd1899-7827-4a31-b0f3-6e34fc23f96e	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:45:47.204	\N	{"status":"under_review"}
60f5cd98-6b75-4e62-9f09-ca1ed3c6cd98	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_APPROVE	Approved certification for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:45:51.87	\N	{"status":"certified"}
4a57a1ed-4257-492a-87a5-f1c9b02197f2	674d623b-c2d4-4648-8115-5d0b1d164865	PROFILE_UPDATE_APPROVED	Approved profile update request for tjara. SME can now edit their profile.	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:46:10.113	{"status":"certified"}	{"status":"revision_requested"}
4a442c1e-70d9-4f35-bb46-0452a6a6a0b4	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:46:19.727	\N	\N
3612991d-59b1-4cad-9af8-753507bb1d98	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:46:29.605	\N	\N
a1463c0b-e715-4f2a-8187-3cfdabf52512	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATION_SUBMITTED	Certification application submitted for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:46:41.783	\N	\N
12e69dc5-5a39-4969-8151-337e9fa971c0	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:46:54.518	\N	\N
4012b60e-61fd-42cf-a972-604806954d73	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:47:14.431	\N	\N
ad44b43a-583f-4d7e-b2e9-dc396067299d	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:47:20.583	\N	{"status":"under_review"}
19d22da1-8bf7-41c4-b63f-fd6fdbd2106e	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_APPROVE	Approved certification for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:47:23.392	\N	{"status":"certified"}
f91bc623-ba10-4644-a9d8-24a31fb013e4	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:48:44.119	\N	\N
183b1bf4-fd3c-467a-8217-98817d4c4367	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:48:51.301	\N	\N
b5bb620b-7256-4515-bf15-a099d1673638	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATE_REQUEST	tjara requested profile update: adress	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:55:34.252	\N	{"reason":"adress","companyName":"tjara","userEmail":"email@theredstone.ai","currentStatus":"certified"}
ed4179ba-b4ce-46b3-b886-82f516d94a3a	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:56:02.305	\N	\N
b11ba203-cbbb-4617-b90f-66813fd48a25	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:56:20.678	\N	\N
128f0314-72e6-42b0-a7e7-bf6416ec25b4	674d623b-c2d4-4648-8115-5d0b1d164865	PROFILE_UPDATE_APPROVED	Approved profile update request for tjara. SME can now edit their profile.	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:56:23.114	{"status":"certified"}	{"status":"revision_requested"}
21c8ab71-7b30-4d75-8d4e-45ce6d6cdc8e	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:57:04.004	\N	\N
e498405d-94c4-4cf5-9c29-f93282fcf0df	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:57:14.295	\N	\N
5879bfeb-fc03-4dd9-ae8b-5b9ff47016d0	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATION_SUBMITTED	Certification application submitted for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:57:28.169	\N	\N
187d5165-ec23-4acb-a3ef-2c8b655a394d	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:57:51.974	\N	\N
1506ec2b-9cb3-4fdf-ba7f-e80c1180b1e1	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:57:56.469	\N	{"status":"under_review"}
546c90df-18fa-4824-bee9-adbd69d20df1	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_APPROVE	Approved certification for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:57:59.014	\N	{"status":"certified"}
1a90e39a-514f-46f2-b0ca-a3651a7744a4	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:58:04.813	\N	\N
613d1299-bfdf-4767-bd7b-6d1eaeaff907	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:58:13.33	\N	\N
2d73bc49-ef4a-48f8-a925-3be6b1be29d7	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 16:58:28.403	\N	\N
d1df497e-46d1-4023-b017-042edf5d9228	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 16:58:44.839	\N	\N
a7b6be3d-dc2e-48af-8326-7aeeb7196457	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATE_REQUEST	tjara requested profile update: logo	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 16:58:20.83	\N	{"reason":"logo","companyName":"tjara","userEmail":"email@theredstone.ai","currentStatus":"certified"}
f8b6adb3-b113-4c55-b753-cc1bae25df5a	674d623b-c2d4-4648-8115-5d0b1d164865	PROFILE_UPDATE_REJECTED	Rejected profile update request for tjara: dont need logo	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:06:06.742	\N	{"reason":"dont need logo"}
d5c55846-b48e-4a00-9c56-97511e7386c7	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 17:06:13.314	\N	\N
eb2aabfa-26ca-494c-838d-cc14a137b6fb	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 17:06:23.496	\N	\N
9e537e2c-f297-4daa-95e2-a1ee055bf6b3	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATE_REQUEST	tjara requested profile update: i want to update my adress	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:06:52.25	\N	{"reason":"i want to update my adress","companyName":"tjara","userEmail":"email@theredstone.ai","currentStatus":"certified"}
6233071b-fd92-441f-88f7-cd05c858f13b	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 17:07:04.377	\N	\N
683ffb13-c0e4-4fa3-a60b-35b72696e922	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 17:07:13.493	\N	\N
81c82555-431e-4265-8e0b-a6475dc261bc	674d623b-c2d4-4648-8115-5d0b1d164865	PROFILE_UPDATE_REJECTED	Rejected profile update request for tjara: no need	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:07:22.375	\N	{"reason":"no need"}
154786e5-95e7-4e5a-b830-77b9bb4371b2	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-01-31 17:07:27.015	\N	\N
06051a38-5cb8-43dc-ad8f-f0cdfa719560	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 17:07:34.506	\N	\N
baa9e5d6-d174-408a-b83c-4318aca65a1a	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-01-31 17:22:53.806	\N	\N
a0565d8f-3893-4228-996f-a345a724efd3	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATE_REQUEST	tjara requested profile update: i want to update my adress	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:23:12.423	\N	{"reason":"i want to update my adress","companyName":"tjara","userEmail":"email@theredstone.ai","currentStatus":"certified"}
b6ac1907-d161-4e03-b5ce-acb34d2edb76	674d623b-c2d4-4648-8115-5d0b1d164865	PROFILE_UPDATE_REJECTED	Rejected profile update request for tjara: no need	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:24:35.673	\N	{"reason":"no need"}
56a794db-c20d-4e04-8554-ae4b7fb8a364	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:54:33.916	\N	\N
af6ee914-7327-443b-a319-fa98908404a6	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:55:02.773	\N	\N
8ad81d86-a30e-4150-ac0a-e36e0bc593de	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:55:39.11	\N	\N
ccb8c526-2d14-4297-b30f-ca7d72ed76e1	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:56:03.113	\N	\N
66aa88b5-8f95-47f9-aef1-b3de9226ba66	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:56:32.157	\N	\N
9a8bc2b6-8cdc-4ceb-9949-fdce02b9bddb	eb13f924-6e62-47a6-a3c2-7708e677861c	PROFILE_UPDATED	SME profile updated	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:56:52.014	\N	\N
410bb9b6-adf2-4d87-aa13-29a3d340b4e4	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATION_SUBMITTED	Certification application submitted for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:57:01.459	\N	\N
f8388c60-ec27-4027-b53b-bc0ed831137e	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 17:58:22.211	\N	{"status":"under_review"}
f24d999a-c56b-48e0-b70b-fa379fba7112	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_APPROVE	Approved certification for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-01-31 18:18:36.198	\N	{"status":"certified"}
316c19fd-f611-4166-b9f6-214c5fae29fa	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-02-01 10:23:28.076	\N	\N
4f6bef6c-7376-413c-b199-8de6db9cc283	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-01 10:23:45.946	\N	\N
5b19dcdf-bdc1-4a0f-9814-aa49429a7bf9	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-02-01 10:29:10.798	\N	\N
28f3f182-ee61-4e7b-aad4-68cca530ba7b	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-01 10:29:24.983	\N	\N
ac65811c-0741-4456-affb-84d4a38424f3	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-01 15:58:18.801	\N	\N
d03f03f4-d1bb-4e3e-930b-547ac46431e2	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-02-01 16:36:38.879	\N	\N
9e3ef92e-1a1a-433e-96a3-2c45fe73b4a3	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-02 19:10:05.268	\N	\N
88c8b422-5964-4078-b2ec-311a02476ea4	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-02-02 19:10:56.491	\N	\N
41b5d581-ebca-434e-8ab1-1d247eb0bb37	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	::1	2026-02-02 19:10:58.79	\N	\N
e62a8d0f-1f98-4823-9bf3-18ded0b6a060	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for HealthPlus Medical Center	SMEProfile	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	::1	2026-02-02 19:11:01.139	\N	\N
84f4f345-8e73-4328-97d4-2740be863950	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for HealthPlus Medical Center	SMEProfile	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	::1	2026-02-02 19:11:01.961	\N	\N
fd67f2ca-cc32-42f7-8d5b-56ea93888558	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for TechStart UAE	SMEProfile	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	::1	2026-02-02 19:11:02.816	\N	\N
476b1036-c0b0-4fde-8024-a930ff731612	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for TechStart UAE	SMEProfile	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	::1	2026-02-02 19:11:03.4	\N	\N
2353675f-cdde-4c6d-8ae2-8f4dc33e72b6	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-04 16:46:05.21	\N	\N
8f652a2f-ceda-474b-a07d-ff59aebec43b	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	::1	2026-02-04 17:18:29.69	\N	\N
b35f9417-57ab-437b-86fb-74064fdc2c9c	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-04 17:34:40.82	\N	\N
e12dcc28-4732-44ed-9252-6095814a5b35	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	::1	2026-02-04 18:17:16.517	\N	\N
e65797d4-6e8d-47df-907f-993515ac827f	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-04 18:17:31.385	\N	\N
afebe893-c9a3-4c35-aacb-02ae71ebd7b1	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-02-04 18:20:06.781	\N	\N
316da3f0-9a36-42b1-a1a5-47440bc4e05d	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-04 18:20:25.628	\N	\N
a302cc30-09ac-421b-8b9b-9e943d98e1db	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-02-04 18:42:32.014	\N	\N
f17defea-a9de-4720-90e0-c845a3116ef9	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-04 18:43:08.549	\N	\N
45afffa2-b96d-41ab-9a03-bca436fdfada	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	::1	2026-02-04 19:25:33.826	\N	\N
0c0b0527-06c6-4c9e-9e23-02becc24a8a5	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-06 20:37:58.474	\N	{"role":"sme"}
6b28e28b-6dea-45ed-b7af-3a5b908d5e50	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	::1	2026-02-06 20:38:01.144	\N	\N
401e1b6d-2bf9-4a35-9390-c164266f66da	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-06 20:48:39.146	\N	{"role":"admin"}
\.


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.certificates (id, "certificateId", "certificateVersion", "smeProfileId", "companyName", "tradeLicenseNumber", "industrySector", "issuedAt", "expiresAt", status, "revokedAt", "revocationReason", "verificationUrl", "verificationHash", "issuedById", "lastReissuedAt", "createdAt", "updatedAt") FROM stdin;
5a913ce7-06db-409d-a2ab-01dcb4443781	SME-CERT-5F0A3047	v1.0	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	HealthPlus Medical Center	TL-2024-005678	healthcare	2024-02-05 00:00:00	2025-02-05 00:00:00	active	\N	\N	http://localhost:3001/certificate/SME-CERT-5F0A3047	f9479215b89ebffaacd78e41cc1b4c9aa8095e13cdb10bbe06cdf285b08c4873	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:20:56.749	2026-02-05 19:20:56.749
448c92e3-57ab-441e-95c3-075bc3723c03	SME-CERT-103C8133	v1.0	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	TechStart UAE	TL-2024-001234	technology	2024-01-20 00:00:00	2025-01-20 00:00:00	active	\N	\N	http://localhost:3001/certificate/SME-CERT-103C8133	980f0e17ee936130ff8c1ed423dfdbcfa241dba59a0841dce700645295d434fa	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:20:56.775	2026-02-05 19:20:56.775
1757f257-af60-410c-b167-c2bccc34abc2	SME-CERT-A33A870A	v1.0	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	tjara	9876	finance	2026-01-31 17:57:01.451	2027-01-31 17:57:01.451	active	\N	\N	http://localhost:3001/certificate/SME-CERT-A33A870A	4d16f5498f5191351cdd9218bd165cd2c8fec99df6067a52efb11fdaac4cd81a	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:20:56.779	2026-02-05 19:20:56.779
\.


--
-- Data for Name: chat_attachments; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.chat_attachments (id, "messageId", "fileName", "originalName", "filePath", "fileSize", "mimeType", "createdAt") FROM stdin;
37b0ae65-1eb4-4450-b023-b2de4036cb8c	f76120fb-79d0-4af9-9d89-bd8883b7cd87	1769805322212-575804526.pdf	5G JOBS.pdf	/uploads/chat/133e1536-b3d6-486d-a049-70a1f15847e4/1769805322212-575804526.pdf	101099	application/pdf	2026-01-30 20:35:22.218
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.chat_messages (id, "introductionRequestId", "senderId", content, "createdAt", "isRead", "deletedForUsers", "editedAt", "isDeletedForEveryone", "isEdited") FROM stdin;
cce01036-ee9b-4bf4-b280-82050d38daa7	133e1536-b3d6-486d-a049-70a1f15847e4	eb13f924-6e62-47a6-a3c2-7708e677861c	hello	2026-01-30 20:35:14.455	t	[]	\N	f	f
f76120fb-79d0-4af9-9d89-bd8883b7cd87	133e1536-b3d6-486d-a049-70a1f15847e4	eb13f924-6e62-47a6-a3c2-7708e677861c		2026-01-30 20:35:22.218	t	[]	\N	f	f
87f28aeb-e194-4259-81e5-aa2c0e570535	133e1536-b3d6-486d-a049-70a1f15847e4	eb13f924-6e62-47a6-a3c2-7708e677861c	hlo	2026-01-31 07:40:43.435	t	[]	\N	f	f
4f513ee7-d4b5-4333-bad3-b107fe46e04f	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	hi hlo	2026-01-31 11:28:50.566	t	[]	2026-01-31 11:57:35.232	t	t
fa8efb23-d646-43ed-9c9d-78ed456e2d8b	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	hlo	2026-01-31 11:57:43.895	t	["258cb6d6-85be-4e4f-9830-107bac843987"]	\N	f	f
d6200595-1997-46bb-8843-358c12d216ba	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	hlo	2026-01-31 11:57:50.092	t	[]	\N	f	f
27a2d7a5-be43-4264-b002-979aec59ab1e	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	hlo	2026-01-31 12:34:57.834	t	[]	\N	f	f
02ae19f2-d014-4719-ab9c-deca822dc25e	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	hlo	2026-01-31 18:13:30.796	t	[]	\N	f	f
e15de480-025d-41a4-91b2-44772b813ea9	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	hlo	2026-01-31 18:13:45.024	t	[]	\N	f	f
8e919c3b-6c59-441e-88f7-907673271c27	133e1536-b3d6-486d-a049-70a1f15847e4	eb13f924-6e62-47a6-a3c2-7708e677861c	hlo	2026-01-31 18:21:19.631	t	[]	\N	f	f
d5ebac3d-c80a-4aa8-a253-f6a902faa06f	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	hlo	2026-02-01 14:17:36.509	f	[]	\N	f	f
\.


--
-- Data for Name: document_versions; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.document_versions (id, "smeProfileId", "documentType", "originalName", "fileName", "filePath", "fileSize", "mimeType", version, status, "adminFeedback", "reviewedById", "reviewedAt", "uploadedAt", "replacedAt", "isLatest") FROM stdin;
\.


--
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.email_logs (id, "recipientEmail", "recipientName", "entityType", "entityId", "eventType", subject, "templateId", status, "errorMessage", metadata, "sentAt") FROM stdin;
\.


--
-- Data for Name: introduction_requests; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.introduction_requests (id, "requesterId", "smeProfileId", message, "contactPreferences", status, "requestedDate", "updatedAt", "respondedAt", "smeResponse") FROM stdin;
233e182d-f01a-48e9-ad0d-66cbb5ba08b5	17f046a0-8c7f-45e7-84b2-5941c5189375	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	We are interested in exploring potential technology partnerships for our digital transformation initiatives. Would love to schedule a meeting to discuss collaboration opportunities.	Email preferred, available Mon-Thu	pending	2026-01-30 15:24:46.994	2026-01-30 15:24:46.994	\N	\N
b9ef8a4b-51a4-4284-b6c6-7a4cbc0bfe27	3bd38396-3d04-4b86-812c-4958e6cff136	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	Our investment fund is evaluating healthcare sector opportunities. Would appreciate an introduction to discuss your growth plans.	Phone call or video meeting	viewed	2026-01-30 15:24:47.002	2026-01-30 15:24:47.002	\N	\N
133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	i want to know about your company	\N	responded	2026-01-30 20:07:32.104	2026-01-30 20:26:35.874	2026-01-30 20:26:35.873	hlo
\.


--
-- Data for Name: legal_pages; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.legal_pages (id, slug, title, content, "isPublished", "lastUpdated", "updatedBy", "createdAt", "updatedAt") FROM stdin;
8d871192-c815-41f5-83ef-f143d04941e3	terms	Terms of Service	**Effective Date:** [Insert Date]\n**Version:** 1.0\n\n## 1. Introduction\nThese Terms of Service ("Terms") govern access to and use of Naywa (the "Platform"), an SME readiness, certification, and registry service. By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, you must not use the Platform.\n\n## 2. Nature of the Platform\n**Naywa provides:**\n- SME readiness assessment\n- Certification based on submitted documentation\n- Inclusion in a read-only SME registry\n\n**Naywa does not:**\n- Facilitate fundraising or investment\n- Act as a marketplace or broker\n- Provide financial, legal, or investment advice\n- Guarantee funding, partnerships, or commercial outcomes\n\nCertification reflects a review at a point in time based on provided information only.\n\n## 3. Eligibility & Accounts\nYou represent that:\n- Information submitted is accurate and complete\n- You are authorized to act on behalf of the SME\n- You will keep credentials secure\n\nNaywa may suspend or terminate access if information is misleading, incomplete, or violates these Terms.\n\n## 4. Certification Process\n- Certification decisions are based on documentation submitted and internal review\n- Naywa reserves the right to approve, reject, revoke, or suspend certification\n- Certification may have an expiry date and require renewal\n- Any material change to SME information may invalidate certification and require re-review\n\n## 5. Registry\n- The registry is read-only for users and partners\n- Inclusion does not imply endorsement, investment worthiness, or performance ranking\n- Naywa controls visibility and may remove or suspend listings at its discretion\n\n## 6. Certificates\n- Certificates are issued digitally and may be downloaded as PDFs\n- Certificates include identifiers, issue date, and expiry date\n- Certificates are non-transferable and for verification purposes only\n- Misuse or misrepresentation of a certificate may result in revocation\n\n## 7. Data & Privacy\nUse of the Platform is subject to the Privacy Policy. Naywa processes data solely for certification, registry, compliance, and operational purposes.\n\n## 8. Limitation of Liability\nTo the fullest extent permitted by law:\n- Naywa is not liable for business outcomes, losses, or missed opportunities\n- Naywa does not warrant uninterrupted or error-free operation\n- Use of the Platform is at your own risk\n\n## 9. Modifications\nNaywa may update these Terms periodically. Continued use constitutes acceptance of revised Terms.\n\n## 10. Governing Law\nThese Terms are governed by the laws of the United Arab Emirates, unless otherwise stated.\n\n## 11. Contact\nFor certification or platform inquiries only: support@naywa.ae	t	2026-02-05 14:20:59.935	\N	2026-02-05 14:20:59.965	2026-02-05 14:20:59.965
3153ae66-7756-4e5b-ab4a-df0cd6b5211c	privacy	Privacy Policy	**Platform:** Naywa\n**Version:** 1.0\n**Effective Date:** [Insert Date]\n\n## 1. Introduction\nThis Privacy Policy explains how Naywa ("we", "us", "our") collects, uses, stores, and protects personal and business information when you access or use the Naywa platform (the "Platform").\n\nBy using the Platform, you acknowledge and agree to the practices described in this Privacy Policy.\n\n## 2. Scope of This Policy\nThis Policy applies to:\n- SME users submitting information for certification\n- Authorized representatives of SMEs\n- Partners or users accessing the SME registry\n- Administrators operating the Platform\n\nThis Policy does not apply to third-party websites or services that may be linked from the Platform.\n\n## 3. Information We Collect\n\n### 3.1 Information You Provide\nWe may collect the following categories of information:\n\n**SME & Business Information**\n- Company name, trade license number, registration details\n- Industry sector, location, and operational information\n- Supporting documents submitted for certification\n\n**User & Representative Information**\n- Name, email address, and contact details\n- Role or authorization to act on behalf of an SME\n- Identity verification information (where required for compliance)\n\n### 3.2 System & Usage Information\nWe may automatically collect limited technical information such as:\n- Login timestamps\n- IP addresses\n- Device or browser metadata\n- Actions performed on the Platform (for audit purposes)\n\nThis information is collected solely for security, compliance, and operational integrity.\n\n## 4. Purpose of Data Collection\nWe collect and process information only for the following purposes:\n- Operating the SME certification and review process\n- Verifying identity and authorization\n- Maintaining the SME registry\n- Ensuring platform security and auditability\n- Complying with legal, regulatory, or internal governance requirements\n\nNaywa does not use personal data for:\n- Advertising\n- Profiling\n- Marketing campaigns\n- Behavioral or popularity analysis\n\n## 5. Registry Visibility\nCertain non-personal SME information may appear in the public or partner-accessible registry once certification is granted.\n\nInclusion in the registry:\n- Does not imply endorsement\n- Does not rank or compare SMEs\n- Is subject to visibility controls and removal at Naywa's discretion\n\n## 6. Data Sharing\nNaywa does not sell, rent, or trade personal data.\n\nInformation may be shared only:\n- With internal administrators for certification and compliance\n- When required by applicable law or regulatory authority\n- With trusted service providers strictly for platform operation (under confidentiality obligations)\n\n## 7. Data Storage & Security\nWe apply reasonable administrative, technical, and organizational safeguards to protect data, including:\n- Access controls\n- Role-based permissions\n- Audit logging of sensitive actions\n\nDespite these measures, no system can be guaranteed to be fully secure.\n\n## 8. Data Retention\nInformation is retained only for as long as necessary to:\n- Operate the certification and registry process\n- Meet legal or regulatory requirements\n- Maintain audit and compliance records\n\nRetention periods may vary depending on data type and obligations.\n\n## 9. Your Responsibilities\nUsers are responsible for:\n- Providing accurate and up-to-date information\n- Maintaining the confidentiality of login credentials\n- Not submitting data they are not authorized to share\n\nMisuse or misrepresentation may result in access suspension.\n\n## 10. Your Rights\nSubject to applicable law, you may request:\n- Access to your information\n- Correction of inaccurate information\n\nRequests may be limited where data must be retained for compliance or audit purposes.\n\n## 11. Changes to This Policy\nWe may update this Privacy Policy from time to time. Updated versions will be posted on the Platform with a revised effective date.\n\nContinued use of the Platform constitutes acceptance of the updated Policy.\n\n## 12. Contact\nFor privacy or data-related inquiries only: support@naywa.ae	t	2026-02-05 14:20:59.977	\N	2026-02-05 14:20:59.978	2026-02-05 14:20:59.978
83cdc224-2ff0-467a-afec-02e61dfa1ebc	legal-notice	Legal Notice	**Platform:** Naywa\n**Version:** 1.0\n**Effective Date:** [Insert Date]\n\n## 1. Platform Status\nNaywa is a digital platform providing SME readiness assessment, certification, and registry services.\n\n**Naywa is not:**\n- A government authority\n- A financial institution\n- An investment platform\n- A marketplace or broker\n\nAny reference to "certification" relates solely to Naywa's internal review process and does not represent a government license, approval, or endorsement.\n\n## 2. No Financial or Investment Services\nNaywa does not:\n- Facilitate fundraising or capital raising\n- Collect or transfer funds\n- Match investors and businesses\n- Provide financial, legal, or investment advice\n\nUsers must make independent decisions and conduct their own due diligence.\n\n## 3. No Guarantee of Outcomes\nCertification or inclusion in the registry:\n- Does not guarantee funding, partnerships, or commercial success\n- Does not imply performance ranking or endorsement\n- Reflects a point-in-time review based on submitted information\n\nNaywa makes no warranties regarding outcomes.\n\n## 4. Accuracy of Information\nWhile reasonable efforts are made to review submitted information, Naywa relies on the accuracy and completeness of data provided by users.\n\nNaywa is not responsible for:\n- False or misleading submissions\n- Third-party reliance on registry information\n- Decisions made based on registry listings\n\n## 5. Limitation of Liability\nTo the fullest extent permitted by law, Naywa shall not be liable for:\n- Business losses\n- Indirect or consequential damages\n- Decisions or actions taken by users or third parties\n\nUse of the platform is at the user's own risk.\n\n## 6. Intellectual Property\nAll platform content, trademarks, logos, and materials are the property of Naywa unless otherwise stated.\n\nUnauthorized use is prohibited.\n\n## 7. Governing Law\nThis Legal Notice is governed by the laws of the United Arab Emirates, unless otherwise required by applicable regulations.\n\n## 8. Contact\nFor legal or compliance inquiries only: support@naywa.ae	t	2026-02-05 14:20:59.992	\N	2026-02-05 14:20:59.994	2026-02-05 14:20:59.994
ea7b9b57-02ea-4407-8317-7a11c52b08b8	contact	Contact	## Contact Naywa\n\nFor certification, registry, or platform-related inquiries, please contact us using the details below.\n\n**Email:** support@naywa.ae\n\n## Scope of Support\n- Certification process questions\n- Registry access issues\n- Account or technical support\n\n## Please Note\nNaywa does not provide:\n- Investment advice\n- Funding assistance\n- Partnership matchmaking	t	2026-02-05 14:20:59.995	\N	2026-02-05 14:20:59.996	2026-02-05 14:20:59.996
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.payments (id, "paymentId", "smeProfileId", amount, currency, description, status, "stripePaymentIntentId", "stripeClientSecret", "stripeChargeId", "requestedById", "requestedAt", "paidAt", "failedAt", "failureReason", "invoiceNumber", "receiptUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: sme_profiles; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.sme_profiles (id, "userId", "companyName", "tradeLicenseNumber", "companyDescription", "industrySector", "foundingDate", "employeeCount", "annualRevenue", website, address, documents, "certificationStatus", "submittedDate", "reviewedById", "revisionNotes", "listingVisible", "createdAt", "updatedAt", "auditorName", "bankAccountNumber", "bankName", "boardMembers", "businessModel", "complianceOfficerEmail", "complianceOfficerName", "existingCertifications", "fundingStage", "hasAmlPolicy", "hasDataProtectionPolicy", "headOfficeAddress", "headOfficeLatitude", "headOfficeLongitude", "lastAuditDate", "legalStructure", "licenseExpiryDate", "linkedinUrl", "majorClients", "officeType", "operatingCountries", "ownerIdNumber", "ownerName", "ownerNationality", "profitMargin", "registrationCity", "registrationCountry", "registrationNumber", "regulatoryLicenses", "secondaryContactEmail", "secondaryContactName", "secondaryContactPhone", "shareholderStructure", "socialMedia", "vatNumber", "internalDimensions", "internalNotes", "internalReviewStartedAt", "lastInternalReviewAt") FROM stdin;
c5be1bd8-8f06-4623-9a58-0c66ee912a38	f7677afa-4185-4c3f-ae44-aadd4ce6d886	NewBiz Solutions	\N	\N	finance	\N	\N	\N	\N	\N	\N	draft	\N	\N	\N	f	2026-01-30 15:24:46.902	2026-01-30 15:24:46.902	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
67ab0070-d300-4e07-b86b-b4d41d7f9d6a	0918869a-495b-490d-95f2-604131cd34c9	ConstructCo Building Materials	TL-2024-003456	Building materials supplier for construction projects across UAE.	manufacturing	2017-05-12 00:00:00	60	8000000.00	https://constructco.ae	Jebel Ali Free Zone	\N	revision_requested	2024-02-15 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	Please provide updated financial statements for the last fiscal year and valid trade license copy.	f	2026-01-30 15:24:46.912	2026-01-30 15:24:46.912	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
f68a5830-0b06-49b3-b08f-0ebb2f219350	0c7a2ae9-b24b-4741-962b-10155a4131d6	RetailHub Trading	TL-2024-009012	Multi-channel retail business specializing in consumer electronics and home appliances.	retail	2019-11-20 00:00:00	30	3200000.00	https://retailhub.ae	Sharjah Industrial Area	"[{\\"name\\":\\"Trade License\\",\\"path\\":\\"/uploads/tl-retailhub.pdf\\",\\"uploadedAt\\":\\"2024-03-01\\"}]"	rejected	2024-03-05 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	nothing	f	2026-01-30 15:24:46.886	2026-01-31 16:37:56.438	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c8d8db60-d7ab-4b2e-b13e-bd6197169d72	c4bf6f2a-e8d1-43c5-96fc-088387e93232	HealthPlus Medical Center	TL-2024-005678	Premium healthcare provider offering comprehensive medical services with state-of-the-art facilities.	healthcare	2018-07-10 00:00:00	45	5000000.00	https://healthplus.ae	Healthcare City, Abu Dhabi	"[{\\"name\\":\\"Trade License\\",\\"path\\":\\"/uploads/tl-healthplus.pdf\\",\\"uploadedAt\\":\\"2024-02-01\\"},{\\"name\\":\\"Healthcare License\\",\\"path\\":\\"/uploads/hl-healthplus.pdf\\",\\"uploadedAt\\":\\"2024-02-01\\"}]"	certified	2024-02-05 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-01-30 15:24:46.87	2026-02-02 19:11:01.955	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	9a29bfa2-6177-45a8-a308-61c1f34fb13b	TechStart UAE	TL-2024-001234	Leading technology solutions provider specializing in AI and machine learning applications for businesses in the GCC region.	technology	2020-03-15 00:00:00	25	2500000.00	https://techstart.ae	Dubai Internet City, Building 5, Office 301	"[{\\"name\\":\\"Trade License\\",\\"path\\":\\"/uploads/tl-techstart.pdf\\",\\"uploadedAt\\":\\"2024-01-15\\"},{\\"name\\":\\"Financial Statement\\",\\"path\\":\\"/uploads/fs-techstart.pdf\\",\\"uploadedAt\\":\\"2024-01-15\\"}]"	certified	2024-01-20 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-01-30 15:24:46.85	2026-02-02 19:11:03.396	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e08d8b84-de5a-46b0-a2ca-a53a6c58b252	eb13f924-6e62-47a6-a3c2-7708e677861c	tjara	9876	tjara	finance	2026-01-16 00:00:00	175	\N	tjara.com	USA	{"companyLogo": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769877885750-862383348-Catalyst_Logo__1_.png", "contactName": "ali", "contactEmail": "aqsariasat235@gmail.com", "contactPhone": "+92545028212", "fundingStage": "seed", "revenueRange": ">100m", "revenueGrowth": "10-25", "uploadedFiles": [{"id": "doc_1769802932396_fwx40o9h8", "name": "1769802932382-997599077-5G_JOBS.pdf", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802932382-997599077-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-01-30T19:55:32.396Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1769802955799_yi71k4lh8", "name": "1769802955795-547704221-4784e97d99d60fbbc4723864e3f57281.jpg", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802955795-547704221-4784e97d99d60fbbc4723864e3f57281.jpg", "size": 17232, "type": "certificate_of_incorporation", "mimeType": "image/jpeg", "uploadedAt": "2026-01-30T19:55:55.799Z", "originalName": "4784e97d99d60fbbc4723864e3f57281.jpg"}, {"id": "doc_1769802999963_3wp3z6c0w", "name": "1769802999959-490222575-Catalyst_Logo_red__1_.png", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802999959-490222575-Catalyst_Logo_red__1_.png", "size": 38309, "type": "financial_statements", "mimeType": "image/png", "uploadedAt": "2026-01-30T19:56:39.963Z", "originalName": "Catalyst_Logo_red (1).png"}, {"id": "doc_1769803012292_dzn6dwtlb", "name": "1769803012286-509302961-Catalyst_Logo__1_.png", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769803012286-509302961-Catalyst_Logo__1_.png", "size": 11185, "type": "company_profile", "mimeType": "image/png", "uploadedAt": "2026-01-30T19:56:52.292Z", "originalName": "Catalyst_Logo (1).png"}], "contactPosition": "ceo"}	certified	2026-01-31 17:57:01.451	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-01-30 18:41:16.261	2026-02-02 19:10:58.782	YES		NBD	[]	b2b	aqsa	aqsa	[]	series_a	t	t	Dubai	\N	\N	2026-02-13 00:00:00	llc	2026-02-28 00:00:00	www	[]	own_premises	[]	533990	Ali	UAE	\N	Dubai	UAE	12345	[]	email@theredstone.ai	Ali	+92518434024	[]	{}	123	\N	\N	\N	\N
\.


--
-- Data for Name: support_messages; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.support_messages (id, "ticketId", "senderId", content, "isRead", "createdAt") FROM stdin;
8c301fe0-bedd-40de-be54-ac0f5370e583	882e0107-098a-4456-89e3-e9a6d2362b1d	eb13f924-6e62-47a6-a3c2-7708e677861c	help about registration	t	2026-01-31 18:36:22.606
c5ed4008-50b9-4144-b00e-310d0743d956	882e0107-098a-4456-89e3-e9a6d2362b1d	674d623b-c2d4-4648-8115-5d0b1d164865	hlo	t	2026-01-31 18:36:40.605
95411d16-a359-4bdf-bd8a-1263661d1c77	eb915463-d72c-403c-8ecf-fe3155f8e8ac	258cb6d6-85be-4e4f-9830-107bac843987	hlo	f	2026-02-01 15:35:52.289
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.support_tickets (id, "userId", subject, status, priority, "createdAt", "updatedAt", "closedAt") FROM stdin;
882e0107-098a-4456-89e3-e9a6d2362b1d	eb13f924-6e62-47a6-a3c2-7708e677861c	help about registration	closed	medium	2026-01-31 18:36:22.606	2026-01-31 18:37:08.981	2026-01-31 18:37:08.98
eb915463-d72c-403c-8ecf-fe3155f8e8ac	258cb6d6-85be-4e4f-9830-107bac843987	hlo	open	medium	2026-02-01 15:35:52.289	2026-02-01 15:35:52.289	\N
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.user_profiles (id, "userId", company, "jobTitle", "createdAt", "updatedAt", "annualIncome", "authRepEmail", "authRepEmiratesId", "authRepName", "authRepPhone", "authRepPosition", "beneficialOwners", city, "companyAddress", "companyAnnualRevenue", "companyCity", "companyCountry", "companyEmployeeCount", "companyName", "companyPoBox", "companyType", country, "dateOfBirth", "emiratesId", "emiratesIdExpiry", "employerName", "employmentStatus", gender, "investmentBudget", "investmentInterests", "investorType", "kycDocuments", "kycRejectionReason", "kycReviewedAt", "kycReviewedBy", "kycRevisionNotes", "kycStatus", "kycSubmittedAt", nationality, occupation, "passportCountry", "passportExpiry", "passportNumber", "poBox", "registrationAuthority", "registrationDate", "registrationNumber", "residencyStatus", "residentialAddress", "riskTolerance", "sourceOfFunds", "tradeLicenseExpiry", "tradeLicenseNumber") FROM stdin;
568414a6-8bc5-400c-ab6d-b1b0e5bf5f11	17f046a0-8c7f-45e7-84b2-5941c5189375	Dubai Investment Partners	Business Development Manager	2026-01-30 15:24:46.721	2026-01-30 15:24:46.721	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	not_submitted	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c46be5b7-5191-4646-b2f4-a65b7453d2be	3bd38396-3d04-4b86-812c-4958e6cff136	Abu Dhabi Ventures	Investment Analyst	2026-01-30 15:24:46.738	2026-01-30 15:24:46.738	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	not_submitted	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32b17582-71e2-4c85-bf62-2d50f89655db	258cb6d6-85be-4e4f-9830-107bac843987	Redstone AI (SMC-PRIVATE) Limited 	\N	2026-01-31 08:33:53.821	2026-01-31 12:32:20.577	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	not_submitted	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: aqsariasat
--

COPY public.users (id, email, password, role, "fullName", "phoneNumber", "isVerified", "verificationToken", "resetPasswordToken", "resetPasswordExpires", "createdAt", "updatedAt", "lastLogin", "profilePicture", "accountStatus", "suspendedAt", "suspendedBy", "suspendedReason") FROM stdin;
17f046a0-8c7f-45e7-84b2-5941c5189375	user@example.com	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	user	Ahmed Al Mansouri	+971502345678	t	\N	\N	\N	2026-01-30 15:24:46.721	2026-01-30 15:24:46.721	\N	\N	active	\N	\N	\N
3bd38396-3d04-4b86-812c-4958e6cff136	user2@example.com	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	user	Sarah Khan	+971503456789	t	\N	\N	\N	2026-01-30 15:24:46.738	2026-01-30 15:24:46.738	\N	\N	active	\N	\N	\N
9a29bfa2-6177-45a8-a308-61c1f34fb13b	sme@techstartup.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	sme	Mohammad Al Hashimi	+971504567890	t	\N	\N	\N	2026-01-30 15:24:46.85	2026-01-30 15:24:46.85	\N	\N	active	\N	\N	\N
c4bf6f2a-e8d1-43c5-96fc-088387e93232	sme@healthplus.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	sme	Dr. Fatima Al Zaabi	+971505678901	t	\N	\N	\N	2026-01-30 15:24:46.87	2026-01-30 15:24:46.87	\N	\N	active	\N	\N	\N
0c7a2ae9-b24b-4741-962b-10155a4131d6	sme@retailhub.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	sme	Khalid Al Nasser	+971506789012	t	\N	\N	\N	2026-01-30 15:24:46.886	2026-01-30 15:24:46.886	\N	\N	active	\N	\N	\N
f7677afa-4185-4c3f-ae44-aadd4ce6d886	sme@newbusiness.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	sme	Layla Hassan	+971507890123	t	\N	\N	\N	2026-01-30 15:24:46.902	2026-01-30 15:24:46.902	\N	\N	active	\N	\N	\N
0918869a-495b-490d-95f2-604131cd34c9	sme@constructco.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	sme	Omar Al Qassim	+971508901234	t	\N	\N	\N	2026-01-30 15:24:46.912	2026-01-30 15:24:46.912	\N	\N	active	\N	\N	\N
86af4e7b-adaa-4e7d-b51f-806697d2e80e	testuser2@example.com	$2b$10$EJp/8KxOr7P9kJuzSSRfzu25Rx2womzaUqm5i/AJ2lwtybaZSJRpa	user	Test User	\N	f	BsxYGK4zBtyaGMccJPcC8cRPN6JNAfnV7eVE6JlM0z4WXb76kaG8kvD473QLUVZ1	\N	\N	2026-01-30 16:53:51.318	2026-01-30 16:53:51.318	\N	\N	active	\N	\N	\N
e873e8bb-4435-4562-b595-59ba8898c092	aqsariasat235@gmail.com	$2b$10$7.vY4xYZnoIR77CSgjMJNeddLtnBNNNpMq2LLRBQHkKP2hsKoDKe2	user	Aqsa Riasat	\N	t	WYOmX0rn74AdgERMKyzoPSCBiTY4OuK0D94SIL08paOZfF5CkxJm7JAsfgyg5V87	\N	\N	2026-01-30 16:54:22.61	2026-01-30 16:56:35.924	\N	\N	active	\N	\N	\N
a1025933-1b48-4623-91db-0ff13a091b7c	test-email-check@gmail.com	$2b$10$vrpNNqSYdTvzyZ9ll2H7yeSiZ9KfkFi1PoVXFLyYxpeBtlYxVD.K2	user	Test Email	\N	f	N02MTkRtUkoETfO7bXZdINB7PnSzQZHGs4SSSyiPiKwmmpjDYxaSOLePuyFHPfLJ	\N	\N	2026-01-30 17:04:29.066	2026-01-30 17:04:29.066	\N	\N	active	\N	\N	\N
eb13f924-6e62-47a6-a3c2-7708e677861c	email@theredstone.ai	$2b$10$knhSLwhUqTtxUbDhVcGzTOonu96HPT5uH34UzeFCcm4XhP1jMgJii	sme	Ali Hussain	\N	t	\N	\N	\N	2026-01-30 18:41:16.253	2026-02-06 20:37:58.457	2026-02-06 20:37:58.456	\N	active	\N	\N	\N
674d623b-c2d4-4648-8115-5d0b1d164865	admin@smecert.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	admin	System Administrator	+971501234567	t	\N	\N	\N	2026-01-30 15:24:46.706	2026-02-06 20:48:39.14	2026-02-06 20:48:39.139	\N	active	\N	\N	\N
258cb6d6-85be-4e4f-9830-107bac843987	rayasatmuhammad64@gmail.com	$2b$10$wJ6AXgagSmrlFLPjeKn6n.G8LPWcsuvQhklmaklMwD0df6o.kb/Yq	user	Aqsa Aqsa	0342096643	t	\N	\N	\N	2026-01-30 17:05:23.182	2026-02-04 17:34:40.816	2026-02-04 17:34:40.815	/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1769872268928-679900289-4784e97d99d60fbbc4723864e3f57281.jpg	active	\N	\N	\N
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: chat_attachments chat_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.chat_attachments
    ADD CONSTRAINT chat_attachments_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: document_versions document_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.document_versions
    ADD CONSTRAINT document_versions_pkey PRIMARY KEY (id);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: introduction_requests introduction_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.introduction_requests
    ADD CONSTRAINT introduction_requests_pkey PRIMARY KEY (id);


--
-- Name: legal_pages legal_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.legal_pages
    ADD CONSTRAINT legal_pages_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: sme_profiles sme_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.sme_profiles
    ADD CONSTRAINT sme_profiles_pkey PRIMARY KEY (id);


--
-- Name: support_messages support_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT support_messages_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_actionType_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "audit_logs_actionType_idx" ON public.audit_logs USING btree ("actionType");


--
-- Name: audit_logs_timestamp_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX audit_logs_timestamp_idx ON public.audit_logs USING btree ("timestamp");


--
-- Name: audit_logs_userId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "audit_logs_userId_idx" ON public.audit_logs USING btree ("userId");


--
-- Name: certificates_certificateId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "certificates_certificateId_idx" ON public.certificates USING btree ("certificateId");


--
-- Name: certificates_certificateId_key; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE UNIQUE INDEX "certificates_certificateId_key" ON public.certificates USING btree ("certificateId");


--
-- Name: certificates_smeProfileId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "certificates_smeProfileId_idx" ON public.certificates USING btree ("smeProfileId");


--
-- Name: certificates_status_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX certificates_status_idx ON public.certificates USING btree (status);


--
-- Name: chat_messages_introductionRequestId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "chat_messages_introductionRequestId_idx" ON public.chat_messages USING btree ("introductionRequestId");


--
-- Name: chat_messages_senderId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "chat_messages_senderId_idx" ON public.chat_messages USING btree ("senderId");


--
-- Name: document_versions_documentType_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "document_versions_documentType_idx" ON public.document_versions USING btree ("documentType");


--
-- Name: document_versions_isLatest_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "document_versions_isLatest_idx" ON public.document_versions USING btree ("isLatest");


--
-- Name: document_versions_smeProfileId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "document_versions_smeProfileId_idx" ON public.document_versions USING btree ("smeProfileId");


--
-- Name: email_logs_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "email_logs_entityType_entityId_idx" ON public.email_logs USING btree ("entityType", "entityId");


--
-- Name: email_logs_eventType_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "email_logs_eventType_idx" ON public.email_logs USING btree ("eventType");


--
-- Name: email_logs_recipientEmail_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "email_logs_recipientEmail_idx" ON public.email_logs USING btree ("recipientEmail");


--
-- Name: email_logs_sentAt_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "email_logs_sentAt_idx" ON public.email_logs USING btree ("sentAt");


--
-- Name: email_logs_status_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX email_logs_status_idx ON public.email_logs USING btree (status);


--
-- Name: legal_pages_slug_key; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE UNIQUE INDEX legal_pages_slug_key ON public.legal_pages USING btree (slug);


--
-- Name: payments_paymentId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "payments_paymentId_idx" ON public.payments USING btree ("paymentId");


--
-- Name: payments_paymentId_key; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE UNIQUE INDEX "payments_paymentId_key" ON public.payments USING btree ("paymentId");


--
-- Name: payments_smeProfileId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "payments_smeProfileId_idx" ON public.payments USING btree ("smeProfileId");


--
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- Name: sme_profiles_tradeLicenseNumber_key; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE UNIQUE INDEX "sme_profiles_tradeLicenseNumber_key" ON public.sme_profiles USING btree ("tradeLicenseNumber");


--
-- Name: sme_profiles_userId_key; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE UNIQUE INDEX "sme_profiles_userId_key" ON public.sme_profiles USING btree ("userId");


--
-- Name: support_messages_senderId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "support_messages_senderId_idx" ON public.support_messages USING btree ("senderId");


--
-- Name: support_messages_ticketId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "support_messages_ticketId_idx" ON public.support_messages USING btree ("ticketId");


--
-- Name: support_tickets_status_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX support_tickets_status_idx ON public.support_tickets USING btree (status);


--
-- Name: support_tickets_userId_idx; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE INDEX "support_tickets_userId_idx" ON public.support_tickets USING btree ("userId");


--
-- Name: user_profiles_userId_key; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE UNIQUE INDEX "user_profiles_userId_key" ON public.user_profiles USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: aqsariasat
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: audit_logs audit_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: certificates certificates_issuedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "certificates_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: certificates certificates_smeProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "certificates_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES public.sme_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_attachments chat_attachments_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.chat_attachments
    ADD CONSTRAINT "chat_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public.chat_messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_introductionRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "chat_messages_introductionRequestId_fkey" FOREIGN KEY ("introductionRequestId") REFERENCES public.introduction_requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "chat_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: document_versions document_versions_reviewedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.document_versions
    ADD CONSTRAINT "document_versions_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: document_versions document_versions_smeProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.document_versions
    ADD CONSTRAINT "document_versions_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES public.sme_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: introduction_requests introduction_requests_requesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.introduction_requests
    ADD CONSTRAINT "introduction_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: introduction_requests introduction_requests_smeProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.introduction_requests
    ADD CONSTRAINT "introduction_requests_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES public.sme_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_requestedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payments payments_smeProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES public.sme_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sme_profiles sme_profiles_reviewedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.sme_profiles
    ADD CONSTRAINT "sme_profiles_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sme_profiles sme_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.sme_profiles
    ADD CONSTRAINT "sme_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: support_messages support_messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT "support_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: support_messages support_messages_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public.support_tickets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: support_tickets support_tickets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT "support_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsariasat
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 6a3Uxed1VzkJxHzML6j51MGc5zSMu7JdmoaqR6w9U0esDDqKLYAM7orvtQ7imDH

