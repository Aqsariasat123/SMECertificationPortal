--
-- PostgreSQL database dump
--

\restrict gh2U9R1njirHkkGjZziNoZaMPwTH3EMWr2ef4jIoOIf9uf8nM5rc9vm1NY0eAP2

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

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
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AccountStatus; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."AccountStatus" AS ENUM (
    'active',
    'suspended'
);


ALTER TYPE public."AccountStatus" OWNER TO sme_user;

--
-- Name: BusinessModel; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."BusinessModel" AS ENUM (
    'b2b',
    'b2c',
    'b2b2c',
    'marketplace',
    'saas',
    'other'
);


ALTER TYPE public."BusinessModel" OWNER TO sme_user;

--
-- Name: CertificateStatus; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."CertificateStatus" AS ENUM (
    'active',
    'expired',
    'revoked'
);


ALTER TYPE public."CertificateStatus" OWNER TO sme_user;

--
-- Name: CertificationStatus; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."CertificationStatus" AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'certified',
    'rejected',
    'revision_requested'
);


ALTER TYPE public."CertificationStatus" OWNER TO sme_user;

--
-- Name: DocumentStatus; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."DocumentStatus" AS ENUM (
    'pending',
    'approved',
    'requires_revision'
);


ALTER TYPE public."DocumentStatus" OWNER TO sme_user;

--
-- Name: EmailStatus; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."EmailStatus" AS ENUM (
    'sent',
    'failed'
);


ALTER TYPE public."EmailStatus" OWNER TO sme_user;

--
-- Name: FundingStage; Type: TYPE; Schema: public; Owner: sme_user
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


ALTER TYPE public."FundingStage" OWNER TO sme_user;

--
-- Name: IndustrySector; Type: TYPE; Schema: public; Owner: sme_user
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


ALTER TYPE public."IndustrySector" OWNER TO sme_user;

--
-- Name: InvestorType; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."InvestorType" AS ENUM (
    'individual',
    'company'
);


ALTER TYPE public."InvestorType" OWNER TO sme_user;

--
-- Name: KycStatus; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."KycStatus" AS ENUM (
    'not_submitted',
    'pending',
    'approved',
    'rejected',
    'revision_requested'
);


ALTER TYPE public."KycStatus" OWNER TO sme_user;

--
-- Name: LegalStructure; Type: TYPE; Schema: public; Owner: sme_user
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


ALTER TYPE public."LegalStructure" OWNER TO sme_user;

--
-- Name: OfficeType; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."OfficeType" AS ENUM (
    'own_premises',
    'rented',
    'shared_coworking',
    'virtual',
    'home_based'
);


ALTER TYPE public."OfficeType" OWNER TO sme_user;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'not_requested',
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE public."PaymentStatus" OWNER TO sme_user;

--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'pending',
    'viewed',
    'responded'
);


ALTER TYPE public."RequestStatus" OWNER TO sme_user;

--
-- Name: SupportTicketPriority; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."SupportTicketPriority" AS ENUM (
    'low',
    'medium',
    'high'
);


ALTER TYPE public."SupportTicketPriority" OWNER TO sme_user;

--
-- Name: SupportTicketStatus; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."SupportTicketStatus" AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'closed'
);


ALTER TYPE public."SupportTicketStatus" OWNER TO sme_user;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: sme_user
--

CREATE TYPE public."UserRole" AS ENUM (
    'user',
    'sme',
    'admin'
);


ALTER TYPE public."UserRole" OWNER TO sme_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public._prisma_migrations OWNER TO sme_user;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.audit_logs OWNER TO sme_user;

--
-- Name: certificates; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.certificates OWNER TO sme_user;

--
-- Name: chat_attachments; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.chat_attachments OWNER TO sme_user;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.chat_messages OWNER TO sme_user;

--
-- Name: document_versions; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.document_versions OWNER TO sme_user;

--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.email_logs OWNER TO sme_user;

--
-- Name: introduction_requests; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.introduction_requests OWNER TO sme_user;

--
-- Name: legal_pages; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.legal_pages OWNER TO sme_user;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.payments OWNER TO sme_user;

--
-- Name: sme_profiles; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.sme_profiles OWNER TO sme_user;

--
-- Name: support_messages; Type: TABLE; Schema: public; Owner: sme_user
--

CREATE TABLE public.support_messages (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.support_messages OWNER TO sme_user;

--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.support_tickets OWNER TO sme_user;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.user_profiles OWNER TO sme_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: sme_user
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


ALTER TABLE public.users OWNER TO sme_user;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a1e145aa-2661-42f0-bbf9-28b56be7df3b	4155536762de1a3303b6457aac9d1513cc1300327eaa07f967e7fa471f7f8418	2026-01-30 15:22:00.397637+00	20260130152200_init	\N	\N	2026-01-30 15:22:00.351614+00	1
32eba1e6-ac43-43a9-92ee-23fd8a9f5249	3f66b16690d3ad9aa6d7dab553dd46398b4be8db3ce2c6762f24829d57f18a52	2026-01-30 20:22:51.584763+00	20260130202251_add_sme_response_field	\N	\N	2026-01-30 20:22:51.579103+00	1
683d14c3-61d7-426c-8e57-c734a2e45809	da430607c1c441cd03fe9c6d0f5ab08de33a36d9648a8645423b6b7784eb8767	2026-01-30 20:28:09.702087+00	20260130202809_add_chat_messages	\N	\N	2026-01-30 20:28:09.679599+00	1
7e12e67a-b735-4518-b0cc-3f0108f4900f	76906e053a1a4ccc7b75ef46874e5ffea7afee7d4f0a2981c1c0cbadc24bc50d	2026-01-30 20:38:00.877826+00	20260130203800_add_message_edit_delete	\N	\N	2026-01-30 20:38:00.872697+00	1
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: sme_user
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
42947ce9-ddd1-440c-84a4-1d508f9caa00	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-01 18:47:46.819	\N	\N
4eb7757b-24de-446d-8b4f-d3135d856f14	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-01 18:48:47.514	\N	\N
83216e4a-86fc-422a-98e9-9d24a2864bbc	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-01 18:49:19.037	\N	\N
8260199c-e325-4678-8f7c-54d185e572e4	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-01 18:50:12.754	\N	\N
bdbc1e89-1122-4508-9693-559a1ae85819	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-01 18:51:16.837	\N	\N
3472bf55-f489-4c55-8b27-f076310919f3	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-01 18:51:42.761	\N	\N
b9f3c22f-ddec-4a51-a297-fe36317540d6	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-01 18:55:31.723	\N	\N
bc454919-45a3-4ef1-8559-6765ae1287a2	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-01 19:05:42.034	\N	\N
d7836b01-59ce-4abd-ba21-d3b81c95b643	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-01 19:06:15.826	\N	\N
1f2b661f-1b90-473c-b2b9-2f3959c63bf1	258cb6d6-85be-4e4f-9830-107bac843987	KYC_SUBMITTED	Submitted individual investor KYC	UserProfile	258cb6d6-85be-4e4f-9830-107bac843987	10.10.10.1	2026-02-02 08:44:39.771	\N	\N
fd564b83-383c-498f-9d12-235f1702cc5c	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 09:11:37.393	\N	\N
b51c14a8-13f0-48d3-a825-36ebda2a4702	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 09:12:25.904	\N	\N
7fec4e78-fd94-470e-a1d5-b68909fc2d58	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 09:14:37.258	\N	\N
77c5b347-cd5e-4d59-8627-c0c83ea19bf4	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 09:27:30.668	\N	\N
053bfceb-5a32-45b4-b3d1-7f72337f186c	674d623b-c2d4-4648-8115-5d0b1d164865	KYC_APPROVE	Approved KYC for investor Aqsa Aqsa	UserProfile	32b17582-71e2-4c85-bf62-2d50f89655db	10.10.10.1	2026-02-02 10:11:40.626	\N	{"status":"approved","notes":null}
0c1164c8-c6ee-4bda-89fb-d97dd676c407	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 10:47:00.577	\N	\N
a44910cd-64e4-4793-8cdd-de764ec00711	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 11:34:05.676	\N	\N
b2a37fa4-beed-4d2d-9042-5d77f36196ac	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 11:34:53.666	\N	\N
b393d97b-380e-469c-b80b-1c22c11c9ffe	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 11:36:57.428	\N	\N
1059808f-2632-4807-8fc0-5fb8b26b519b	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 11:45:31.157	\N	\N
95d9ded8-ace4-411e-b855-af54230f4547	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 11:46:47.198	\N	\N
11cc0fde-3845-49b8-9051-7e695e31b98c	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 11:47:56.738	\N	\N
8c3ed9dc-acd3-47a1-a7e5-739d277fcc23	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 11:48:09.514	\N	\N
b21d9e00-52e7-467e-b685-02295d08c9fc	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 11:50:25.621	\N	\N
5d89f12a-4c0d-41a6-931d-80dc2cfd3c25	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	10.10.10.1	2026-02-02 11:50:37.341	\N	\N
86ef8efb-34e3-4ba8-a74a-8e90951df33e	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 12:03:32.053	\N	\N
1c2b75ed-ab09-474a-8db5-16b230e74a77	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 12:03:39.298	\N	\N
4ad868f2-a34b-4713-af33-06749aeffca7	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 12:18:28.022	\N	\N
871973c5-0673-45e4-9255-b3ef88614940	da65cb66-0593-4ab3-a690-82396bdf80d4	USER_REGISTERED	New user account registered	\N	\N	10.10.10.1	2026-02-02 12:19:08.473	\N	\N
fca24b73-5651-46bb-b5cf-de8df217a022	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 12:25:52.7	\N	\N
ede322ff-bc74-4e0a-9708-d83bd4915672	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 12:28:57.785	\N	\N
916a270a-2d02-406a-8681-5f69f4034608	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 12:33:37.586	\N	\N
91bddf99-5f18-415e-9ea9-c5633721514a	258cb6d6-85be-4e4f-9830-107bac843987	INTRODUCTION_REQUESTED	Requested introduction to HealthPlus Medical Center	IntroductionRequest	26c33880-2196-4839-b1db-3db18e13ff07	10.10.10.1	2026-02-02 12:41:35.503	\N	\N
f8bf9d9f-47f6-404e-9d66-33abdc3b9567	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 12:45:41.255	\N	\N
5cf5fe0a-dd4a-49fe-ae47-01c3d853348c	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 12:45:46.868	\N	\N
c5d31f70-bbe1-429f-b666-f743f36724c9	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 12:46:31.213	\N	\N
6249de60-f571-42ff-aee5-43ba209cb914	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 12:46:55.294	\N	\N
54d7c22d-ee75-4ae9-ab84-5146f732298b	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 12:49:45.481	\N	\N
1a38247c-4003-4b2d-a3ab-a8cd37524551	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 12:50:03.464	\N	\N
b2b37670-3a2e-421f-8c4d-ba5558e6614f	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 12:56:00.464	\N	\N
d08f1ac2-ccf2-4faa-a0d9-5ad7b4b6622d	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 12:56:54.756	\N	\N
019cd52c-8425-4d57-bddb-0164f923f980	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 13:00:36.284	\N	\N
24629e9a-839f-4d78-b301-651082f6d176	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:00:46.96	\N	\N
c9a7c2cf-36ab-42cc-8cf6-4448ac2fc4bb	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 13:00:50.929	\N	\N
9c4c52e7-a8d8-4672-83a1-17fc1d16a054	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:01:02.677	\N	\N
b4b49d4a-e28c-434b-aee4-4988918e3b7b	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:01:30.114	\N	\N
04df9df4-56ff-4e2c-9e13-65a5b3455323	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 13:05:11.078	\N	\N
1cb9add3-a907-45d6-990c-a8bd0f76ff4e	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:15:38.091	\N	\N
708e3ee5-8aa3-47f9-af91-ebf344ad98d0	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 13:15:42.426	\N	\N
fdee8b98-9a47-49f2-ba56-8056e4a1d642	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:26:29.142	\N	\N
525e0733-b54d-40bd-8577-5ddf5072b172	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 13:27:02.427	\N	\N
6c4fcd56-6392-4c4f-b840-1a60fd01c23d	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_REGISTERED	New sme account registered	\N	\N	10.10.10.1	2026-02-02 13:30:47.954	\N	\N
8453be1e-1b41-4829-951b-abb38620d206	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:31:14.585	\N	\N
e717b082-a0f4-478a-84ab-7b1840fb4f4c	d20849a8-e976-4711-8e27-bc530aed0c4a	EMAIL_VERIFIED	Email address verified successfully	\N	\N	10.10.10.1	2026-02-02 13:36:36.019	\N	\N
96b12891-2ab3-4702-b739-581793beea97	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:36:49.572	\N	\N
08e8509b-7224-4d23-bb69-a5cc1291ff32	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:43:48.896	\N	\N
33050c8d-340a-4e50-a7e1-85f94bea5eca	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 13:44:36.497	\N	\N
482940ad-7259-4464-ae74-3f188e2f2db9	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 14:13:06.322	\N	\N
0808dc6a-dd0f-43a6-bf12-2754f7d923a2	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 14:13:27.463	\N	\N
f8642ba7-7538-40b7-93fd-6e1404849fec	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 14:14:49.594	\N	\N
2c8bd753-24bf-40fd-8d22-001b6dea70cd	0aa46452-b94e-481e-87c6-390d50c821b2	USER_REGISTERED	New user account registered	\N	\N	10.10.10.1	2026-02-02 14:16:37.405	\N	\N
760d34f0-8600-494f-811b-8b22a9743c46	0aa46452-b94e-481e-87c6-390d50c821b2	EMAIL_VERIFIED	Email address verified successfully	\N	\N	10.10.10.1	2026-02-02 14:17:40.46	\N	\N
cd9178d3-7752-485e-9437-b393e4068ba9	0aa46452-b94e-481e-87c6-390d50c821b2	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 14:18:14.131	\N	\N
49191ef2-1cde-43ec-b624-bba0c4c8e808	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	USER_REGISTERED	New sme account registered	\N	\N	10.10.10.1	2026-02-02 14:19:22.208	\N	\N
5cabaaa5-4222-481a-8486-8836d6fcc2de	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	EMAIL_VERIFIED	Email address verified successfully	\N	\N	10.10.10.1	2026-02-02 14:21:44.924	\N	\N
8279c6fa-ee0a-4e9e-9522-0c7ed8d6a4f2	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 14:22:05.755	\N	\N
531cc2c4-b39c-4dbb-af1d-fcaee8e684f9	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	LOGO_UPLOADED	Company logo uploaded for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:28:04.856	\N	\N
2fe137de-eab6-4214-8121-e52a986f42ff	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	PROFILE_UPDATED	SME profile updated	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:29:08.781	\N	\N
b99b1268-ba0f-4b46-ba25-e340d8f2a363	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	PROFILE_UPDATED	SME profile updated	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:32:17.639	\N	\N
24bcd45d-fd2c-454e-9a1c-dfc7f0de7e4b	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	PROFILE_UPDATED	SME profile updated	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:33:47.601	\N	\N
a0d2642c-d377-4dc9-a10e-b906d4d87223	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	PROFILE_UPDATED	SME profile updated	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:37:21.072	\N	\N
6264b38c-e874-4363-90cc-cc4d93b6268a	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 14:40:39.499	\N	\N
8b9c4998-50a0-4cef-b46b-8ff46fd6f6af	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 14:44:21.676	\N	\N
bdd061b8-044d-4a78-a5e0-5d9e023b6081	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 14:44:53.601	\N	\N
29010979-5e00-4906-8b62-b4d5545346cc	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	PROFILE_UPDATED	SME profile updated	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:47:04.903	\N	\N
151dec7b-3f2a-4277-b8b1-bbb366706bd3	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	PROFILE_UPDATED	SME profile updated	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:47:35.533	\N	\N
6f35c424-e944-4cca-8475-15ad5f318f11	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	DOCUMENT_UPLOADED	Document uploaded: Trade License	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:48:48.163	\N	\N
46bd60d3-02ad-4957-a507-6feac89f8bb5	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	DOCUMENT_UPLOADED	Document uploaded: Certificate of Incorporation	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:48:53.843	\N	\N
db69db86-e38e-4e5c-854b-a4dd9db2de48	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	DOCUMENT_UPLOADED	Document uploaded: Financial Statements (Last 2 years)	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:48:57.653	\N	\N
e5514ba4-1d61-41ea-ad5a-97c08917e9d0	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	DOCUMENT_UPLOADED	Document uploaded: Company Profile / Brochure	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:49:02.672	\N	\N
cb2bdabe-7984-425c-a906-30fc083b5bb7	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	CERTIFICATION_SUBMITTED	Certification application submitted for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:49:15.633	\N	\N
eb9ae6b1-5ed7-4efd-b8ca-056ef5869ecc	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 14:51:15.048	\N	\N
1e744cda-c6a6-4931-8306-11014bdfc149	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 14:51:20.706	\N	\N
e4dfbea0-63ff-4189-969d-801c2453d67e	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:51:26.779	\N	{"status":"under_review"}
0c1c2ef7-b170-4f89-9af6-6233e404e14e	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_APPROVE	Approved certification for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 14:51:43.804	\N	{"status":"certified"}
3223c15b-65ce-411c-9afd-e0cab5dd76bb	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 14:54:03.621	\N	\N
cd723166-c29c-4d53-8941-a40458ec48c4	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:03:01.47	\N	\N
b77f86d4-4411-410f-9432-9c1faa26ff25	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:08:52.163	\N	\N
525e861f-d518-4187-ade7-c2a4c3153906	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:08:59.42	\N	\N
683243d5-7161-4381-97cd-54520ddb2760	674d623b-c2d4-4648-8115-5d0b1d164865	KYC_APPROVE	Approved KYC for investor Soniya Rabbani	UserProfile	049cabf6-2690-4864-a7f0-103b6ebba063	10.10.10.1	2026-02-02 15:09:54.721	\N	{"status":"approved","notes":null}
f92e04ea-c7a1-473c-8b21-5e078cfe766b	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:10:25.963	\N	\N
eff00046-c6c7-4e23-88c4-d8e9222f583c	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:21:08.798	\N	\N
6ecff536-08ab-485c-9ac8-7a975fab48ef	0aa46452-b94e-481e-87c6-390d50c821b2	INTRODUCTION_REQUESTED	Requested introduction to UAE GEM	IntroductionRequest	2f0de7c1-cae6-4f30-ac2b-8a31e2405fb8	10.10.10.1	2026-02-02 15:22:30.527	\N	\N
84d66e7d-5379-42f9-9ed0-be5afa3d3a7c	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:22:54.084	\N	\N
5d45749a-84fc-4b53-97bb-10327fc5eacd	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:22:59.879	\N	\N
893345e0-3556-4408-9413-f173673de07b	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:23:59.275	\N	\N
d82119cc-4e0f-4bce-a8a4-a6c124827c60	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:24:09.917	\N	\N
bfc8e298-ea7d-4f25-ade1-4be83269c007	0aa46452-b94e-481e-87c6-390d50c821b2	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:28:19.766	\N	\N
c6b1f07e-f7a0-441e-b26f-fe52c3d54ee8	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:28:38.42	\N	\N
c3b866b3-6c19-49c8-9828-b89d55716f4d	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 18:19:10.855	\N	\N
9474023b-f5f1-40b1-845d-2457710d3013	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 18:54:34.624	\N	\N
bdc3cde2-2acd-4381-ae56-41dfbf8cfa4e	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 19:17:14.26	\N	\N
43fbc8f4-360a-43c8-b242-f96e8129218a	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 19:17:24.532	\N	\N
3f4b53db-5489-411b-89fd-4c9c14fe8bc3	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 19:17:53.436	\N	\N
89a3ffe0-89df-4d1f-accc-877898bebdc6	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	10.10.10.1	2026-02-02 19:18:05.283	\N	\N
ce43ed7f-e423-4442-bc98-0eb6fa1ec295	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	10.10.10.1	2026-02-02 19:18:13.6	\N	\N
00275aa5-3dee-4ea8-a1ac-0632d5ce8d1f	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	10.10.10.1	2026-02-02 19:18:14.651	\N	\N
4aed23ab-a3a8-44ea-8eb0-eee8d78107bb	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 15:53:00.81	\N	\N
a6b75c11-f96c-4197-b8b7-2f6730d59bdf	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 15:53:12.066	\N	\N
aa25e234-0f71-4025-8674-60f5fb46204f	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 15:53:20.946	\N	\N
71936925-e817-4c08-99e8-d770d3b28086	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	161.142.154.57	2026-02-04 15:54:07.023	\N	\N
0d605ee1-daa8-4d54-92c3-91564ccbb872	258cb6d6-85be-4e4f-9830-107bac843987	PROFILE_UPDATED	Updated user profile	User	258cb6d6-85be-4e4f-9830-107bac843987	161.142.154.57	2026-02-04 15:54:15.643	\N	\N
f7e511f8-30d8-4f0a-bf91-89d3438aa08d	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 16:00:54.788	\N	\N
4871ed47-0650-4286-889b-567ca994853b	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:01:02.62	\N	\N
8251890a-ffc8-4125-8c19-c6ee43d11b94	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 16:01:50.817	\N	\N
9b4fecf7-6db7-43e7-9aee-297a443fef85	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-04 16:03:23.711	\N	\N
17850b48-2f22-422f-84b4-4c6b6ebc6c47	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:04:05.197	\N	\N
1e762673-f11b-4504-b232-3cd1ea391561	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 16:11:36.779	\N	\N
4b393d8d-a0e3-428b-9fc8-e1fd865418a6	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:14:06.021	\N	\N
e6ec45be-dcbe-4214-9a2a-638426fec8ec	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 16:19:44.276	\N	\N
30621f2d-487d-469e-b296-1f4a96e16c8f	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:20:23.81	\N	\N
32743e54-90b8-4ab2-b7fc-6ba2deb7c03f	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 16:21:02.737	\N	\N
ecfddd95-d816-4b82-8c43-a793fd06e9a9	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:21:11.651	\N	\N
e4edd505-a349-4140-9076-e6f058a809c1	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 16:21:15.055	\N	\N
528b0a3c-348e-4723-aee5-c3f1b2f455db	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:21:22.265	\N	\N
9253a7df-48c9-484c-98ca-d6aa740198ef	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 16:21:31.901	\N	\N
8a02fd05-0ddc-48d6-9d31-e27d3618b6dc	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:21:39.311	\N	\N
a6ab0176-fc7d-42e4-8122-ad5748426bde	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 16:23:49.251	\N	\N
6b6c4f4a-c561-46a4-bddd-e07630f4e8c9	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:23:59.096	\N	\N
2bd8a928-355d-41ec-9e09-cb6766d632dd	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:24:54.704	\N	\N
e803609c-99c7-4b06-a2de-eb6f9e5dad25	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-04 16:25:18.934	\N	\N
b9b29cd1-c13f-494f-b3be-de91c925ccc0	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 16:27:05.014	\N	\N
36e9cc58-ef26-4955-b600-75986153953f	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:27:14.822	\N	\N
21261d68-a6c1-45b0-ae0d-1c6aa517a3e8	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 16:30:12.574	\N	\N
c85e9f96-40b4-4ee0-83eb-11704e8bac91	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 16:30:20.663	\N	\N
04c55ed5-d269-42ab-b53d-86f9576bd6f7	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 18:36:56.987	\N	\N
e79b4359-75d8-4f00-8cd3-d09b0e3b5c16	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 19:21:01.01	\N	\N
8f4a82f8-c22b-4837-86a6-20a10d64e216	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 19:21:10.483	\N	\N
db5ad41c-ff23-49ec-8e9a-873c23a83bd1	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 19:21:28.379	\N	\N
4ddd818d-e336-4456-b8e9-91986989401c	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 19:29:30.172	\N	\N
92a41645-b146-4d84-8510-153b2cc84909	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-04 19:36:19.094	\N	\N
c10a102d-b4d9-45b6-b892-3dde4abd1ba4	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 19:36:37.803	\N	\N
9ae4468c-ad29-44b3-96ca-d9b1306a0af4	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 19:43:28.869	\N	\N
9504782d-5df3-4a3b-952a-7c4a5df354f6	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 19:46:27.044	\N	\N
4cc36f93-2f80-4759-8ce7-abda23094a50	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-04 19:47:36.96	\N	\N
25ac3eaa-a79b-4baa-88ae-d89b2c286b10	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	37.245.216.250	2026-02-04 20:24:17.323	\N	\N
964fe357-a59f-468b-a267-e983c7e07bcc	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	5.30.9.110	2026-02-04 22:33:14.069	\N	\N
f4432b5d-ccfd-474e-a77d-8a9e644afcd4	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	5.30.9.110	2026-02-04 22:34:47.739	\N	\N
f9c95611-476c-4748-bcbd-9ad63d5625ec	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	5.30.9.110	2026-02-04 22:34:50.173	\N	\N
99528311-d55c-4bba-9dd2-8c2accd2e564	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	5.30.9.110	2026-02-04 22:34:51.045	\N	\N
2468086a-de0c-4118-9e83-751c4abeb524	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	5.30.9.110	2026-02-04 22:34:52.735	\N	\N
3f20a207-bf85-467d-a7bc-dbcffaee59ea	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	5.30.9.110	2026-02-04 23:00:31.571	\N	\N
a8652d33-4433-468f-89b7-fe59438412f5	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	5.30.9.110	2026-02-04 23:12:31.764	\N	\N
f386dc11-3b3b-4593-8512-6681fbb91c0c	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	5.30.9.110	2026-02-04 23:12:34.536	\N	\N
de5018a6-4d1b-4a0b-aa51-31bbff0632cd	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 08:36:50.241	\N	\N
2f16bdb8-c6f7-4e39-a0e8-8278e3d6ae52	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 08:37:19.636	\N	\N
c0d5390b-d51b-4b17-9dec-0ebb80a27ac4	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 08:39:28.98	\N	\N
bd9f9dba-b4db-496f-b220-3bdc4e3499a4	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 08:39:37.709	\N	\N
e7788133-d136-4b0b-bb04-eeccd344096c	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-05 08:42:30.089	\N	\N
666312e1-ad20-4a6f-ad07-cc913776c58c	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 08:45:17.987	\N	\N
64b32e4c-f09f-4eb3-8cb1-46084c5dd029	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-05 08:45:49.831	\N	\N
be960d87-8119-45b8-a380-e00e2cfc8214	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 08:45:58.333	\N	\N
ed1298cd-583d-4a52-8007-aa2f33ca45c8	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-05 08:46:00.32	\N	\N
99c67daa-52f1-4ea6-aab6-f7972902fd9a	674d623b-c2d4-4648-8115-5d0b1d164865	APPLICATIONS_EXPORTED	Admin exported applications data (6 records)	\N	\N	161.142.154.57	2026-02-05 08:46:04.543	\N	\N
c065f916-9eb1-49c4-8b4d-7d9539efbb65	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-05 08:46:14.394	\N	\N
75444d95-3557-4535-9a65-260f85124e63	674d623b-c2d4-4648-8115-5d0b1d164865	APPLICATIONS_EXPORTED	Admin exported applications data (6 records)	\N	\N	::1	2026-02-05 08:46:14.416	\N	\N
39cc7a55-5ef1-4bee-b3ce-59b2fe7b3bd3	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 09:18:26.081	\N	\N
ac7b7161-34d0-4d98-9ed7-96ad12a13f93	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 09:18:35.074	\N	\N
f7d9de21-ab33-42d1-9e65-8e3b8bfa446f	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	5.30.9.110	2026-02-05 11:30:45.28	\N	\N
64d390a4-0e2e-43f5-b498-e41fc0923f9a	674d623b-c2d4-4648-8115-5d0b1d164865	AUDIT_LOGS_EXPORTED	Admin exported audit logs (345 records)	\N	\N	5.30.9.110	2026-02-05 11:46:58.694	\N	\N
dd163019-4a7f-42c5-8912-938958dc0c23	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 14:32:53.222	\N	\N
be0eedfd-50fd-4706-9d13-bc5708998646	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 14:32:56.008	\N	\N
1388ddf4-b837-45ee-9e03-d8eba40634ec	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-05 14:43:06.047	\N	{"role":"admin"}
2fa53c63-6f4b-44a5-a9af-4db1126a4850	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 14:45:25.096	\N	{"role":"admin"}
303774a9-f344-4ec5-9e9b-ccff6c0a4a72	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 14:46:59.64	\N	\N
35470e2e-0ee3-44ef-b4f9-415b1980c0c3	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 14:47:19.583	\N	{"role":"admin"}
c52fa39f-2c45-4b74-9985-faa84bf19d56	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-05 14:54:46.844	\N	{"role":"admin"}
a98576be-5681-405f-9812-ae276237adba	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 15:00:45.506	\N	{"role":"sme"}
5357c557-a574-4ef2-9c0c-d7d0ab1b9f76	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 15:01:02.755	\N	\N
b6d33cf3-d87c-42d7-964a-cef561f31247	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 15:01:50.178	\N	{"role":"user"}
f2606a54-5089-4bd1-9e39-a01b9998500d	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_SEARCH	Registry search — 4 results	\N	\N	161.142.154.57	2026-02-05 15:01:51.309	\N	{"search":null,"sector":null,"resultCount":4}
45a174d5-c8b0-4a2c-bd54-ea198099382e	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_SEARCH	Registry search: "t" — 4 results	\N	\N	161.142.154.57	2026-02-05 15:02:12.001	\N	{"search":"t","sector":null,"resultCount":4}
85a137dc-09bf-422c-88b9-cfc9881fe98e	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_SEARCH	Registry search: "tj" — 1 results	\N	\N	161.142.154.57	2026-02-05 15:02:12.243	\N	{"search":"tj","sector":null,"resultCount":1}
68541901-3cda-460d-82ff-9def09245b0b	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_SEARCH	Registry search: "tja" — 1 results	\N	\N	161.142.154.57	2026-02-05 15:02:12.45	\N	{"search":"tja","sector":null,"resultCount":1}
22d7dc05-5d93-423a-9944-8b635581a2b3	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_SEARCH	Registry search: "tjar" — 1 results	\N	\N	161.142.154.57	2026-02-05 15:02:12.811	\N	{"search":"tjar","sector":null,"resultCount":1}
daee9246-b79f-4875-89b3-cc22024451e0	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_VIEW	Viewed registry profile: tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	161.142.154.57	2026-02-05 15:02:15.962	\N	\N
3915b69f-60f4-4df9-9c1f-ad09033514c3	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-05 15:04:17.341	\N	{"role":"admin"}
163c10fd-4c5a-49de-a33b-5f5c75bec53e	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-05 15:11:30.096	\N	{"role":"admin"}
05f82fb8-4e5c-4f55-b523-3d557729de20	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-05 15:11:41.494	\N	{"role":"admin"}
de3e61c0-5c06-47fd-8759-4ad7c1f4804a	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	::1	2026-02-05 15:11:50.185	\N	{"role":"admin"}
70818249-c64a-4831-b350-35b2a868c738	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 15:23:41.087	\N	\N
096a27da-e3fc-4eff-843d-4531689b00ce	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 15:25:15.057	\N	{"role":"admin"}
13bc1bc8-dfda-49e7-9859-607b47a1fb7d	674d623b-c2d4-4648-8115-5d0b1d164865	AUDIT_LOGS_EXPORTED	Admin exported audit logs (368 records)	\N	\N	161.142.154.57	2026-02-05 15:32:50.633	\N	\N
ef7b5f88-75ab-436e-bc81-c0b1d2d39b13	674d623b-c2d4-4648-8115-5d0b1d164865	APPLICATIONS_EXPORTED	Admin exported applications data (6 records)	\N	\N	161.142.154.57	2026-02-05 15:33:04.759	\N	\N
beaeca81-8309-49b0-9c2c-b2acf431c848	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 16:18:46.284	\N	{"role":"sme"}
02fe23fd-1f62-44d8-a870-1ad504dd7e99	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 16:21:17.547	\N	\N
0b2e3a06-a7a4-4e66-8580-13caa42ed1b9	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 16:21:37.485	\N	{"role":"user"}
411d9dc5-46ef-4c40-a1a9-3b1ea5ee99ec	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_SEARCH	Registry search — 4 results	\N	\N	161.142.154.57	2026-02-05 16:21:38.297	\N	{"search":null,"sector":null,"resultCount":4}
c1a67d83-118c-4216-b001-f791b36d8e88	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_SEARCH	Registry search — 4 results	\N	\N	161.142.154.57	2026-02-05 16:21:41.902	\N	{"search":null,"sector":null,"resultCount":4}
40c31c6f-9be4-42f8-9c56-50495a4370d5	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 16:21:49.373	\N	\N
08f26535-38af-4ac7-b675-bc7988e84b3f	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 16:26:19.199	\N	{"role":"admin"}
94cb4193-0dc7-4397-a2e7-36a77bb86774	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 16:37:02.114	\N	{"role":"admin"}
785f9e82-9f34-46af-a1c0-094ad8851ffb	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 16:57:57.214	\N	{"role":"admin"}
92c8730d-29ae-455c-8566-2694634764e5	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 19:32:11.06	\N	{"role":"sme"}
316ef77e-35a9-4b62-8d73-ee0c5e107e93	674d623b-c2d4-4648-8115-5d0b1d164865	REGISTRY_VERIFICATION_VIEWED	Certificate SME-CERT-5A78C7ED verification viewed	Certificate	668b4c78-db89-4893-a176-0091759a7594	::1	2026-02-05 19:34:07.957	\N	\N
a4d7b201-3963-43a8-b0cc-903b6c3bbfe3	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-07 12:56:06.469	\N	{"role":"sme"}
9a039229-d6b2-4721-9f4a-9deb42b115ee	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-05 19:35:22.146	\N	\N
d8d28426-2923-46db-97ed-1e2fb9c689d1	674d623b-c2d4-4648-8115-5d0b1d164865	REGISTRY_VERIFICATION_VIEWED	Certificate SME-CERT-2C41732F verification viewed	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-05 19:36:29.552	\N	\N
aa83ba98-f71f-40e4-bc69-cee37046643c	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-05 19:38:22.665	\N	\N
80a40d69-b540-415a-a70c-2a66e54a5793	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 19:38:28.263	\N	\N
4a3c9f21-f2b5-4cab-9b9d-048e8b183cfb	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 19:38:52.359	\N	{"role":"admin"}
feedccf8-7fc6-4e86-8e4c-ad4ee4abb957	674d623b-c2d4-4648-8115-5d0b1d164865	REGISTRY_VERIFICATION_VIEWED	Certificate SME-CERT-5A78C7ED verification viewed	Certificate	668b4c78-db89-4893-a176-0091759a7594	::1	2026-02-05 19:46:09.644	\N	\N
a536af4c-652b-4fe6-aad4-6204e917f4c5	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-05 19:47:16.967	\N	\N
9b76db11-2dad-46d6-b1bc-8f24a36f21c4	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-05 19:51:12.793	\N	{"role":"sme"}
9c608a83-d180-47c4-b834-37906c92e255	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-05 19:51:15.534	\N	\N
be3ab6d2-280a-40e3-bc4e-10753cdb6b4e	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	5.30.9.110	2026-02-05 21:03:39.414	\N	{"role":"admin"}
53762961-5167-4c32-9157-414656d72c85	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	5.30.9.110	2026-02-05 21:05:38.11	\N	\N
114b6137-a3bf-400d-9904-07a2e8d8c056	d88b3155-20b4-4c5d-bb70-f6d5007358b5	USER_REGISTERED	New sme account registered	\N	\N	5.30.9.110	2026-02-05 21:10:16.108	\N	\N
653ac15f-9655-4ea6-9410-e19628afbe94	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	5.30.9.110	2026-02-05 21:15:21.084	\N	{"role":"sme"}
1b49a569-cfba-4f64-86c9-87fb685e006e	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	5.30.9.110	2026-02-05 21:16:27.318	\N	\N
d5c8add6-240c-4a40-a56e-4dae2ef9f73b	674d623b-c2d4-4648-8115-5d0b1d164865	REGISTRY_VERIFICATION_VIEWED	Certificate SME-CERT-2C41732F verification viewed	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	5.30.9.110	2026-02-05 21:16:53.019	\N	\N
794833b4-956a-4369-b9a9-29b8610aa6b8	674d623b-c2d4-4648-8115-5d0b1d164865	REGISTRY_VERIFICATION_VIEWED	Certificate SME-CERT-2C41732F verification viewed	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	5.30.9.110	2026-02-05 21:17:18.319	\N	\N
37a1969b-9e89-48a6-b7f8-409fdf8b2760	674d623b-c2d4-4648-8115-5d0b1d164865	REGISTRY_VERIFICATION_VIEWED	Certificate SME-CERT-2C41732F verification viewed	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	5.30.9.110	2026-02-05 21:18:07.923	\N	\N
ad1855d0-539c-4c4a-9a49-f50048da2ff2	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	94.205.182.163	2026-02-06 10:17:55.051	\N	{"role":"admin"}
075c7cad-3769-468b-8419-96d32262ca2d	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-06 16:10:10.451	\N	\N
2a57d095-bd46-491a-aad3-065c6c925e64	e9152f33-af41-4c15-95f2-2d09b6feb174	USER_REGISTERED	New sme account registered	\N	\N	161.142.154.57	2026-02-06 16:18:57.248	\N	\N
f145b9e7-a7de-430d-ac6c-1454bc8f9298	e9152f33-af41-4c15-95f2-2d09b6feb174	EMAIL_VERIFIED	Email address verified successfully	\N	\N	161.142.154.57	2026-02-06 16:19:05.311	\N	\N
13be316f-1ede-49f2-9d03-64ad8c002f22	e9152f33-af41-4c15-95f2-2d09b6feb174	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 16:19:19.197	\N	{"role":"sme"}
2438e238-823a-4748-b99b-f8988ae65314	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 16:51:56.065	\N	{"role":"sme"}
b751fad4-7680-47e6-bde9-3f3e5c589ba7	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-06 16:51:58.931	\N	\N
dbbfbe79-9d2c-4fb9-ab40-99183f210d4e	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 16:52:10.437	\N	{"role":"user"}
f31fb7b4-37c7-48a6-b711-76cce1aaabda	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_SEARCH	Registry search — 4 results	\N	\N	161.142.154.57	2026-02-06 16:52:11.272	\N	{"search":null,"sector":null,"resultCount":4}
eab82320-6e62-43cf-a728-c16ce8d40cac	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-06 16:52:28.466	\N	\N
921a9c3a-cf6b-4817-aa1b-255e615c4c09	e9152f33-af41-4c15-95f2-2d09b6feb174	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 16:52:42.619	\N	{"role":"sme"}
db2af6db-b308-44ec-817f-c6afe01b5c3c	e9152f33-af41-4c15-95f2-2d09b6feb174	DOCUMENT_UPLOADED	Document uploaded: Trade License	SMEProfile	159197cd-de45-4585-93e1-1b4b284f9ed3	161.142.154.57	2026-02-06 16:58:01.482	\N	\N
a01cea6b-8fc1-4067-8ee7-509d6bea5aae	e9152f33-af41-4c15-95f2-2d09b6feb174	DOCUMENT_DELETED	Document deleted: Trade License	SMEProfile	159197cd-de45-4585-93e1-1b4b284f9ed3	161.142.154.57	2026-02-06 16:58:07.892	\N	\N
91234c64-02da-437f-be08-fcc32c35d0c5	e9152f33-af41-4c15-95f2-2d09b6feb174	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-06 17:05:33.758	\N	\N
70d406a9-f915-4c91-9397-d0fc449e8b5d	e9152f33-af41-4c15-95f2-2d09b6feb174	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 17:05:51.195	\N	{"role":"sme"}
6bf079c0-79ab-4b89-a0dd-782bdf087777	e9152f33-af41-4c15-95f2-2d09b6feb174	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-06 17:43:14.829	\N	\N
28720a09-7faf-4571-9db2-8c763bfc0d70	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 17:43:29.331	\N	{"role":"admin"}
9c4220bd-67ca-4881-8911-193179d9528e	674d623b-c2d4-4648-8115-5d0b1d164865	INTERNAL_REVIEW_UPDATED	Updated internal review for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	161.142.154.57	2026-02-06 17:45:45.391	{"internalDimensions":null,"internalNotes":null}	{"internalDimensions":{"legal_ownership":"ready","financial_discipline":"not_reviewed","business_model":"not_reviewed","governance_controls":"not_reviewed","risk_continuity":"not_reviewed"},"internalNotes":null}
1db34dbb-8dbd-4950-9c2d-3ae392c909d4	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 11:45:08.004	\N	\N
875e0694-00d0-4b7a-8a37-4574ef152b03	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 12:56:09.259	\N	\N
7abf7676-71a4-4349-b898-c7cc4ea77282	22c55feb-de85-421b-bf76-7dd85ab66746	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 14:05:17.6	\N	\N
0f8a32a0-d986-4566-bf83-32eee03fca3f	674d623b-c2d4-4648-8115-5d0b1d164865	INTERNAL_REVIEW_UPDATED	Updated internal review for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	161.142.154.57	2026-02-06 17:45:48.831	{"internalDimensions":{"business_model":"not_reviewed","legal_ownership":"ready","risk_continuity":"not_reviewed","governance_controls":"not_reviewed","financial_discipline":"not_reviewed"},"internalNotes":null}	{"internalDimensions":{"business_model":"not_reviewed","legal_ownership":"not_reviewed","risk_continuity":"not_reviewed","governance_controls":"not_reviewed","financial_discipline":"not_reviewed"},"internalNotes":null}
04a170f0-aa0b-48e9-8be1-284985de840a	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-06 18:02:27.107	\N	\N
682de489-da40-4eb3-9993-be0d7aba63c6	e9152f33-af41-4c15-95f2-2d09b6feb174	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 18:02:48.43	\N	{"role":"sme"}
962813e9-ad77-4c6f-8e4f-d06e06dfc786	e9152f33-af41-4c15-95f2-2d09b6feb174	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-06 18:09:30.544	\N	\N
8af1e51c-6bb5-4712-bfaf-3cfd9a58a1f6	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 18:09:38.584	\N	{"role":"sme"}
6ffde719-e3d9-42f3-8eab-141ad0d5434d	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 18:09:42.131	\N	\N
a3f3e6af-2106-48da-94a4-086f9533c0ae	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	94.205.182.163	2026-02-06 19:55:00.509	\N	{"role":"admin"}
97472e1c-e06f-43ce-980b-192fc8ae6d41	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 19:57:22.302	\N	\N
a811100d-2d41-4849-81b6-bbd843e2c311	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 20:00:30.048	\N	\N
dfde9380-f07e-43a2-a803-af13b25c9ca4	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 20:00:44.443	\N	\N
9aef8faf-e1dc-433e-b932-16e7336c3de8	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 20:05:52.775	\N	\N
8f4e3a26-c3b4-43e3-8865-60e096495a11	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 20:11:05.721	\N	\N
2dc52f83-8ac0-4795-9305-0f3e94f728ee	674d623b-c2d4-4648-8115-5d0b1d164865	REGISTRY_VERIFICATION_VIEWED	Certificate SME-CERT-2C41732F verification viewed	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 20:11:24.177	\N	\N
26dfcd89-45bd-42ff-b8eb-7ab05d37e370	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 20:16:12.846	\N	\N
400d3819-8297-4791-87ee-33ba0f68c738	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 20:19:12.276	\N	\N
b1371de0-d767-44ed-ad9d-0bce159811cf	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 20:22:04.365	\N	\N
a7db1ec3-e402-461e-9081-e3a0befc387e	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-06 20:33:50.071	\N	\N
dd27a185-66b6-4d9e-834e-28575d00fb76	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 20:37:24.849	\N	{"role":"sme"}
c93a0de3-2aa9-43a3-9dcd-d18ddf981b55	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 20:37:29.574	\N	\N
f919c488-3ab1-4c12-ae62-2dc231412c9a	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 21:00:41.208	\N	{"role":"sme"}
8b7a9ac3-5f4b-45b9-b338-b8951ce2ea4a	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.57	2026-02-06 21:00:48.805	\N	\N
5b0ebdc1-a876-4c12-8e61-117e57fdff16	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 21:01:32.04	\N	{"role":"admin"}
726b454d-994d-41e7-a4bf-ba1cffb988f8	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 21:08:06.737	\N	{"role":"admin"}
ae4c6a3a-7e2d-45fc-8472-7abbd3dc01fb	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 21:08:41.942	\N	{"role":"admin"}
d97d04af-f849-4306-a31c-4116efd30d3c	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 21:47:17.234	\N	{"role":"admin"}
e2c216ff-49c1-413a-8049-a6911d1f8389	674d623b-c2d4-4648-8115-5d0b1d164865	PAYMENT_REQUESTED	Requested payment of AED 500.00 from tjara	Payment	e8cf399e-10c0-415c-a3e3-dbe4c35aa775	161.142.154.57	2026-02-06 21:48:52.314	\N	{"paymentId":"PAY-71C00457","amount":500,"smeCompany":"tjara"}
223ee2a1-c4ea-4ebe-8227-bb6e8d7c1f4b	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 21:49:22.136	\N	{"role":"sme"}
a1f60c65-aa9a-431c-a885-54e5036d352a	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 21:57:13.288	\N	{"role":"admin"}
57c347d1-c5d0-4406-873d-89cd4f0d82e2	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 22:33:17.591	\N	{"role":"sme"}
d85d1e88-22e4-4c1d-a48b-5099b8e16179	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 22:33:22.583	\N	\N
0c9c4841-8597-46fc-bfea-ae7d5486e2ac	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATE_VERIFICATION_ATTEMPT	Certificate verification: SUCCESS	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 22:33:33.44	\N	{"result":"SUCCESS","lookupMethod":"CERT_ID","certificateId":"SME-CERT-2C41732F","hashedInput":null,"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36","timestamp":"2026-02-06T22:33:33.440Z"}
e32c3dfa-0924-4e87-98d9-dddccd300f2b	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATE_VERIFICATION_ATTEMPT	Certificate verification: SUCCESS	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 22:34:50.925	\N	{"result":"SUCCESS","lookupMethod":"CERT_ID","certificateId":"SME-CERT-2C41732F","hashedInput":null,"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36","timestamp":"2026-02-06T22:34:50.925Z"}
f78c0ce4-e98d-4146-8565-84dc630733ca	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATE_VERIFICATION_ATTEMPT	Certificate verification: SUCCESS	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.57	2026-02-06 22:36:35.061	\N	{"result":"SUCCESS","lookupMethod":"CERT_ID","certificateId":"SME-CERT-2C41732F","hashedInput":null,"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36","timestamp":"2026-02-06T22:36:35.061Z"}
4149a24b-4714-4020-9a02-1d60e56da159	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-06 22:56:35.273	\N	{"role":"admin"}
17dc5c4a-c34c-43cd-9f03-4eb68abf41b0	674d623b-c2d4-4648-8115-5d0b1d164865	APPLICATIONS_EXPORTED	Admin exported applications data (6 records)	\N	\N	161.142.154.57	2026-02-06 22:57:21.832	\N	\N
7bf2e798-5722-4bab-82cb-1b55dd7f2fee	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.57	2026-02-07 00:02:18.655	\N	{"role":"admin"}
dc6af0a7-690c-4c27-ad6c-91d06bcaaacc	674d623b-c2d4-4648-8115-5d0b1d164865	INTERNAL_REVIEW_UPDATED	Document company_profile status updated to approved	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	161.142.154.57	2026-02-07 00:02:57.917	\N	{"documentId":"doc_1769803012292_dzn6dwtlb","documentType":"company_profile","status":"approved","companyName":"tjara"}
3cbaccf1-ed13-4dad-bf74-1241e66abe14	674d623b-c2d4-4648-8115-5d0b1d164865	INTERNAL_REVIEW_UPDATED	Updated internal review for tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	161.142.154.57	2026-02-07 00:03:10.873	{"internalDimensions":{"business_model":"not_reviewed","legal_ownership":"not_reviewed","risk_continuity":"not_reviewed","governance_controls":"not_reviewed","financial_discipline":"not_reviewed"},"internalNotes":null}	{"internalDimensions":{"business_model":"not_reviewed","legal_ownership":"under_review","risk_continuity":"not_reviewed","governance_controls":"not_reviewed","financial_discipline":"not_reviewed"},"internalNotes":null}
2c3808f0-65c2-40e2-b69a-ca326ff566f7	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	94.205.182.163	2026-02-07 03:56:44.823	\N	{"role":"admin"}
5ba48ac7-8fbb-46ee-b586-4dcba243893a	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-07 06:49:02.722	\N	{"role":"sme"}
fecc3cf3-43c6-461f-a30a-76745c5b7915	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 06:49:08.058	\N	\N
087ab511-f4d7-4364-8862-4ab79c233fb9	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATE_VERIFICATION_ATTEMPT	Certificate verification: SUCCESS	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 06:49:24.414	\N	{"result":"SUCCESS","lookupMethod":"CERT_ID","certificateId":"SME-CERT-2C41732F","hashedInput":null,"userAgent":"Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1","timestamp":"2026-02-07T06:49:24.414Z"}
0f0fb77c-f996-497c-b8ad-2ee60645acba	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-07 07:02:19.832	\N	{"role":"sme"}
422c2cae-c233-4163-a983-71b9eb15e077	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 07:02:22.26	\N	\N
96ac1d6b-e85a-4d1f-be3b-98c738e265c8	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 07:05:39.187	\N	\N
769c2c62-86d6-43b5-b603-f13ea971f0c7	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.175	2026-02-07 07:06:17.845	\N	\N
0883060d-daef-42d1-b926-3ee31cde73e4	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-07 07:06:27.81	\N	{"role":"sme"}
d2b3971f-7f3e-45ec-9b47-ed34b00739be	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 07:06:30.851	\N	\N
7278bd6c-3706-499e-9a98-dfe8e67e94f8	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 07:09:09.979	\N	\N
259b2066-1635-49cd-8cd6-8b3f894d66ef	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 07:11:28.875	\N	\N
5890b444-d1b4-4cbb-93c0-e1fa45d48e47	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 07:15:55.407	\N	\N
4e818d33-683c-46bd-b240-651e353cd982	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATE_VERIFICATION_ATTEMPT	Certificate verification: SUCCESS	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 07:18:59.869	\N	{"result":"SUCCESS","lookupMethod":"CERT_ID","certificateId":"SME-CERT-2C41732F","hashedInput":null,"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36","timestamp":"2026-02-07T07:18:59.869Z"}
1ae9389a-6534-46b5-8436-bf71d113bd95	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-07 07:42:13.778	\N	{"role":"admin"}
f718aa14-d9ef-43e0-bc79-a68a9e6c59db	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.175	2026-02-07 07:42:20.574	\N	\N
4b8fa1f8-cd68-476f-9c95-fa8e997ea15a	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-07 07:42:31.247	\N	{"role":"sme"}
1a15cf3e-133f-4bd7-b35f-5f3c394ef377	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 07:42:35.039	\N	\N
48c1e728-4ee6-4ff1-b176-da3495d25e2e	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	37.245.216.250	2026-02-07 07:51:18.795	\N	{"role":"admin"}
33c02e6e-ba7b-4c6b-888e-c3c53f88b075	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-07 07:57:29.578	\N	{"role":"sme"}
ba6500d5-d263-4a23-9555-6b80bc756a0a	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-07 08:40:10.317	\N	{"role":"sme"}
931c27c2-9da1-4b83-ba8c-73363215712c	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-07 11:41:07.465	\N	{"role":"sme"}
4650d0f4-75f7-4017-8295-e2c5ea71aff6	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 11:41:10.238	\N	\N
b9af60b3-7785-49db-b456-61decbd15af7	eb13f924-6e62-47a6-a3c2-7708e677861c	CERTIFICATE_DOWNLOADED	Downloaded certificate SME-CERT-2C41732F	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	161.142.154.175	2026-02-07 11:43:59.351	\N	\N
b17e4fd9-523c-4f08-8fd5-37af45161ccb	22c55feb-de85-421b-bf76-7dd85ab66746	USER_REGISTERED	New sme account registered	\N	\N	119.73.103.72	2026-02-07 13:06:10.233	\N	\N
f166955b-44fc-4e04-b003-091fb9306e38	22c55feb-de85-421b-bf76-7dd85ab66746	EMAIL_VERIFIED	Email address verified successfully	\N	\N	119.73.103.72	2026-02-07 13:06:49.504	\N	\N
bf190a70-8dfa-43ad-8803-9aedcef55868	22c55feb-de85-421b-bf76-7dd85ab66746	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 13:06:58.463	\N	{"role":"sme"}
b4eeacbb-bdf4-4489-9b73-ff8775a7df22	22c55feb-de85-421b-bf76-7dd85ab66746	LOGO_UPLOADED	Company logo uploaded for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:11:21.43	\N	\N
c0e809b6-df9a-4fb2-a152-f63c0705b120	22c55feb-de85-421b-bf76-7dd85ab66746	PROFILE_UPDATED	SME profile updated	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:11:36.282	\N	\N
f2bf97bc-32c9-4975-a727-f80d9648de7f	22c55feb-de85-421b-bf76-7dd85ab66746	PROFILE_UPDATED	SME profile updated	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:12:06.774	\N	\N
ab109800-05b9-46fb-a5df-15ef20994f2b	22c55feb-de85-421b-bf76-7dd85ab66746	PROFILE_UPDATED	SME profile updated	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:12:31.261	\N	\N
85c98781-e681-4566-9796-522efd376cb4	22c55feb-de85-421b-bf76-7dd85ab66746	PROFILE_UPDATED	SME profile updated	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:12:56.604	\N	\N
272137e6-32c4-4b1a-8c3d-cfa844411876	22c55feb-de85-421b-bf76-7dd85ab66746	PROFILE_UPDATED	SME profile updated	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:13:21.892	\N	\N
c8356480-99a5-4b5e-9d2e-2126dd2c2ecb	22c55feb-de85-421b-bf76-7dd85ab66746	PROFILE_UPDATED	SME profile updated	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:13:48.749	\N	\N
5a7173ba-40e2-46f5-85db-5e61aa3df240	22c55feb-de85-421b-bf76-7dd85ab66746	DOCUMENT_UPLOADED	Document uploaded: Trade License	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:14:22.069	\N	{"documentType":"trade_license","originalName":"5G JOBS.pdf","version":1,"uploadedAt":"2026-02-07T13:14:22.060Z"}
7681af19-6863-4751-9e3d-d090db993507	22c55feb-de85-421b-bf76-7dd85ab66746	DOCUMENT_UPLOADED	Document uploaded: Company Registration Details	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:14:30.511	\N	{"documentType":"company_registration","originalName":"5G JOBS.pdf","version":1,"uploadedAt":"2026-02-07T13:14:30.502Z"}
a169e229-bcfb-43fc-8ec1-4661f0771e25	22c55feb-de85-421b-bf76-7dd85ab66746	DOCUMENT_UPLOADED	Document uploaded: Authorized Signatory ID	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:14:42.815	\N	{"documentType":"signatory_id","originalName":"5G JOBS.pdf","version":1,"uploadedAt":"2026-02-07T13:14:42.808Z"}
60047660-5b4e-4df0-800b-d393523254f6	22c55feb-de85-421b-bf76-7dd85ab66746	DOCUMENT_UPLOADED	Document uploaded: Financial Statements	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:14:51.896	\N	{"documentType":"financial_statements","originalName":"5G JOBS.pdf","version":1,"uploadedAt":"2026-02-07T13:14:51.891Z"}
e82afbfd-8a94-410c-8dcb-9769b4e5f07c	22c55feb-de85-421b-bf76-7dd85ab66746	DOCUMENT_UPLOADED	Document uploaded: Company Profile	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:14:56.889	\N	{"documentType":"company_profile","originalName":"5G JOBS.pdf","version":1,"uploadedAt":"2026-02-07T13:14:56.883Z"}
0741c72b-eabd-473e-8b75-d256ff27d07f	22c55feb-de85-421b-bf76-7dd85ab66746	DOCUMENT_UPLOADED	Document uploaded: UBO Declaration	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:15:23.757	\N	{"documentType":"ubo_declaration","originalName":"5G JOBS.pdf","version":1,"uploadedAt":"2026-02-07T13:15:23.750Z"}
fd79e43c-b2dc-4df4-ab03-1d56834cf18b	22c55feb-de85-421b-bf76-7dd85ab66746	DOCUMENT_UPLOADED	Document uploaded: MOA / Shareholding Structure	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:15:28.284	\N	{"documentType":"moa_shareholding","originalName":"5G JOBS.pdf","version":1,"uploadedAt":"2026-02-07T13:15:28.276Z"}
6540497f-a40b-47d5-b8c1-3fdc2d075bee	22c55feb-de85-421b-bf76-7dd85ab66746	DOCUMENT_UPLOADED	Document uploaded: VAT Registration Certificate	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:15:34.652	\N	{"documentType":"vat_certificate","originalName":"5G JOBS.pdf","version":1,"uploadedAt":"2026-02-07T13:15:34.645Z"}
1d9effc7-7890-4f20-a8b0-f56cbd370d4f	22c55feb-de85-421b-bf76-7dd85ab66746	DOCUMENT_UPLOADED	Document uploaded: Certificate of Incorporation	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:15:38.051	\N	{"documentType":"certificate_of_incorporation","originalName":"5G JOBS.pdf","version":1,"uploadedAt":"2026-02-07T13:15:38.045Z"}
3946487b-49de-428c-a50f-f77c79383f47	22c55feb-de85-421b-bf76-7dd85ab66746	DOCUMENT_UPLOADED	Document uploaded: Licenses / Permits	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:15:46.281	\N	{"documentType":"licenses_permits","originalName":"5G JOBS.pdf","version":1,"uploadedAt":"2026-02-07T13:15:46.272Z"}
220c7874-cf20-4da3-a137-39cc4a3b6b4f	22c55feb-de85-421b-bf76-7dd85ab66746	CERTIFICATION_SUBMITTED	Certification application submitted for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:15:59.884	\N	\N
1acd464a-d171-4eb6-b3eb-57df202ce232	22c55feb-de85-421b-bf76-7dd85ab66746	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 13:18:05.137	\N	\N
18088fd8-259c-4765-a779-485005c2e887	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 13:19:54.546	\N	{"role":"admin"}
720b30e6-90e4-4a4e-aa14-8052a1830265	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:20:49.602	\N	{"status":"under_review"}
7c016b3a-dba0-49c0-b21b-566841adb31c	22c55feb-de85-421b-bf76-7dd85ab66746	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 14:05:05.024	\N	{"role":"sme"}
1a355ce3-61cd-4431-bd68-c075eefaf083	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_REQUEST_REVISION	Requested revision for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:22:41.146	\N	{"status":"revision_requested","notes":"testing"}
9b0a5207-bf3a-4a35-b8d6-31fdaf3e20aa	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 13:25:18.918	\N	\N
0bed1462-892b-4531-be11-8e69be4d52f3	22c55feb-de85-421b-bf76-7dd85ab66746	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 13:25:27.647	\N	{"role":"sme"}
4b96e8ad-f09c-41a4-bb58-a426f580ba80	22c55feb-de85-421b-bf76-7dd85ab66746	CERTIFICATION_SUBMITTED	Certification application submitted for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:25:56.509	\N	\N
dae55c51-9763-4706-84db-23295ac77a5a	22c55feb-de85-421b-bf76-7dd85ab66746	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 13:27:37.112	\N	\N
c09fcf67-7a54-4a2e-b25f-56d5fc3a77d3	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 13:28:09.47	\N	{"role":"admin"}
5c1ce58b-bdd6-43be-8012-0fb2373dc50d	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:28:22.372	\N	{"status":"under_review"}
3ff8d74f-d719-488e-8a3a-29248e1e774d	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_APPROVE	Approved certification for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 13:45:34.854	\N	{"status":"certified"}
9481aaf3-3691-40b2-8c4d-f239a393c6a6	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATE_ISSUED	Issued certificate SME-CERT-FC5B0684 for Al Noor Technologies	Certificate	00607336-5e25-4c7a-8cd4-3c356a19d16d	119.73.103.72	2026-02-07 13:45:34.855	\N	{"certificateId":"SME-CERT-FC5B0684","version":"v1.0","expiresAt":"2027-02-07T13:45:34.847Z"}
62285def-1680-46ee-ad48-9a9dcc0994be	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 13:47:40.175	\N	\N
6a6b9a3a-5c56-4a8b-a5aa-1c1a4385d7cb	cb56dd57-504f-4e19-99c0-e457999c5665	USER_REGISTERED	New user account registered	\N	\N	119.73.103.72	2026-02-07 13:48:54.824	\N	\N
55e43456-2858-4cf9-9b46-03a86641b881	cb56dd57-504f-4e19-99c0-e457999c5665	EMAIL_VERIFIED	Email address verified successfully	\N	\N	119.73.103.72	2026-02-07 13:49:19.149	\N	\N
696e3d04-dfc6-4500-a224-f96c9b3bccbe	cb56dd57-504f-4e19-99c0-e457999c5665	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 13:49:22.77	\N	{"role":"user"}
ce3bab54-ec00-4153-9360-017309363e3e	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 13:49:23.769	\N	{"search":null,"sector":null,"resultCount":5}
372bc0d2-4678-4306-aa86-b8ea30ecd45d	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 13:49:45.775	\N	{"search":null,"sector":null,"resultCount":5}
ac922428-10e6-4f7c-bacf-5c194dd25d8d	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 13:50:08.415	\N	{"search":null,"sector":null,"resultCount":5}
374b541e-3a9a-4b84-82e2-5eb83fc0ba29	cb56dd57-504f-4e19-99c0-e457999c5665	PROFILE_PICTURE_UPDATED	Updated profile picture	User	cb56dd57-504f-4e19-99c0-e457999c5665	119.73.103.72	2026-02-07 13:50:42.545	\N	\N
00daeb5d-34bb-4967-8420-6975c5836fca	cb56dd57-504f-4e19-99c0-e457999c5665	PROFILE_UPDATED	Updated user profile	User	cb56dd57-504f-4e19-99c0-e457999c5665	119.73.103.72	2026-02-07 13:50:55.678	\N	\N
5410d435-67bf-4417-8e71-de2a1a0c1775	cb56dd57-504f-4e19-99c0-e457999c5665	KYC_SUBMITTED	Submitted individual investor KYC	UserProfile	cb56dd57-504f-4e19-99c0-e457999c5665	119.73.103.72	2026-02-07 14:00:26.415	\N	\N
8d626f4d-1774-4753-b2ac-53f3f79603ce	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:00:34.156	\N	{"search":null,"sector":null,"resultCount":5}
a663fdca-f2ea-43f6-aee4-caff4b62a008	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:00:38.317	\N	{"search":null,"sector":null,"resultCount":5}
f6e24eff-fe39-4da8-b847-79ab1865ba04	cb56dd57-504f-4e19-99c0-e457999c5665	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 14:00:48.162	\N	\N
46bd8d35-0c7b-4b72-842a-9a6ce80a8986	cb56dd57-504f-4e19-99c0-e457999c5665	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 14:01:30.601	\N	{"role":"user"}
d37212e4-7c64-4671-b659-b3836f8314bf	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:01:30.795	\N	{"search":null,"sector":null,"resultCount":5}
6ff58218-5ac9-483f-ad59-d7d5c19bc3b1	cb56dd57-504f-4e19-99c0-e457999c5665	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 14:01:32.745	\N	\N
365ed3c0-ce4a-44c6-8a4d-2413629fa315	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 14:01:38.702	\N	{"role":"admin"}
9ee56fc1-9d31-4696-822b-0aa13fdc6349	674d623b-c2d4-4648-8115-5d0b1d164865	KYC_REQUEST_REVISION	Requested KYC revision for investor Parisa Pari	UserProfile	b8c7b643-7d83-4b7c-a425-72fa717e5c76	119.73.103.72	2026-02-07 14:02:16.956	\N	{"status":"revision_requested","notes":"testing"}
3669c03c-4348-441c-b7ba-62449a2a39bb	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 14:04:58.816	\N	\N
09b54d83-12a7-43d1-b307-f0cdd7e1b703	cb56dd57-504f-4e19-99c0-e457999c5665	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 14:05:21.27	\N	{"role":"user"}
c49c5dad-dec8-4511-ae49-8dd4a83262ae	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:05:21.444	\N	{"search":null,"sector":null,"resultCount":5}
e89bc022-a3e0-4117-8a78-c729870c1ace	cb56dd57-504f-4e19-99c0-e457999c5665	KYC_SUBMITTED	Submitted individual investor KYC	UserProfile	cb56dd57-504f-4e19-99c0-e457999c5665	119.73.103.72	2026-02-07 14:05:35.778	\N	\N
2b0556f1-19b9-4063-ab99-76dcdc46256c	cb56dd57-504f-4e19-99c0-e457999c5665	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 14:05:41.61	\N	\N
f07d9aa2-589d-4fc7-9c23-582037db233a	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 14:05:47.296	\N	{"role":"admin"}
0cf713c2-4ebe-4b02-ac16-047dd3fca0c1	674d623b-c2d4-4648-8115-5d0b1d164865	KYC_APPROVE	Approved KYC for investor Parisa Pari	UserProfile	b8c7b643-7d83-4b7c-a425-72fa717e5c76	119.73.103.72	2026-02-07 14:05:55.401	\N	{"status":"approved","notes":null}
e637a6b2-c145-43bc-ab3f-d13bc39a106c	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 14:06:04.6	\N	\N
b8311b49-5d8a-48a7-a197-fed6f592ef41	cb56dd57-504f-4e19-99c0-e457999c5665	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 14:06:08.087	\N	{"role":"user"}
2657171b-9d9d-4771-9b2b-e641096ca651	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:06:08.479	\N	{"search":null,"sector":null,"resultCount":5}
ab49247e-9ac3-4394-9401-ad6d323e6b24	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:06:11.605	\N	{"search":null,"sector":null,"resultCount":5}
fd0953bf-9102-4ac4-ae8c-d4d127f413e0	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:06:17.999	\N	{"search":null,"sector":null,"resultCount":5}
ad5cc8e1-0043-47d8-9ef3-d7aeba4fad6e	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:06:21.515	\N	{"search":null,"sector":null,"resultCount":5}
9f361b12-2d05-460e-a9b3-af31c7a24160	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_VIEW	Viewed registry profile: Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 14:06:27	\N	\N
d4ef0103-0438-416d-8481-f07b1a5ec55d	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:07:49.562	\N	{"search":null,"sector":null,"resultCount":5}
a0dfd112-e071-41a5-af13-2584380c830b	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_VIEW	Viewed registry profile: Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 14:08:02.802	\N	\N
e610fe83-ba63-49b2-964b-f4d279b60199	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:08:43.411	\N	{"search":null,"sector":null,"resultCount":5}
67602a02-90e9-41a0-82f3-57c10c97dd38	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_VIEW	Viewed registry profile: Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	119.73.103.72	2026-02-07 14:08:46.222	\N	\N
58c084b9-8e5b-4669-abd6-9d559a97e667	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:09:11.248	\N	{"search":null,"sector":null,"resultCount":5}
d70e2d09-4c89-4bef-930d-ea636fb5cb07	cb56dd57-504f-4e19-99c0-e457999c5665	PROFILE_UPDATED	Updated user profile	User	cb56dd57-504f-4e19-99c0-e457999c5665	119.73.103.72	2026-02-07 14:09:21.32	\N	\N
eddf73e0-92d3-4c8f-b132-288a934ef728	cb56dd57-504f-4e19-99c0-e457999c5665	PROFILE_UPDATED	Updated user profile	User	cb56dd57-504f-4e19-99c0-e457999c5665	119.73.103.72	2026-02-07 14:09:23.071	\N	\N
2e8c5ef8-3aff-4fdb-9d9f-a74569903439	cb56dd57-504f-4e19-99c0-e457999c5665	PROFILE_UPDATED	Updated user profile	User	cb56dd57-504f-4e19-99c0-e457999c5665	119.73.103.72	2026-02-07 14:09:24.265	\N	\N
244c885a-288e-4595-87b1-487580004729	cb56dd57-504f-4e19-99c0-e457999c5665	PROFILE_UPDATED	Updated user profile	User	cb56dd57-504f-4e19-99c0-e457999c5665	119.73.103.72	2026-02-07 14:09:25.272	\N	\N
c4e542b7-650e-47db-a6af-17efaff87cf4	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:09:28.264	\N	{"search":null,"sector":null,"resultCount":5}
6f7adf91-29a6-45c4-b22f-d3ff36d22d05	cb56dd57-504f-4e19-99c0-e457999c5665	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 14:09:32.16	\N	\N
6101dfca-273d-4fb8-9750-707e010b633f	cb56dd57-504f-4e19-99c0-e457999c5665	USER_LOGIN	User logged in successfully	\N	\N	119.73.103.72	2026-02-07 14:09:34.178	\N	{"role":"user"}
26fa0b29-302f-4cf2-a7a0-1d67e44f4818	cb56dd57-504f-4e19-99c0-e457999c5665	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	119.73.103.72	2026-02-07 14:09:34.356	\N	{"search":null,"sector":null,"resultCount":5}
17e1044e-8b77-40df-bc90-46341aa615a9	cb56dd57-504f-4e19-99c0-e457999c5665	USER_LOGOUT	User logged out	\N	\N	119.73.103.72	2026-02-07 14:09:42.44	\N	\N
0ab303b6-dfbe-4ccf-8cd1-ec54c2138fb4	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.175	2026-02-07 15:53:57.366	\N	\N
cc82bcdc-c95b-47ea-b9e8-080d201a0681	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-07 15:55:30.408	\N	{"role":"admin"}
ae0b966d-c5ee-45f5-9b4d-71f15854a3ca	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_PAGE_UPDATED	Updated legal page: certification-standards	LegalPage	cert-standards-001	161.142.154.175	2026-02-07 15:55:58.296	{"title":"Certification Standards","content":"## 1. Purpose of Certification\\n\\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\\n\\nCertification is intende"}	{"title":"Certification Standards","content":"## 1. Purpose of Certification\\n\\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\\n\\nCertification is intende"}
98c36131-53a7-460c-834f-ca4ae42c29cb	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_PAGE_UPDATED	Updated legal page: certification-standards	LegalPage	cert-standards-001	161.142.154.175	2026-02-07 15:56:05.579	{"title":"Certification Standards","content":"## 1. Purpose of Certification\\n\\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\\n\\nCertification is intende"}	{"title":"Certification Standards","content":"## 1. Purpose of Certification\\n\\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\\n\\nCertification is intende"}
6557121f-9917-4227-b57f-58530d8fec0c	17f046a0-8c7f-45e7-84b2-5941c5189375	EMAIL_SENT	Email sent: legal_update to user@example.com	User	17f046a0-8c7f-45e7-84b2-5941c5189375	\N	2026-02-07 15:56:21.333	\N	{"recipientEmail":"user@example.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
8266e113-ac0d-488e-80a0-d29177e5cfe7	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.175	2026-02-08 08:16:07.242	\N	\N
30615c79-0f8b-41a5-86ee-d7d8e2ee180c	3bd38396-3d04-4b86-812c-4958e6cff136	EMAIL_SENT	Email sent: legal_update to user2@example.com	User	3bd38396-3d04-4b86-812c-4958e6cff136	\N	2026-02-07 15:56:23.165	\N	{"recipientEmail":"user2@example.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
793161b9-2fc5-4189-b31f-625c5e6fade7	9a29bfa2-6177-45a8-a308-61c1f34fb13b	EMAIL_SENT	Email sent: legal_update to sme@techstartup.ae	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	\N	2026-02-07 15:56:26.395	\N	{"recipientEmail":"sme@techstartup.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
94ab253e-70fb-4970-beaf-ccf385a8a0e1	c4bf6f2a-e8d1-43c5-96fc-088387e93232	EMAIL_SENT	Email sent: legal_update to sme@healthplus.ae	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	\N	2026-02-07 15:56:28.845	\N	{"recipientEmail":"sme@healthplus.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
10352f9e-1ae9-408d-bab5-3f27b7fb2d1b	0c7a2ae9-b24b-4741-962b-10155a4131d6	EMAIL_SENT	Email sent: legal_update to sme@retailhub.ae	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	\N	2026-02-07 15:56:30.121	\N	{"recipientEmail":"sme@retailhub.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
969fa13f-71f6-4583-8403-53d237c83402	f7677afa-4185-4c3f-ae44-aadd4ce6d886	EMAIL_SENT	Email sent: legal_update to sme@newbusiness.ae	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	\N	2026-02-07 15:56:31.503	\N	{"recipientEmail":"sme@newbusiness.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
4916a5b4-f680-431e-ad54-40ba027958b4	0918869a-495b-490d-95f2-604131cd34c9	EMAIL_SENT	Email sent: legal_update to sme@constructco.ae	User	0918869a-495b-490d-95f2-604131cd34c9	\N	2026-02-07 15:56:33.753	\N	{"recipientEmail":"sme@constructco.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
b22ff493-77dc-4362-b285-84a978744144	e873e8bb-4435-4562-b595-59ba8898c092	EMAIL_SENT	Email sent: legal_update to aqsariasat235@gmail.com	User	e873e8bb-4435-4562-b595-59ba8898c092	\N	2026-02-07 15:56:35.22	\N	{"recipientEmail":"aqsariasat235@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
9a291591-8571-4f99-b32b-c47d93e1c26d	0aa46452-b94e-481e-87c6-390d50c821b2	EMAIL_SENT	Email sent: legal_update to catalyst@theredstone.ai	User	0aa46452-b94e-481e-87c6-390d50c821b2	\N	2026-02-07 15:56:36.556	\N	{"recipientEmail":"catalyst@theredstone.ai","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
f3fd27a4-62ce-4be7-9f5d-49294fedef38	d20849a8-e976-4711-8e27-bc530aed0c4a	EMAIL_SENT	Email sent: legal_update to parisapari4u53@gmail.com	User	d20849a8-e976-4711-8e27-bc530aed0c4a	\N	2026-02-07 15:56:37.918	\N	{"recipientEmail":"parisapari4u53@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
cf5585bf-9898-417f-a2c2-d73f61dbeb9a	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	EMAIL_SENT	Email sent: legal_update to elishagill166@gmail.com	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	\N	2026-02-07 15:56:41.104	\N	{"recipientEmail":"elishagill166@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
228d87c3-74ec-4ccc-a5da-42fd91dac63d	258cb6d6-85be-4e4f-9830-107bac843987	EMAIL_SENT	Email sent: legal_update to rayasatmuhammad64@gmail.com	User	258cb6d6-85be-4e4f-9830-107bac843987	\N	2026-02-07 15:56:42.149	\N	{"recipientEmail":"rayasatmuhammad64@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
3b38ba4b-8f61-4027-ae95-99ae2bc6a78f	eb13f924-6e62-47a6-a3c2-7708e677861c	EMAIL_SENT	Email sent: legal_update to email@theredstone.ai	User	eb13f924-6e62-47a6-a3c2-7708e677861c	\N	2026-02-07 15:56:45.298	\N	{"recipientEmail":"email@theredstone.ai","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
1285acf4-7ece-4856-abf5-47f458223664	e9152f33-af41-4c15-95f2-2d09b6feb174	EMAIL_SENT	Email sent: legal_update to arbazkhan164598@gmail.com	User	e9152f33-af41-4c15-95f2-2d09b6feb174	\N	2026-02-07 15:56:46.572	\N	{"recipientEmail":"arbazkhan164598@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
3a88a060-7eaf-4a70-b365-446f82e9c16b	cb56dd57-504f-4e19-99c0-e457999c5665	EMAIL_SENT	Email sent: legal_update to soniarabbani2166@gmail.com	User	cb56dd57-504f-4e19-99c0-e457999c5665	\N	2026-02-07 15:56:49.647	\N	{"recipientEmail":"soniarabbani2166@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
83d87f1e-0761-4f4c-8027-7dab2d707049	22c55feb-de85-421b-bf76-7dd85ab66746	EMAIL_SENT	Email sent: legal_update to parisaumerkhalil@gmail.com	User	22c55feb-de85-421b-bf76-7dd85ab66746	\N	2026-02-07 15:56:50.827	\N	{"recipientEmail":"parisaumerkhalil@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
0eae7658-338f-477c-b51b-ed9502c53102	674d623b-c2d4-4648-8115-5d0b1d164865	EMAIL_SENT	Email sent: legal_update to admin@smecert.ae	User	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-07 15:56:52.972	\N	{"recipientEmail":"admin@smecert.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
2d4d872f-9483-41aa-94c3-73fb7fc117dc	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_UPDATE_NOTIFIED	Sent legal update notification for "Certification Standards" to 17 users	LegalPage	\N	\N	2026-02-07 15:56:52.98	\N	{"pageName":"Certification Standards","pageSlug":"certification-standards","sent":17,"failed":0,"totalUsers":17}
523f5d95-7e58-460b-a7c3-2f7a0051bb35	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_PAGE_UPDATED	Updated legal page: certification-standards	LegalPage	cert-standards-001	161.142.154.175	2026-02-07 16:04:14.571	{"title":"Certification Standards","content":"## 1. Purpose of Certification\\n\\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\\n\\nCertification is intende"}	{"title":"Certification Standards","content":"## 1. Purpose of Certification\\n\\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\\n\\nCertification is intende"}
a7b341ac-ab8b-49c2-9700-179a2e3efee1	17f046a0-8c7f-45e7-84b2-5941c5189375	EMAIL_SENT	Email sent: legal_update to user@example.com	User	17f046a0-8c7f-45e7-84b2-5941c5189375	\N	2026-02-07 16:04:22.054	\N	{"recipientEmail":"user@example.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
d71632e5-b106-4dc1-8b8c-dfe62fb52d6a	3bd38396-3d04-4b86-812c-4958e6cff136	EMAIL_SENT	Email sent: legal_update to user2@example.com	User	3bd38396-3d04-4b86-812c-4958e6cff136	\N	2026-02-07 16:04:25.51	\N	{"recipientEmail":"user2@example.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
ff026143-54d0-4c46-a074-9ad96b8f12bd	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-08 08:17:25.207	\N	{"role":"admin"}
27b1d79d-cf19-47b1-8c3f-5c6ce47e37cd	9a29bfa2-6177-45a8-a308-61c1f34fb13b	EMAIL_SENT	Email sent: legal_update to sme@techstartup.ae	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	\N	2026-02-07 16:04:27.908	\N	{"recipientEmail":"sme@techstartup.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
578c1ea5-8b5c-42eb-a804-0f1b0d31d8eb	c4bf6f2a-e8d1-43c5-96fc-088387e93232	EMAIL_SENT	Email sent: legal_update to sme@healthplus.ae	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	\N	2026-02-07 16:04:29.48	\N	{"recipientEmail":"sme@healthplus.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
1a7c78cc-04b5-44d7-b3d5-b740063bb9bb	0c7a2ae9-b24b-4741-962b-10155a4131d6	EMAIL_SENT	Email sent: legal_update to sme@retailhub.ae	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	\N	2026-02-07 16:04:30.671	\N	{"recipientEmail":"sme@retailhub.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
9f28eb17-ae10-468a-9e98-3810e398132c	f7677afa-4185-4c3f-ae44-aadd4ce6d886	EMAIL_SENT	Email sent: legal_update to sme@newbusiness.ae	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	\N	2026-02-07 16:04:32.096	\N	{"recipientEmail":"sme@newbusiness.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
91605d04-22f3-4541-b0af-add4c103e19e	0918869a-495b-490d-95f2-604131cd34c9	EMAIL_SENT	Email sent: legal_update to sme@constructco.ae	User	0918869a-495b-490d-95f2-604131cd34c9	\N	2026-02-07 16:04:33.946	\N	{"recipientEmail":"sme@constructco.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
2e908573-2afb-4d7b-a0b7-d78e43ea340a	e873e8bb-4435-4562-b595-59ba8898c092	EMAIL_SENT	Email sent: legal_update to aqsariasat235@gmail.com	User	e873e8bb-4435-4562-b595-59ba8898c092	\N	2026-02-07 16:04:36.938	\N	{"recipientEmail":"aqsariasat235@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
ddeb463f-9713-4586-8d13-4ac8cd538777	0aa46452-b94e-481e-87c6-390d50c821b2	EMAIL_SENT	Email sent: legal_update to catalyst@theredstone.ai	User	0aa46452-b94e-481e-87c6-390d50c821b2	\N	2026-02-07 16:04:38.672	\N	{"recipientEmail":"catalyst@theredstone.ai","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
0880c413-c3d7-4fe9-8437-839d25c5469f	d20849a8-e976-4711-8e27-bc530aed0c4a	EMAIL_SENT	Email sent: legal_update to parisapari4u53@gmail.com	User	d20849a8-e976-4711-8e27-bc530aed0c4a	\N	2026-02-07 16:04:40.015	\N	{"recipientEmail":"parisapari4u53@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
bdf74c02-3deb-4e01-b51d-d702cc8de1e4	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	EMAIL_SENT	Email sent: legal_update to elishagill166@gmail.com	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	\N	2026-02-07 16:04:41.216	\N	{"recipientEmail":"elishagill166@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
2ac6b6db-5d81-4897-9e99-b518fda0c41b	258cb6d6-85be-4e4f-9830-107bac843987	EMAIL_SENT	Email sent: legal_update to rayasatmuhammad64@gmail.com	User	258cb6d6-85be-4e4f-9830-107bac843987	\N	2026-02-07 16:04:42.628	\N	{"recipientEmail":"rayasatmuhammad64@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
5d93e480-78b7-4963-bd10-15d332e93b08	eb13f924-6e62-47a6-a3c2-7708e677861c	EMAIL_SENT	Email sent: legal_update to email@theredstone.ai	User	eb13f924-6e62-47a6-a3c2-7708e677861c	\N	2026-02-07 16:04:44.352	\N	{"recipientEmail":"email@theredstone.ai","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
116b3472-ccd3-4d61-add3-8087e400cc16	e9152f33-af41-4c15-95f2-2d09b6feb174	EMAIL_SENT	Email sent: legal_update to arbazkhan164598@gmail.com	User	e9152f33-af41-4c15-95f2-2d09b6feb174	\N	2026-02-07 16:04:46.574	\N	{"recipientEmail":"arbazkhan164598@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
b3c6a6fe-7dba-4992-8c11-0bae8f16c6f5	cb56dd57-504f-4e19-99c0-e457999c5665	EMAIL_SENT	Email sent: legal_update to soniarabbani2166@gmail.com	User	cb56dd57-504f-4e19-99c0-e457999c5665	\N	2026-02-07 16:04:48.706	\N	{"recipientEmail":"soniarabbani2166@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
2ba71df9-a454-4a8d-9321-400ea0dd12a3	22c55feb-de85-421b-bf76-7dd85ab66746	EMAIL_SENT	Email sent: legal_update to parisaumerkhalil@gmail.com	User	22c55feb-de85-421b-bf76-7dd85ab66746	\N	2026-02-07 16:04:51.002	\N	{"recipientEmail":"parisaumerkhalil@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
4fdf42c1-c1b0-48e0-ba9a-94600c2f7558	674d623b-c2d4-4648-8115-5d0b1d164865	EMAIL_SENT	Email sent: legal_update to admin@smecert.ae	User	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-07 16:04:52.37	\N	{"recipientEmail":"admin@smecert.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
e82bffd2-ff84-4f05-b725-72bf6024e44d	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_UPDATE_NOTIFIED	Sent legal update notification for "Certification Standards" to 17 users	LegalPage	\N	\N	2026-02-07 16:04:52.378	\N	{"pageName":"Certification Standards","pageSlug":"certification-standards","sent":17,"failed":0,"totalUsers":17}
94067aba-067f-4ec1-8ac8-d10c2f3327f0	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_PAGE_UPDATED	Updated legal page: certification-standards	LegalPage	cert-standards-001	161.142.154.175	2026-02-07 16:09:23.782	{"title":"Certification Standards","content":"## 1. Purpose of Certification\\n\\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\\n\\nCertification is intende"}	{"title":"Certification Standards","content":"## 1. Purpose of Certification\\n\\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\\n\\nCertification is intende"}
cd748a0f-a6c7-40be-b559-4128cfac65e0	17f046a0-8c7f-45e7-84b2-5941c5189375	EMAIL_SENT	Email sent: legal_update to user@example.com	User	17f046a0-8c7f-45e7-84b2-5941c5189375	\N	2026-02-07 16:09:27.997	\N	{"recipientEmail":"user@example.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
5f39e8a3-dcfe-4af1-9c5a-724981c4993a	3bd38396-3d04-4b86-812c-4958e6cff136	EMAIL_SENT	Email sent: legal_update to user2@example.com	User	3bd38396-3d04-4b86-812c-4958e6cff136	\N	2026-02-07 16:09:30.125	\N	{"recipientEmail":"user2@example.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
bc1deb58-cec3-43ad-bb8b-2a2ed6d3cd95	9a29bfa2-6177-45a8-a308-61c1f34fb13b	EMAIL_SENT	Email sent: legal_update to sme@techstartup.ae	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	\N	2026-02-07 16:09:33.334	\N	{"recipientEmail":"sme@techstartup.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
24b4b1cc-c0ef-4988-b4f2-3bf43a918cc3	c4bf6f2a-e8d1-43c5-96fc-088387e93232	EMAIL_SENT	Email sent: legal_update to sme@healthplus.ae	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	\N	2026-02-07 16:09:35.552	\N	{"recipientEmail":"sme@healthplus.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
4e1c76e6-db1b-4330-a076-1a8a148eb7c2	0c7a2ae9-b24b-4741-962b-10155a4131d6	EMAIL_SENT	Email sent: legal_update to sme@retailhub.ae	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	\N	2026-02-07 16:09:37.489	\N	{"recipientEmail":"sme@retailhub.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
2c1c91e9-7d0f-4e77-b7be-42226162374e	f7677afa-4185-4c3f-ae44-aadd4ce6d886	EMAIL_SENT	Email sent: legal_update to sme@newbusiness.ae	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	\N	2026-02-07 16:09:38.798	\N	{"recipientEmail":"sme@newbusiness.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
96cbccb8-b5f5-4d39-a1e4-2e72b9459945	0918869a-495b-490d-95f2-604131cd34c9	EMAIL_SENT	Email sent: legal_update to sme@constructco.ae	User	0918869a-495b-490d-95f2-604131cd34c9	\N	2026-02-07 16:09:40.813	\N	{"recipientEmail":"sme@constructco.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
f20927c1-2b35-4e86-b4e4-9d74a1a47e71	e873e8bb-4435-4562-b595-59ba8898c092	EMAIL_SENT	Email sent: legal_update to aqsariasat235@gmail.com	User	e873e8bb-4435-4562-b595-59ba8898c092	\N	2026-02-07 16:09:41.816	\N	{"recipientEmail":"aqsariasat235@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
df668a3b-c906-4673-9866-74a4d2e96403	0aa46452-b94e-481e-87c6-390d50c821b2	EMAIL_SENT	Email sent: legal_update to catalyst@theredstone.ai	User	0aa46452-b94e-481e-87c6-390d50c821b2	\N	2026-02-07 16:09:42.795	\N	{"recipientEmail":"catalyst@theredstone.ai","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
25e36fcb-e4d4-4e9c-b2e3-7c2ce604f8b0	d20849a8-e976-4711-8e27-bc530aed0c4a	EMAIL_SENT	Email sent: legal_update to parisapari4u53@gmail.com	User	d20849a8-e976-4711-8e27-bc530aed0c4a	\N	2026-02-07 16:09:44.765	\N	{"recipientEmail":"parisapari4u53@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
e5081c46-ec5e-4611-878b-d885e1b1b122	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	EMAIL_SENT	Email sent: legal_update to elishagill166@gmail.com	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	\N	2026-02-07 16:09:46.667	\N	{"recipientEmail":"elishagill166@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
50a72a89-c4dc-493f-a61c-56c0a751dcf2	258cb6d6-85be-4e4f-9830-107bac843987	EMAIL_SENT	Email sent: legal_update to rayasatmuhammad64@gmail.com	User	258cb6d6-85be-4e4f-9830-107bac843987	\N	2026-02-07 16:09:48.644	\N	{"recipientEmail":"rayasatmuhammad64@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
c62ef951-93d7-4339-a98c-6cad171feb5e	eb13f924-6e62-47a6-a3c2-7708e677861c	EMAIL_SENT	Email sent: legal_update to email@theredstone.ai	User	eb13f924-6e62-47a6-a3c2-7708e677861c	\N	2026-02-07 16:09:50.4	\N	{"recipientEmail":"email@theredstone.ai","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
b3908621-ebeb-4828-b8d2-ad5315fb0ac4	e9152f33-af41-4c15-95f2-2d09b6feb174	EMAIL_SENT	Email sent: legal_update to arbazkhan164598@gmail.com	User	e9152f33-af41-4c15-95f2-2d09b6feb174	\N	2026-02-07 16:09:51.57	\N	{"recipientEmail":"arbazkhan164598@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
56f38ffc-892d-46f8-ad55-3cbf4eacbd04	cb56dd57-504f-4e19-99c0-e457999c5665	EMAIL_SENT	Email sent: legal_update to soniarabbani2166@gmail.com	User	cb56dd57-504f-4e19-99c0-e457999c5665	\N	2026-02-07 16:09:53.897	\N	{"recipientEmail":"soniarabbani2166@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
f220ada0-4114-4e2c-9470-a265d4d3e9bf	22c55feb-de85-421b-bf76-7dd85ab66746	EMAIL_SENT	Email sent: legal_update to parisaumerkhalil@gmail.com	User	22c55feb-de85-421b-bf76-7dd85ab66746	\N	2026-02-07 16:09:54.978	\N	{"recipientEmail":"parisaumerkhalil@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
6f34b19c-9d23-4bdf-951d-faf699359fa3	674d623b-c2d4-4648-8115-5d0b1d164865	EMAIL_SENT	Email sent: legal_update to admin@smecert.ae	User	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-07 16:09:57.2	\N	{"recipientEmail":"admin@smecert.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
d1ef014f-6e27-445b-84b8-2ce94765e4f4	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_UPDATE_NOTIFIED	Sent legal update notification for "Certification Standards" to 17 users	LegalPage	\N	\N	2026-02-07 16:09:57.21	\N	{"pageName":"Certification Standards","pageSlug":"certification-standards","sent":17,"failed":0,"totalUsers":17}
28d94a8f-cf43-4daa-a374-0cefbeaccd04	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_PAGE_UPDATED	Updated legal page: certification-standards	LegalPage	cert-standards-001	161.142.154.175	2026-02-07 16:10:42.306	{"title":"Certification Standards","content":"## 1. Purpose of Certification\\n\\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\\n\\nCertification is intende"}	{"title":"Certification Standards","content":"## 1. Purpose of Certification\\n\\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\\n\\nCertification is intende"}
69e863b0-b2b0-4516-a9b5-db0d4466aa73	17f046a0-8c7f-45e7-84b2-5941c5189375	EMAIL_SENT	Email sent: legal_update to user@example.com	User	17f046a0-8c7f-45e7-84b2-5941c5189375	\N	2026-02-07 16:10:50.442	\N	{"recipientEmail":"user@example.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
daa0ceac-1994-4db0-a943-26a2a4b79a67	3bd38396-3d04-4b86-812c-4958e6cff136	EMAIL_SENT	Email sent: legal_update to user2@example.com	User	3bd38396-3d04-4b86-812c-4958e6cff136	\N	2026-02-07 16:10:51.771	\N	{"recipientEmail":"user2@example.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
faa40130-8db6-4981-97a0-5692244e2c92	9a29bfa2-6177-45a8-a308-61c1f34fb13b	EMAIL_SENT	Email sent: legal_update to sme@techstartup.ae	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	\N	2026-02-07 16:10:54.002	\N	{"recipientEmail":"sme@techstartup.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
2dbd3cbf-cde4-4db5-be3a-3c78b0ff65ad	c4bf6f2a-e8d1-43c5-96fc-088387e93232	EMAIL_SENT	Email sent: legal_update to sme@healthplus.ae	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	\N	2026-02-07 16:10:55.303	\N	{"recipientEmail":"sme@healthplus.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
5616d53b-876d-44e9-a404-a25eeda5ed63	0c7a2ae9-b24b-4741-962b-10155a4131d6	EMAIL_SENT	Email sent: legal_update to sme@retailhub.ae	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	\N	2026-02-07 16:10:58.067	\N	{"recipientEmail":"sme@retailhub.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
c0726a80-9787-42a8-a313-1d8b61f00b1d	f7677afa-4185-4c3f-ae44-aadd4ce6d886	EMAIL_SENT	Email sent: legal_update to sme@newbusiness.ae	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	\N	2026-02-07 16:10:59.069	\N	{"recipientEmail":"sme@newbusiness.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
0537a4c9-042d-4a7b-b3af-a6c98b7539d5	0918869a-495b-490d-95f2-604131cd34c9	EMAIL_SENT	Email sent: legal_update to sme@constructco.ae	User	0918869a-495b-490d-95f2-604131cd34c9	\N	2026-02-07 16:11:00.952	\N	{"recipientEmail":"sme@constructco.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
5f45ad0a-fae7-4e97-a21f-b2cea606b578	e873e8bb-4435-4562-b595-59ba8898c092	EMAIL_SENT	Email sent: legal_update to aqsariasat235@gmail.com	User	e873e8bb-4435-4562-b595-59ba8898c092	\N	2026-02-07 16:11:02.083	\N	{"recipientEmail":"aqsariasat235@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
05940346-07ec-4b80-801a-089339e7c6ba	0aa46452-b94e-481e-87c6-390d50c821b2	EMAIL_SENT	Email sent: legal_update to catalyst@theredstone.ai	User	0aa46452-b94e-481e-87c6-390d50c821b2	\N	2026-02-07 16:11:04.091	\N	{"recipientEmail":"catalyst@theredstone.ai","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
2e961f1c-af43-4656-ad4b-2556a94ab66c	d20849a8-e976-4711-8e27-bc530aed0c4a	EMAIL_SENT	Email sent: legal_update to parisapari4u53@gmail.com	User	d20849a8-e976-4711-8e27-bc530aed0c4a	\N	2026-02-07 16:11:06.515	\N	{"recipientEmail":"parisapari4u53@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
53141116-9ca9-4c49-93e6-ca93fdae46e2	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	EMAIL_SENT	Email sent: legal_update to elishagill166@gmail.com	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	\N	2026-02-07 16:11:07.669	\N	{"recipientEmail":"elishagill166@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
60cc0977-41d5-48cc-af9c-3788c7b89503	258cb6d6-85be-4e4f-9830-107bac843987	EMAIL_SENT	Email sent: legal_update to rayasatmuhammad64@gmail.com	User	258cb6d6-85be-4e4f-9830-107bac843987	\N	2026-02-07 16:11:14.189	\N	{"recipientEmail":"rayasatmuhammad64@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
94a7589e-d7a2-429a-b902-76eca0af9d16	eb13f924-6e62-47a6-a3c2-7708e677861c	EMAIL_SENT	Email sent: legal_update to email@theredstone.ai	User	eb13f924-6e62-47a6-a3c2-7708e677861c	\N	2026-02-07 16:11:16.374	\N	{"recipientEmail":"email@theredstone.ai","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
d2d357c1-f13f-47ff-b321-878f713a7262	e9152f33-af41-4c15-95f2-2d09b6feb174	EMAIL_SENT	Email sent: legal_update to arbazkhan164598@gmail.com	User	e9152f33-af41-4c15-95f2-2d09b6feb174	\N	2026-02-07 16:11:17.591	\N	{"recipientEmail":"arbazkhan164598@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
1007755c-fa10-4a4d-ad56-9d512e637c7b	cb56dd57-504f-4e19-99c0-e457999c5665	EMAIL_SENT	Email sent: legal_update to soniarabbani2166@gmail.com	User	cb56dd57-504f-4e19-99c0-e457999c5665	\N	2026-02-07 16:11:19.679	\N	{"recipientEmail":"soniarabbani2166@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
23b9f290-2809-47d1-bba2-3f0c1a01cc87	22c55feb-de85-421b-bf76-7dd85ab66746	EMAIL_SENT	Email sent: legal_update to parisaumerkhalil@gmail.com	User	22c55feb-de85-421b-bf76-7dd85ab66746	\N	2026-02-07 16:11:20.705	\N	{"recipientEmail":"parisaumerkhalil@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
34bf847b-48e9-4b8e-9e47-86b2d1f7e2d5	674d623b-c2d4-4648-8115-5d0b1d164865	EMAIL_SENT	Email sent: legal_update to admin@smecert.ae	User	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-07 16:11:22.887	\N	{"recipientEmail":"admin@smecert.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
27402358-c697-4559-b9bd-549d51c8d900	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_UPDATE_NOTIFIED	Sent legal update notification for "Certification Standards" to 17 users	LegalPage	\N	\N	2026-02-07 16:11:22.898	\N	{"pageName":"Certification Standards","pageSlug":"certification-standards","sent":17,"failed":0,"totalUsers":17}
85c46938-20e4-4ffa-ad17-ac692e8e00f0	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	94.205.182.163	2026-02-07 20:25:26.256	\N	{"role":"admin"}
338a2bba-2cac-4591-aef1-963c450e579c	674d623b-c2d4-4648-8115-5d0b1d164865	INTERNAL_REVIEW_UPDATED	Document trade_license status updated to approved	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	94.205.182.163	2026-02-07 20:28:50.029	\N	{"documentId":"doc_1770470062060_bqwp3duab","documentType":"trade_license","status":"approved","companyName":"Al Noor Technologies"}
86ee2176-25b2-4f56-91d9-6a9267dc7d3d	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_REVISION_REQUESTED	Document trade_license status updated to requires_revision with feedback	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	94.205.182.163	2026-02-07 20:29:01.768	\N	{"documentId":"doc_1770470062060_bqwp3duab","documentType":"trade_license","status":"requires_revision","feedback":"x","companyName":"Al Noor Technologies"}
265e8656-40cf-482f-bb92-9882d99958ce	22c55feb-de85-421b-bf76-7dd85ab66746	EMAIL_SENT	Email sent: revision_required to parisaumerkhalil@gmail.com	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	\N	2026-02-07 20:29:03.805	\N	{"recipientEmail":"parisaumerkhalil@gmail.com","subject":"Action Required: Update Your Application - Naywa","emailType":"revision_required","status":"sent"}
8df89fec-b7a9-4dca-9ad8-5fe752efe2af	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-08 07:59:56.317	\N	{"role":"sme"}
a33098cb-2e69-4f0e-9efd-ecb878bcdf46	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.175	2026-02-08 07:59:59.767	\N	\N
a457f2db-62cd-4591-af67-f94a72bd0ca8	cd0990a6-9a5f-4758-aebc-e215b7a66ff8	USER_REGISTERED	New sme account registered	\N	\N	161.142.154.175	2026-02-08 08:02:39.463	\N	\N
b87c6521-b217-4a57-af5e-6f15f549a1dc	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-08 08:15:41.205	\N	{"role":"sme"}
8f5c4d27-e039-4063-ba24-099e232a9a3e	674d623b-c2d4-4648-8115-5d0b1d164865	ACCOUNT_SUSPENDED	Suspended account for aqsa aqsa (javeria@gmail.com)	User	cd0990a6-9a5f-4758-aebc-e215b7a66ff8	161.142.154.175	2026-02-08 08:19:11.622	\N	{"userEmail":"javeria@gmail.com","userName":"aqsa aqsa","userRole":"sme","reason":"hello","suspendedAt":"2026-02-08T08:19:11.622Z"}
befec3b6-c25c-4f5f-b3dd-1b777602b9ba	674d623b-c2d4-4648-8115-5d0b1d164865	ACCOUNT_SUSPENDED	Suspended account for Aqsa Riasat (aqsariasat235@gmail.com)	User	e873e8bb-4435-4562-b595-59ba8898c092	161.142.154.175	2026-02-08 08:35:49.734	\N	{"userEmail":"aqsariasat235@gmail.com","userName":"Aqsa Riasat","userRole":"user","reason":"inactive user","suspendedAt":"2026-02-08T08:35:49.734Z"}
18db1eac-4f6f-4262-b51a-3965a3297bbe	e873e8bb-4435-4562-b595-59ba8898c092	LOGIN_BLOCKED_SUSPENDED	Login attempt blocked - account suspended	\N	\N	161.142.154.175	2026-02-08 08:36:12.948	\N	{"suspendedReason":"inactive user"}
c8a40d5a-586d-42ef-ba0c-7f47a1d8e34a	674d623b-c2d4-4648-8115-5d0b1d164865	ACCOUNT_UNSUSPENDED	Reactivated account for Aqsa Riasat (aqsariasat235@gmail.com)	User	e873e8bb-4435-4562-b595-59ba8898c092	161.142.154.175	2026-02-08 08:36:29.075	{"accountStatus":"suspended","suspendedReason":"inactive user"}	{"accountStatus":"active","reactivatedAt":"2026-02-08T08:36:29.075Z"}
d012eae6-c358-48b2-82dc-021a6b3a954d	e873e8bb-4435-4562-b595-59ba8898c092	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-08 08:36:33.845	\N	{"role":"user"}
3b52d32d-898c-4098-b544-3875b9dd4597	e873e8bb-4435-4562-b595-59ba8898c092	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	161.142.154.175	2026-02-08 08:36:34.985	\N	{"search":null,"sector":null,"resultCount":5}
6cc5ace4-321a-48f3-a859-2f3505dcad97	e873e8bb-4435-4562-b595-59ba8898c092	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	161.142.154.175	2026-02-08 08:36:56.154	\N	{"search":null,"sector":null,"resultCount":5}
11df817a-4b79-48a7-b403-2036dc13a595	e873e8bb-4435-4562-b595-59ba8898c092	USER_LOGOUT	User logged out	\N	\N	161.142.154.175	2026-02-08 08:37:03.528	\N	\N
0ab69129-6a02-417b-8c6f-a8c5b4bc084d	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-08 08:37:39.823	\N	{"role":"admin"}
c9da7949-08b7-42a9-b7c2-a0d9a42187a8	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-08 16:02:32.874	\N	{"role":"sme"}
160b20bb-bad6-4d7c-9152-6d8779181287	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-08 16:12:00.431	\N	{"role":"admin"}
f000986e-c3db-4d92-a81d-cbd6f58de482	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_PAGE_UPDATED	Updated legal page: certification-fees	LegalPage	1152c08e-dffa-4dc9-a456-d519e77247f4	161.142.154.175	2026-02-08 16:20:10.239	{"title":"Certification Fees and Services","content":"## Overview\\n\\nNaywa provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency"}	{"title":"Certification Fees and Services","content":"## Overview\\n\\nNaywa provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency"}
5e524674-8ff4-4b58-aafb-19978e7b9504	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_PAGE_UPDATED	Updated legal page: certification-fees	LegalPage	1152c08e-dffa-4dc9-a456-d519e77247f4	161.142.154.175	2026-02-08 16:20:23.566	{"title":"Certification Fees and Services","content":"## Overview\\n\\nNaywa provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency"}	{"title":"Certification Fees and Services","content":"## Overview\\n\\nNaywa provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency"}
bfd6bb8d-e8d9-4895-80fc-63c6769c6b80	17f046a0-8c7f-45e7-84b2-5941c5189375	EMAIL_SENT	Email sent: legal_update to user@example.com	User	17f046a0-8c7f-45e7-84b2-5941c5189375	\N	2026-02-08 16:20:28.734	\N	{"recipientEmail":"user@example.com","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
7ee3807e-29dc-4cf9-a6a1-03750381686c	3bd38396-3d04-4b86-812c-4958e6cff136	EMAIL_SENT	Email sent: legal_update to user2@example.com	User	3bd38396-3d04-4b86-812c-4958e6cff136	\N	2026-02-08 16:20:30.628	\N	{"recipientEmail":"user2@example.com","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
67e71dbc-3d49-41b8-9d1e-6b5869402b91	9a29bfa2-6177-45a8-a308-61c1f34fb13b	EMAIL_SENT	Email sent: legal_update to sme@techstartup.ae	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	\N	2026-02-08 16:20:31.659	\N	{"recipientEmail":"sme@techstartup.ae","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
daf4a675-0921-4148-9e65-2112f3afabbb	c4bf6f2a-e8d1-43c5-96fc-088387e93232	EMAIL_SENT	Email sent: legal_update to sme@healthplus.ae	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	\N	2026-02-08 16:20:34.67	\N	{"recipientEmail":"sme@healthplus.ae","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
373e45da-c613-436a-a448-205f9d2db33c	0c7a2ae9-b24b-4741-962b-10155a4131d6	EMAIL_SENT	Email sent: legal_update to sme@retailhub.ae	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	\N	2026-02-08 16:20:37.545	\N	{"recipientEmail":"sme@retailhub.ae","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
d8296e5f-0142-4412-8ed4-baf4b946b4a3	f7677afa-4185-4c3f-ae44-aadd4ce6d886	EMAIL_SENT	Email sent: legal_update to sme@newbusiness.ae	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	\N	2026-02-08 16:20:39.468	\N	{"recipientEmail":"sme@newbusiness.ae","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
6619d37b-0082-4584-8808-fadd1e8fbab4	17f046a0-8c7f-45e7-84b2-5941c5189375	EMAIL_SENT	Email sent: legal_update to user@example.com	User	17f046a0-8c7f-45e7-84b2-5941c5189375	\N	2026-02-08 16:20:39.89	\N	{"recipientEmail":"user@example.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
8308ec34-032e-480b-9350-5bb05fc2e645	3bd38396-3d04-4b86-812c-4958e6cff136	EMAIL_SENT	Email sent: legal_update to user2@example.com	User	3bd38396-3d04-4b86-812c-4958e6cff136	\N	2026-02-08 16:20:41.77	\N	{"recipientEmail":"user2@example.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
5dfead99-394e-4eb3-b659-b86f795eaf6a	0918869a-495b-490d-95f2-604131cd34c9	EMAIL_SENT	Email sent: legal_update to sme@constructco.ae	User	0918869a-495b-490d-95f2-604131cd34c9	\N	2026-02-08 16:20:42.054	\N	{"recipientEmail":"sme@constructco.ae","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
6ec2ce49-5e5c-4d4f-acec-769cc95fa416	0aa46452-b94e-481e-87c6-390d50c821b2	EMAIL_SENT	Email sent: legal_update to catalyst@theredstone.ai	User	0aa46452-b94e-481e-87c6-390d50c821b2	\N	2026-02-08 16:20:44.046	\N	{"recipientEmail":"catalyst@theredstone.ai","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
8cf4a540-74db-4908-ab25-c01355d7fafd	9a29bfa2-6177-45a8-a308-61c1f34fb13b	EMAIL_SENT	Email sent: legal_update to sme@techstartup.ae	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	\N	2026-02-08 16:20:44.539	\N	{"recipientEmail":"sme@techstartup.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
ac9b64cb-1f0d-4c63-a026-66597ae23b82	d20849a8-e976-4711-8e27-bc530aed0c4a	EMAIL_SENT	Email sent: legal_update to parisapari4u53@gmail.com	User	d20849a8-e976-4711-8e27-bc530aed0c4a	\N	2026-02-08 16:20:46.988	\N	{"recipientEmail":"parisapari4u53@gmail.com","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
1fa28823-79f2-44f7-a58a-a63351ba01b9	c4bf6f2a-e8d1-43c5-96fc-088387e93232	EMAIL_SENT	Email sent: legal_update to sme@healthplus.ae	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	\N	2026-02-08 16:20:47.368	\N	{"recipientEmail":"sme@healthplus.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
660e7bbf-df51-4ee1-b5e3-dc0f4d7b778a	0c7a2ae9-b24b-4741-962b-10155a4131d6	EMAIL_SENT	Email sent: legal_update to sme@retailhub.ae	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	\N	2026-02-08 16:20:49.312	\N	{"recipientEmail":"sme@retailhub.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
e04a027c-3351-4f9a-b313-96f09c2ceb1c	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	EMAIL_SENT	Email sent: legal_update to elishagill166@gmail.com	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	\N	2026-02-08 16:20:49.55	\N	{"recipientEmail":"elishagill166@gmail.com","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
aac411c0-0756-4878-8b08-040f10f04f59	f7677afa-4185-4c3f-ae44-aadd4ce6d886	EMAIL_SENT	Email sent: legal_update to sme@newbusiness.ae	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	\N	2026-02-08 16:20:50.555	\N	{"recipientEmail":"sme@newbusiness.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
777edb93-3651-4afb-bb18-497e23b391ab	0918869a-495b-490d-95f2-604131cd34c9	EMAIL_SENT	Email sent: legal_update to sme@constructco.ae	User	0918869a-495b-490d-95f2-604131cd34c9	\N	2026-02-08 16:20:51.584	\N	{"recipientEmail":"sme@constructco.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
cfed2eed-64f2-43a4-9975-8c8445cb065b	258cb6d6-85be-4e4f-9830-107bac843987	EMAIL_SENT	Email sent: legal_update to rayasatmuhammad64@gmail.com	User	258cb6d6-85be-4e4f-9830-107bac843987	\N	2026-02-08 16:20:52.302	\N	{"recipientEmail":"rayasatmuhammad64@gmail.com","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
67d409e9-27f7-4b37-93d6-0efa060e55d9	e9152f33-af41-4c15-95f2-2d09b6feb174	EMAIL_SENT	Email sent: legal_update to arbazkhan164598@gmail.com	User	e9152f33-af41-4c15-95f2-2d09b6feb174	\N	2026-02-08 16:20:54.34	\N	{"recipientEmail":"arbazkhan164598@gmail.com","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
6f1e603c-6b82-4c24-a2ae-9b61b16d0286	0aa46452-b94e-481e-87c6-390d50c821b2	EMAIL_SENT	Email sent: legal_update to catalyst@theredstone.ai	User	0aa46452-b94e-481e-87c6-390d50c821b2	\N	2026-02-08 16:20:54.844	\N	{"recipientEmail":"catalyst@theredstone.ai","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
e0e2c71c-c691-41b9-9c61-712d495c95c0	e873e8bb-4435-4562-b595-59ba8898c092	EMAIL_SENT	Email sent: legal_update to aqsariasat235@gmail.com	User	e873e8bb-4435-4562-b595-59ba8898c092	\N	2026-02-08 16:20:56.353	\N	{"recipientEmail":"aqsariasat235@gmail.com","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
8cffa9b4-2fa9-4570-b159-0f82530dc3bc	d20849a8-e976-4711-8e27-bc530aed0c4a	EMAIL_SENT	Email sent: legal_update to parisapari4u53@gmail.com	User	d20849a8-e976-4711-8e27-bc530aed0c4a	\N	2026-02-08 16:20:56.907	\N	{"recipientEmail":"parisapari4u53@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
50a730dc-58a9-44f4-a3dc-ffae9bb1ce83	cb56dd57-504f-4e19-99c0-e457999c5665	EMAIL_SENT	Email sent: legal_update to soniarabbani2166@gmail.com	User	cb56dd57-504f-4e19-99c0-e457999c5665	\N	2026-02-08 16:20:58.293	\N	{"recipientEmail":"soniarabbani2166@gmail.com","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
fbd118fe-b1bd-41f9-ac85-444f5f8f4a9d	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	EMAIL_SENT	Email sent: legal_update to elishagill166@gmail.com	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	\N	2026-02-08 16:20:58.753	\N	{"recipientEmail":"elishagill166@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
fb15248c-a2a9-4f99-b446-7aadd82d9ace	22c55feb-de85-421b-bf76-7dd85ab66746	EMAIL_SENT	Email sent: legal_update to parisaumerkhalil@gmail.com	User	22c55feb-de85-421b-bf76-7dd85ab66746	\N	2026-02-08 16:21:00.14	\N	{"recipientEmail":"parisaumerkhalil@gmail.com","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
e0e3d1ed-2754-4c35-aa5e-a4f4cdb06998	258cb6d6-85be-4e4f-9830-107bac843987	EMAIL_SENT	Email sent: legal_update to rayasatmuhammad64@gmail.com	User	258cb6d6-85be-4e4f-9830-107bac843987	\N	2026-02-08 16:21:00.622	\N	{"recipientEmail":"rayasatmuhammad64@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
938fcf9e-9653-4cf6-81f0-7e2d8e892c31	eb13f924-6e62-47a6-a3c2-7708e677861c	EMAIL_SENT	Email sent: legal_update to email@theredstone.ai	User	eb13f924-6e62-47a6-a3c2-7708e677861c	\N	2026-02-08 16:21:01.244	\N	{"recipientEmail":"email@theredstone.ai","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
466198e4-3d06-4be5-9ea6-463800e32f53	e9152f33-af41-4c15-95f2-2d09b6feb174	EMAIL_SENT	Email sent: legal_update to arbazkhan164598@gmail.com	User	e9152f33-af41-4c15-95f2-2d09b6feb174	\N	2026-02-08 16:21:02.449	\N	{"recipientEmail":"arbazkhan164598@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
4a52dbc8-ff1c-43ec-80f4-3ef37fad5679	674d623b-c2d4-4648-8115-5d0b1d164865	EMAIL_SENT	Email sent: legal_update to admin@smecert.ae	User	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-08 16:21:03.08	\N	{"recipientEmail":"admin@smecert.ae","subject":"Policy Update: Certification Fees and Services - Naywa","emailType":"legal_update","status":"sent"}
9aeb0683-1e8d-4a8c-bd4b-577a8027c1b9	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_UPDATE_NOTIFIED	Sent legal update notification for "Certification Fees and Services" to 17 users	LegalPage	\N	\N	2026-02-08 16:21:03.087	\N	{"pageName":"Certification Fees and Services","pageSlug":"certification-fees","sent":17,"failed":0,"totalUsers":17}
28944fff-8223-4ef3-88db-638ae7ef4b75	e873e8bb-4435-4562-b595-59ba8898c092	EMAIL_SENT	Email sent: legal_update to aqsariasat235@gmail.com	User	e873e8bb-4435-4562-b595-59ba8898c092	\N	2026-02-08 16:21:05.241	\N	{"recipientEmail":"aqsariasat235@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
aa2874a5-ce17-4d7a-a53e-816915091941	cb56dd57-504f-4e19-99c0-e457999c5665	EMAIL_SENT	Email sent: legal_update to soniarabbani2166@gmail.com	User	cb56dd57-504f-4e19-99c0-e457999c5665	\N	2026-02-08 16:21:07.716	\N	{"recipientEmail":"soniarabbani2166@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
627ccc21-1627-4761-ad33-02eed207bef2	22c55feb-de85-421b-bf76-7dd85ab66746	EMAIL_SENT	Email sent: legal_update to parisaumerkhalil@gmail.com	User	22c55feb-de85-421b-bf76-7dd85ab66746	\N	2026-02-08 16:21:10.603	\N	{"recipientEmail":"parisaumerkhalil@gmail.com","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
c55c137a-325a-494e-87da-cbde657418c3	eb13f924-6e62-47a6-a3c2-7708e677861c	EMAIL_SENT	Email sent: legal_update to email@theredstone.ai	User	eb13f924-6e62-47a6-a3c2-7708e677861c	\N	2026-02-08 16:21:12.161	\N	{"recipientEmail":"email@theredstone.ai","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
c40b0e9d-acb5-4b3a-b880-acb30fc42aff	674d623b-c2d4-4648-8115-5d0b1d164865	EMAIL_SENT	Email sent: legal_update to admin@smecert.ae	User	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-08 16:21:14.025	\N	{"recipientEmail":"admin@smecert.ae","subject":"Policy Update: Certification Standards - Naywa","emailType":"legal_update","status":"sent"}
53b73736-167a-4a6f-ad5e-6332f6ef58a9	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_UPDATE_NOTIFIED	Sent legal update notification for "Certification Standards" to 17 users	LegalPage	\N	\N	2026-02-08 16:21:14.037	\N	{"pageName":"Certification Standards","pageSlug":"certification-standards","sent":17,"failed":0,"totalUsers":17}
fb711ab3-6885-42be-8beb-a8c40e292ae0	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	94.205.182.163	2026-02-08 21:09:15.833	\N	{"role":"admin"}
a78335d8-255f-4411-a8e4-bca436a2e37a	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATE_VERIFICATION_ATTEMPT	Certificate verification: SUCCESS	Certificate	00607336-5e25-4c7a-8cd4-3c356a19d16d	94.205.182.163	2026-02-09 06:19:39.76	\N	{"result":"SUCCESS","lookupMethod":"CERT_ID","certificateId":"SME-CERT-FC5B0684","hashedInput":null,"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Safari/605.1.15","timestamp":"2026-02-09T06:19:39.760Z"}
ecdeec1b-974a-4631-b0d8-c646b1b8fb79	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_PAGE_UPDATED	Updated legal page: certification-fees	LegalPage	1152c08e-dffa-4dc9-a456-d519e77247f4	94.205.182.163	2026-02-09 06:28:01.228	{"title":"Certification Fees and Services","content":"## Overview\\n\\nNaywa provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency"}	{"title":"Certification Fees and Services","content":"## Overview\\n\\nNaywa provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency"}
957a6f40-a562-4f32-8033-462ffa84b081	674d623b-c2d4-4648-8115-5d0b1d164865	LEGAL_PAGE_UPDATED	Updated legal page: certification-fees	LegalPage	1152c08e-dffa-4dc9-a456-d519e77247f4	94.205.182.163	2026-02-09 06:29:56.906	{"title":"Certification Fees and Services","content":"## Overview\\n\\nNaywa provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency"}	{"title":"Certification Fees and Services","content":"## Overview\\n\\nNaywa provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency"}
290c88e1-9c5c-4e55-8aa0-654dc8a82014	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-09 14:11:05.79	\N	{"role":"sme"}
577765ee-0c21-4930-9120-04c94c41549c	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATE_VERIFICATION_ATTEMPT	Certificate verification: SUCCESS	Certificate	fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	94.201.198.147	2026-02-09 15:11:41.811	\N	{"result":"SUCCESS","lookupMethod":"CERT_ID","certificateId":"SME-CERT-2C41732F","hashedInput":null,"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Safari/605.1.15","timestamp":"2026-02-09T15:11:41.811Z"}
1d0df604-1eed-4e5d-8285-d802776517d4	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	94.201.198.147	2026-02-09 15:13:15.238	\N	{"role":"sme"}
7ec72924-72c3-46d9-8373-98fe9631f129	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	94.201.198.147	2026-02-09 15:16:36.975	\N	\N
fe66a495-5557-4b37-95b5-751f1b6fec46	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	94.201.198.147	2026-02-09 15:17:54.642	\N	{"role":"user"}
bb148bbc-96f0-44d4-a3dd-b1017fa9945e	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	94.201.198.147	2026-02-09 15:17:55.685	\N	{"search":null,"sector":null,"resultCount":5}
f172bc6e-b5de-43e8-b506-b50507d5090f	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_VIEW	Viewed registry profile: tjara	SMEProfile	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	94.201.198.147	2026-02-09 15:18:14.135	\N	\N
7b842d07-fae0-4681-b33b-925fb863b4e0	258cb6d6-85be-4e4f-9830-107bac843987	REGISTRY_SEARCH	Registry search — 5 results	\N	\N	94.201.198.147	2026-02-09 15:19:49.921	\N	{"search":null,"sector":null,"resultCount":5}
ddfd046e-e1bc-4596-b7c1-0e4b28c8d0ea	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	94.201.198.147	2026-02-09 15:20:11.555	\N	\N
8dd6c333-1623-4868-9b1c-83d54986e299	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	94.201.198.147	2026-02-09 15:20:23.239	\N	{"role":"admin"}
6c987a9b-29a7-400a-84fa-11b915fa93f4	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATE_VERIFICATION_ATTEMPT	Certificate verification: SUCCESS	Certificate	00607336-5e25-4c7a-8cd4-3c356a19d16d	94.201.198.147	2026-02-09 15:25:13.77	\N	{"result":"SUCCESS","lookupMethod":"CERT_ID","certificateId":"SME-CERT-FC5B0684","hashedInput":null,"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Safari/605.1.15","timestamp":"2026-02-09T15:25:13.770Z"}
3ccd5117-0505-4614-89cf-ce9f3a86f423	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	94.201.198.147	2026-02-09 15:25:22.353	\N	\N
8e964969-3664-4c30-b38e-cf0615a62e8f	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	94.201.198.147	2026-02-09 15:25:31.072	\N	\N
04af6d3a-29d0-4117-b40c-0e836bb638a9	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	94.201.198.147	2026-02-09 15:26:49.594	\N	\N
94d04ebc-ba87-4516-a068-e7954f7d2091	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for Al Noor Technologies	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	94.201.198.147	2026-02-09 15:26:58.391	\N	\N
dde6aa41-b0c3-4857-928b-90779e67ed3a	674d623b-c2d4-4648-8115-5d0b1d164865	PAYMENT_REQUESTED	Requested payment of AED 500.00 from Al Noor Technologies	Payment	752ac41f-667d-4ac0-a3d9-f84c0184193a	94.205.182.163	2026-02-09 20:41:23.574	\N	{"paymentId":"PAY-AFFF4C53","amount":500,"smeCompany":"Al Noor Technologies"}
774c0eb0-8a1b-4178-9a9a-fb9265e4680c	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_DISABLED	Disabled listing visibility for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	94.205.182.163	2026-02-09 20:47:39.282	\N	\N
5d716226-0b95-4555-9cfb-ebc054edc200	674d623b-c2d4-4648-8115-5d0b1d164865	LISTING_ENABLED	Enabled listing visibility for UAE GEM	SMEProfile	bff4a163-a102-4334-ad12-37b1a6e468c1	94.205.182.163	2026-02-09 20:48:01.222	\N	\N
41c1ddbb-57f5-4b24-9159-3cb5d34383bb	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	161.142.154.175	2026-02-10 03:56:20.75	\N	\N
f89df760-4367-4cf3-a385-318a9dab5f5d	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-10 03:56:33.101	\N	{"role":"admin"}
75c5a669-0710-45f8-8291-ef9127924b05	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.175	2026-02-10 03:58:38.496	\N	\N
d788b8b9-f3de-4291-afb5-b1453b9c1b3d	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-10 03:58:44.305	\N	{"role":"admin"}
aa9b1974-83ef-40a7-a064-221dd27b8e1a	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.175	2026-02-10 04:00:38.645	\N	\N
480b1f7b-e176-4b4f-9237-75ce697dea66	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-10 04:00:57.155	\N	{"role":"admin"}
dda9d0db-0b5a-4c7d-bc3e-0b4963818963	674d623b-c2d4-4648-8115-5d0b1d164865	PAYMENT_REQUESTED	Requested payment of AED 400.00 from UAE GEM	Payment	21414c40-824c-4a93-b10d-a99999247f18	161.142.154.175	2026-02-10 04:01:43.566	\N	{"paymentId":"PAY-88DFEF63","amount":400,"smeCompany":"UAE GEM"}
656bb52b-a2e5-4a5a-9225-c20de2e996e8	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	161.142.154.175	2026-02-10 04:14:01.135	\N	\N
2b15ca07-3779-48cd-a177-082af6f7dc54	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	161.142.154.175	2026-02-10 04:14:12.829	\N	{"role":"admin"}
\.


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.certificates (id, "certificateId", "certificateVersion", "smeProfileId", "companyName", "tradeLicenseNumber", "industrySector", "issuedAt", "expiresAt", status, "revokedAt", "revocationReason", "verificationUrl", "verificationHash", "issuedById", "lastReissuedAt", "createdAt", "updatedAt") FROM stdin;
668b4c78-db89-4893-a176-0091759a7594	SME-CERT-5A78C7ED	v1.0	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	TechStart UAE	TL-2024-001234	technology	2024-01-20 00:00:00	2025-01-20 00:00:00	active	\N	\N	https://sme.byredstone.com/registry/verify/SME-CERT-5A78C7ED	82ebd5134e0753b2e820c1cec2c785ea3b6517f15cb8e864e0ba8ed1e6873183	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:32:04.607	2026-02-05 19:32:04.607
c3c90930-7251-4004-b61c-65541c27cb60	SME-CERT-05E4A59F	v1.0	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	HealthPlus Medical Center	TL-2024-005678	healthcare	2024-02-05 00:00:00	2025-02-05 00:00:00	active	\N	\N	https://sme.byredstone.com/registry/verify/SME-CERT-05E4A59F	b3bb4c2b7eb7853a995f715a63891877edfab96c1b968c27cf24496072a17163	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:32:04.612	2026-02-05 19:32:04.612
fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	SME-CERT-2C41732F	v1.0	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	tjara	9876	finance	2026-01-31 17:57:01.451	2027-01-31 17:57:01.451	active	\N	\N	https://sme.byredstone.com/registry/verify/SME-CERT-2C41732F	799d6ec3957130d8ac7adcd038e9a4c9912f4e08bbf00c7be256a894d709f74b	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:32:04.618	2026-02-05 19:32:04.618
481bd625-cefc-46ed-9d99-9df4357bb537	SME-CERT-E099E930	v1.0	bff4a163-a102-4334-ad12-37b1a6e468c1	UAE GEM	65432	manufacturing	2026-02-02 14:49:15.627	2027-02-02 14:49:15.627	active	\N	\N	https://sme.byredstone.com/registry/verify/SME-CERT-E099E930	977c1a766c451c154bd2fa2c2ea2505d1e1e965511e34fbc4a0460dc4e8b8da1	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:32:04.624	2026-02-05 19:32:04.624
00607336-5e25-4c7a-8cd4-3c356a19d16d	SME-CERT-FC5B0684	v1.0	ea0c4da9-3fef-4433-8296-df1a4513c947	Al Noor Technologies	4356456	technology	2026-02-07 13:45:34.847	2027-02-07 13:45:34.847	active	\N	\N	https://sme.byredstone.com/registry/verify/SME-CERT-FC5B0684	32d881562f3b400ed916da134634bfd1635df77783d30532f84bea8c92816317	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-07 13:45:34.853	2026-02-07 13:45:34.853
\.


--
-- Data for Name: chat_attachments; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.chat_attachments (id, "messageId", "fileName", "originalName", "filePath", "fileSize", "mimeType", "createdAt") FROM stdin;
37b0ae65-1eb4-4450-b023-b2de4036cb8c	f76120fb-79d0-4af9-9d89-bd8883b7cd87	1769805322212-575804526.pdf	5G JOBS.pdf	/uploads/chat/133e1536-b3d6-486d-a049-70a1f15847e4/1769805322212-575804526.pdf	101099	application/pdf	2026-01-30 20:35:22.218
4668aecf-18aa-46f1-aee4-3a134e12fe9c	37114906-bca6-4f07-957d-1845298992c3	1769971701345-271067704.png	Screenshot 2026-02-02 at 12.37.02â¯AM.png	/uploads/chat/133e1536-b3d6-486d-a049-70a1f15847e4/1769971701345-271067704.png	626756	image/png	2026-02-01 18:48:21.353
5f152f06-32ab-4c54-8b2b-c0b0df40aa15	0ad4635d-685a-4663-b6ef-d550e25f619d	1770046157890-21208808.png	Screenshot 2026-02-02 at 12.28.43aÌ_Â¯AM (1).png	/uploads/chat/26c33880-2196-4839-b1db-3db18e13ff07/1770046157890-21208808.png	566737	image/png	2026-02-02 15:29:17.893
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: sme_user
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
37114906-bca6-4f07-957d-1845298992c3	133e1536-b3d6-486d-a049-70a1f15847e4	eb13f924-6e62-47a6-a3c2-7708e677861c		2026-02-01 18:48:21.353	t	[]	\N	f	f
6a519910-66bf-4826-b2cc-049bbaf328db	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	456	2026-02-02 11:52:04.898	t	[]	\N	f	f
6deb1c07-fe10-494c-b1ec-014a4870a901	26c33880-2196-4839-b1db-3db18e13ff07	258cb6d6-85be-4e4f-9830-107bac843987	hi	2026-02-02 15:29:08.59	f	[]	\N	f	f
0ad4635d-685a-4663-b6ef-d550e25f619d	26c33880-2196-4839-b1db-3db18e13ff07	258cb6d6-85be-4e4f-9830-107bac843987		2026-02-02 15:29:17.893	f	[]	\N	f	f
\.


--
-- Data for Name: document_versions; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.document_versions (id, "smeProfileId", "documentType", "originalName", "fileName", "filePath", "fileSize", "mimeType", version, status, "adminFeedback", "reviewedById", "reviewedAt", "uploadedAt", "replacedAt", "isLatest") FROM stdin;
66fec6da-2de0-45df-9656-c8e684149ace	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	company_profile	Catalyst_Logo (1).png	1769803012286-509302961-Catalyst_Logo__1_.png	/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769803012286-509302961-Catalyst_Logo__1_.png	\N	\N	1	approved	\N	674d623b-c2d4-4648-8115-5d0b1d164865	2026-02-07 00:02:57.91	2026-02-07 00:02:57.91	\N	t
b2bb96d8-8025-4a90-8506-40b08e05dd28	ea0c4da9-3fef-4433-8296-df1a4513c947	company_registration	5G JOBS.pdf	1770470070500-97820719-5G_JOBS.pdf	/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470070500-97820719-5G_JOBS.pdf	101099	application/pdf	1	pending	\N	\N	\N	2026-02-07 13:14:30.514	\N	t
fb8924bf-6394-4e0d-a9f8-563c9e5102e1	ea0c4da9-3fef-4433-8296-df1a4513c947	signatory_id	5G JOBS.pdf	1770470082806-246528705-5G_JOBS.pdf	/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470082806-246528705-5G_JOBS.pdf	101099	application/pdf	1	pending	\N	\N	\N	2026-02-07 13:14:42.819	\N	t
ea9f12f7-267a-47d9-ba0d-87cd7bef8ddf	ea0c4da9-3fef-4433-8296-df1a4513c947	financial_statements	5G JOBS.pdf	1770470091889-104533731-5G_JOBS.pdf	/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470091889-104533731-5G_JOBS.pdf	101099	application/pdf	1	pending	\N	\N	\N	2026-02-07 13:14:51.899	\N	t
9e100602-ca3a-44de-a06a-accfc1642413	ea0c4da9-3fef-4433-8296-df1a4513c947	company_profile	5G JOBS.pdf	1770470096881-73937440-5G_JOBS.pdf	/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470096881-73937440-5G_JOBS.pdf	101099	application/pdf	1	pending	\N	\N	\N	2026-02-07 13:14:56.893	\N	t
55be1bd8-5179-45ed-8c53-15f15adad923	ea0c4da9-3fef-4433-8296-df1a4513c947	ubo_declaration	5G JOBS.pdf	1770470123748-721487310-5G_JOBS.pdf	/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470123748-721487310-5G_JOBS.pdf	101099	application/pdf	1	pending	\N	\N	\N	2026-02-07 13:15:23.761	\N	t
685c3f4a-5aad-4a4b-9c59-3447f156105a	ea0c4da9-3fef-4433-8296-df1a4513c947	moa_shareholding	5G JOBS.pdf	1770470128274-312665546-5G_JOBS.pdf	/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470128274-312665546-5G_JOBS.pdf	101099	application/pdf	1	pending	\N	\N	\N	2026-02-07 13:15:28.288	\N	t
130b7176-03f5-4236-adae-c6aaeea8fa40	ea0c4da9-3fef-4433-8296-df1a4513c947	vat_certificate	5G JOBS.pdf	1770470134643-76186643-5G_JOBS.pdf	/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470134643-76186643-5G_JOBS.pdf	101099	application/pdf	1	pending	\N	\N	\N	2026-02-07 13:15:34.656	\N	t
7d94adeb-e789-4d36-8abe-199f768c42e2	ea0c4da9-3fef-4433-8296-df1a4513c947	certificate_of_incorporation	5G JOBS.pdf	1770470138043-514901878-5G_JOBS.pdf	/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470138043-514901878-5G_JOBS.pdf	101099	application/pdf	1	pending	\N	\N	\N	2026-02-07 13:15:38.054	\N	t
2c51ffdd-0b34-4e22-b4cd-a5b2d853d4fa	ea0c4da9-3fef-4433-8296-df1a4513c947	licenses_permits	5G JOBS.pdf	1770470146270-803816687-5G_JOBS.pdf	/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470146270-803816687-5G_JOBS.pdf	101099	application/pdf	1	pending	\N	\N	\N	2026-02-07 13:15:46.284	\N	t
50acdebf-d57f-402f-aac5-93d042a3146b	ea0c4da9-3fef-4433-8296-df1a4513c947	trade_license	5G JOBS.pdf	1770470062056-918609861-5G_JOBS.pdf	/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470062056-918609861-5G_JOBS.pdf	101099	application/pdf	1	requires_revision	x	674d623b-c2d4-4648-8115-5d0b1d164865	2026-02-07 20:29:01.762	2026-02-07 13:14:22.073	\N	t
\.


--
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.email_logs (id, "recipientEmail", "recipientName", "entityType", "entityId", "eventType", subject, "templateId", status, "errorMessage", metadata, "sentAt") FROM stdin;
76f7b57c-0a3f-474f-b1e2-68c6aa94dd80	parisaumerkhalil@gmail.com	sonia soni	User	\N	verification	Verify Your Credentials - Naywa	\N	sent	\N	\N	2026-02-07 13:06:10.229
73f34a58-a03b-4248-a884-b20c121d60b8	parisaumerkhalil@gmail.com	sonia soni	User	\N	welcome	Account Verified - Naywa	\N	sent	\N	{"role": "sme"}	2026-02-07 13:06:51.928
4b3651ed-1ecd-49ac-bbff-35a3e1be645b	parisaumerkhalil@gmail.com	sonia soni	SMEProfile	\N	application_submitted	Application Received - Naywa	\N	sent	\N	{"companyName": "Al Noor Technologies"}	2026-02-07 13:16:02.739
26859308-8b0b-44e1-b5a2-63303370e621	parisaumerkhalil@gmail.com	sonia soni	SMEProfile	\N	verification_in_progress	Your Application is Under Review - Naywa	\N	sent	\N	{"companyName": "Al Noor Technologies"}	2026-02-07 13:20:51.438
7d76ec25-5c5e-482a-9db2-4845e542a275	parisaumerkhalil@gmail.com	sonia soni	SMEProfile	\N	revision_required	Action Required: Update Your Application - Naywa	\N	sent	\N	{"companyName": "Al Noor Technologies", "revisionNotes": "testing"}	2026-02-07 13:22:43.006
3a93658b-fa04-4b75-98f8-89c61060cca9	parisaumerkhalil@gmail.com	sonia soni	SMEProfile	\N	application_submitted	Application Received - Naywa	\N	sent	\N	{"companyName": "Al Noor Technologies"}	2026-02-07 13:25:58.435
37571176-ddf8-4f5f-9ce7-4277ed7328e0	parisaumerkhalil@gmail.com	sonia soni	SMEProfile	\N	verification_in_progress	Your Application is Under Review - Naywa	\N	sent	\N	{"companyName": "Al Noor Technologies"}	2026-02-07 13:28:25.29
73dc40ee-e7e7-4111-8af8-a5b522f2f382	parisaumerkhalil@gmail.com	sonia soni	SMEProfile	\N	certification_issued	Congratulations! Your Business is Certified - Naywa	\N	sent	\N	{"companyName": "Al Noor Technologies"}	2026-02-07 13:45:36.054
56babcdb-3e75-4305-ae27-645a1df923fd	soniarabbani2166@gmail.com	parisa pari	User	\N	verification	Verify Your Credentials - Naywa	\N	sent	\N	\N	2026-02-07 13:48:54.821
f1fca438-8881-43e7-8361-a27fe0e12a99	soniarabbani2166@gmail.com	parisa pari	User	\N	welcome	Registry Access Granted - Naywa	\N	sent	\N	{"role": "user"}	2026-02-07 13:49:22.007
9d94a219-1943-4b26-8a32-439e523e2417	user@example.com	Ahmed Al Mansouri	User	17f046a0-8c7f-45e7-84b2-5941c5189375	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:21.338
9922bc4c-fa78-475e-952f-db8a8dc9fedd	user2@example.com	Sarah Khan	User	3bd38396-3d04-4b86-812c-4958e6cff136	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:23.172
14504d15-5774-44d0-9f4c-4dcf28d63f01	sme@techstartup.ae	Mohammad Al Hashimi	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:26.399
e8f0f7ef-1b6c-44a2-b337-7852b16b0fac	sme@healthplus.ae	Dr. Fatima Al Zaabi	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:28.852
bc0820c6-7abc-4762-80ea-08127ae0b46d	sme@retailhub.ae	Khalid Al Nasser	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:30.126
f534a0a4-f0ef-4166-9ba5-5d407d7b09d2	sme@newbusiness.ae	Layla Hassan	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:31.508
61cbca39-4746-406f-bcc5-1390626eed98	sme@constructco.ae	Omar Al Qassim	User	0918869a-495b-490d-95f2-604131cd34c9	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:33.759
28463dee-25ac-4593-9bfe-db544ca0aab0	aqsariasat235@gmail.com	Aqsa Riasat	User	e873e8bb-4435-4562-b595-59ba8898c092	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:35.226
cfbe02d3-d58f-4de8-85b7-128a5ae46816	catalyst@theredstone.ai	Sajid Usman	User	0aa46452-b94e-481e-87c6-390d50c821b2	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:36.561
2f84f51a-2127-419e-9537-a6e89b7fdb91	parisapari4u53@gmail.com	sonia soni	User	d20849a8-e976-4711-8e27-bc530aed0c4a	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:37.923
26825a2a-33be-4129-83f8-b3512fa08e45	elishagill166@gmail.com	ELISHA eli	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:41.109
3b0ac87a-3034-4fd5-80c0-37fe51b3c013	rayasatmuhammad64@gmail.com	Aqsa Aqsa	User	258cb6d6-85be-4e4f-9830-107bac843987	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:42.156
fd966216-5a0a-437e-b0cc-b7f097efa2e0	email@theredstone.ai	Ali Hussain	User	eb13f924-6e62-47a6-a3c2-7708e677861c	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:45.303
ea801aa9-bd88-4738-bc4b-a92e63cb463d	arbazkhan164598@gmail.com	aqsa aqsa	User	e9152f33-af41-4c15-95f2-2d09b6feb174	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:46.576
deaf5cae-9c30-4488-b31c-8b5303c6e547	soniarabbani2166@gmail.com	Parisa Pari	User	cb56dd57-504f-4e19-99c0-e457999c5665	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:49.654
f6888243-f3aa-4992-8e86-13cc7e78823a	parisaumerkhalil@gmail.com	sonia soni	User	22c55feb-de85-421b-bf76-7dd85ab66746	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:50.832
51d1f350-59a8-40a0-9b41-71fca55d98a9	admin@smecert.ae	System Administrator	User	674d623b-c2d4-4648-8115-5d0b1d164865	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 15:56:52.977
918f1fb5-08c1-4bc5-94d2-e22ffa1de134	user@example.com	Ahmed Al Mansouri	User	17f046a0-8c7f-45e7-84b2-5941c5189375	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:22.059
f97d5d02-a781-451c-96bd-f4bb6c504ca1	user2@example.com	Sarah Khan	User	3bd38396-3d04-4b86-812c-4958e6cff136	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:25.516
e9a1e827-5a83-4c19-95df-b5422772781f	sme@techstartup.ae	Mohammad Al Hashimi	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:27.913
df62b829-20c0-4a1e-843f-2141f7adfb95	sme@healthplus.ae	Dr. Fatima Al Zaabi	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:29.485
7b5908f2-e367-4567-97b2-9a9ea3e15784	sme@retailhub.ae	Khalid Al Nasser	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:30.676
ab836eab-5109-404f-a2bf-9ab009751ee7	sme@newbusiness.ae	Layla Hassan	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:32.102
29534bfe-9e24-4796-b4fd-8f59168d676b	sme@constructco.ae	Omar Al Qassim	User	0918869a-495b-490d-95f2-604131cd34c9	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:33.951
00d9a4fe-ca0c-48ee-bccc-12882973b7bc	aqsariasat235@gmail.com	Aqsa Riasat	User	e873e8bb-4435-4562-b595-59ba8898c092	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:36.942
fe13a9cf-6eef-4e13-a399-ef3a7e7c93fd	catalyst@theredstone.ai	Sajid Usman	User	0aa46452-b94e-481e-87c6-390d50c821b2	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:38.678
3568c048-c20c-4bf4-a54f-3c45bf405385	parisapari4u53@gmail.com	sonia soni	User	d20849a8-e976-4711-8e27-bc530aed0c4a	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:40.021
36b278cf-58db-43c9-b474-82fb21cb39d9	elishagill166@gmail.com	ELISHA eli	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:41.224
b218c085-cf6c-4ee1-a9fa-763270b591dd	rayasatmuhammad64@gmail.com	Aqsa Aqsa	User	258cb6d6-85be-4e4f-9830-107bac843987	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:42.635
d97b6187-d671-4347-8e66-adcce2ef25ba	email@theredstone.ai	Ali Hussain	User	eb13f924-6e62-47a6-a3c2-7708e677861c	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:44.36
88fb015e-614c-4983-88b2-0da1d7c7c1ae	arbazkhan164598@gmail.com	aqsa aqsa	User	e9152f33-af41-4c15-95f2-2d09b6feb174	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:46.579
6debfdd7-fde2-4ac3-b4ad-e1d68122f8c6	soniarabbani2166@gmail.com	Parisa Pari	User	cb56dd57-504f-4e19-99c0-e457999c5665	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:48.711
ecdf734f-9595-43f4-908e-5513b35b9bd3	parisaumerkhalil@gmail.com	sonia soni	User	22c55feb-de85-421b-bf76-7dd85ab66746	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:51.007
673b8411-9919-4a7a-9e82-10e52fb0758a	admin@smecert.ae	System Administrator	User	674d623b-c2d4-4648-8115-5d0b1d164865	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:04:52.374
adcbd406-3cf7-4563-893e-3487406afd02	user@example.com	Ahmed Al Mansouri	User	17f046a0-8c7f-45e7-84b2-5941c5189375	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:28.004
9fa3dd15-aa18-4988-9d9f-de6219d78895	user2@example.com	Sarah Khan	User	3bd38396-3d04-4b86-812c-4958e6cff136	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:30.13
8a4d8a9e-611b-45d9-abd3-4339f353ecf2	sme@techstartup.ae	Mohammad Al Hashimi	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:33.339
3550afd2-445f-4b85-a884-0ce83ad8ab01	sme@healthplus.ae	Dr. Fatima Al Zaabi	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:35.559
70cc438c-f2af-4511-98e6-2f7716c9960b	sme@retailhub.ae	Khalid Al Nasser	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:37.495
33f81d30-9dfb-4dbb-a17a-eb79eced0488	sme@newbusiness.ae	Layla Hassan	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:38.804
f8160382-7c71-41d0-910b-637d41c5c129	sme@constructco.ae	Omar Al Qassim	User	0918869a-495b-490d-95f2-604131cd34c9	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:40.821
aa9d7a6f-b9aa-4e41-a4f2-d7f0ccace47c	aqsariasat235@gmail.com	Aqsa Riasat	User	e873e8bb-4435-4562-b595-59ba8898c092	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:41.82
30574175-9fea-4122-b244-08dc9f8b9083	catalyst@theredstone.ai	Sajid Usman	User	0aa46452-b94e-481e-87c6-390d50c821b2	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:42.803
c9d40aae-47db-4181-b957-53c3aa0ff0db	parisapari4u53@gmail.com	sonia soni	User	d20849a8-e976-4711-8e27-bc530aed0c4a	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:44.769
36dfa70f-b2d5-4e11-8e16-4f4358fdee0e	elishagill166@gmail.com	ELISHA eli	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:46.675
ea715667-86c1-49e3-9141-d6ee6222ff3c	rayasatmuhammad64@gmail.com	Aqsa Aqsa	User	258cb6d6-85be-4e4f-9830-107bac843987	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:48.648
56e5375c-efd0-430e-9ebc-4dc11f9dd884	email@theredstone.ai	Ali Hussain	User	eb13f924-6e62-47a6-a3c2-7708e677861c	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:50.405
4022d3ad-56f9-4725-8d48-6f4271998b4f	arbazkhan164598@gmail.com	aqsa aqsa	User	e9152f33-af41-4c15-95f2-2d09b6feb174	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:51.577
2b606d2b-a4ac-466a-9cfb-79fa170f9182	soniarabbani2166@gmail.com	Parisa Pari	User	cb56dd57-504f-4e19-99c0-e457999c5665	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:53.901
8df68e1b-ea0e-4ea8-8452-b3085f26e7c8	parisaumerkhalil@gmail.com	sonia soni	User	22c55feb-de85-421b-bf76-7dd85ab66746	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:54.983
63ad9d24-da84-4c0e-8347-35abd143c918	admin@smecert.ae	System Administrator	User	674d623b-c2d4-4648-8115-5d0b1d164865	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:09:57.205
470b2dd0-3537-458a-afee-2cd1af0481ed	user@example.com	Ahmed Al Mansouri	User	17f046a0-8c7f-45e7-84b2-5941c5189375	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:10:50.446
8815aacd-7ffa-47d4-aa7a-5c95335e7d51	user2@example.com	Sarah Khan	User	3bd38396-3d04-4b86-812c-4958e6cff136	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:10:51.778
174806c4-0a55-466e-8094-f049093079d9	sme@techstartup.ae	Mohammad Al Hashimi	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:10:54.008
7fa3dd0f-e235-4860-8416-82de116afa54	sme@healthplus.ae	Dr. Fatima Al Zaabi	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:10:55.31
866b2c78-4883-4ccf-b5d3-6980ebb253e1	sme@retailhub.ae	Khalid Al Nasser	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:10:58.075
47c7330b-03f4-46e9-af59-9085606b9704	sme@newbusiness.ae	Layla Hassan	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:10:59.073
41896e83-71ef-4ffd-b692-a84aae1c13f7	sme@constructco.ae	Omar Al Qassim	User	0918869a-495b-490d-95f2-604131cd34c9	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:00.957
3a750dbc-4655-4c29-8b37-028324d68e5e	aqsariasat235@gmail.com	Aqsa Riasat	User	e873e8bb-4435-4562-b595-59ba8898c092	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:02.088
b60f0898-0433-49aa-a963-e8513c6fbe0e	catalyst@theredstone.ai	Sajid Usman	User	0aa46452-b94e-481e-87c6-390d50c821b2	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:04.095
f07e001f-2191-45a8-8c71-5a6ab62a5f4c	parisapari4u53@gmail.com	sonia soni	User	d20849a8-e976-4711-8e27-bc530aed0c4a	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:06.522
b0851e16-6036-4436-a3e3-aa30b3695150	elishagill166@gmail.com	ELISHA eli	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:07.675
d3d01eac-08b0-421b-8288-8724b932148a	rayasatmuhammad64@gmail.com	Aqsa Aqsa	User	258cb6d6-85be-4e4f-9830-107bac843987	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:14.197
7f0f153f-5303-4127-92ac-77c753e46eb2	email@theredstone.ai	Ali Hussain	User	eb13f924-6e62-47a6-a3c2-7708e677861c	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:16.38
b665b1f4-fffd-4a6f-9631-64d3b4854f61	arbazkhan164598@gmail.com	aqsa aqsa	User	e9152f33-af41-4c15-95f2-2d09b6feb174	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:17.596
da658fe8-6e5d-4819-af1e-85461eb90412	soniarabbani2166@gmail.com	Parisa Pari	User	cb56dd57-504f-4e19-99c0-e457999c5665	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:19.686
dd2a5cfb-7d01-4147-a8e0-e9490bb22d30	parisaumerkhalil@gmail.com	sonia soni	User	22c55feb-de85-421b-bf76-7dd85ab66746	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:20.711
f601c9ef-29db-4b64-9e1e-3befa50f8428	admin@smecert.ae	System Administrator	User	674d623b-c2d4-4648-8115-5d0b1d164865	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-07 16:11:22.895
f131349b-ee46-4519-b884-341f5898f7a7	parisaumerkhalil@gmail.com	sonia soni	SMEProfile	ea0c4da9-3fef-4433-8296-df1a4513c947	revision_required	Action Required: Update Your Application - Naywa	\N	sent	\N	{"companyName": "Al Noor Technologies", "revisionNotes": "Document \\"trade_license\\" requires revision: x"}	2026-02-07 20:29:03.811
a8b6b367-a196-4252-99a6-b0039a575a4a	javeria@gmail.com	aqsa aqsa	User	\N	verification	Verify Your Credentials - Naywa	\N	sent	\N	\N	2026-02-08 08:02:39.46
4e4db031-7be5-4dd3-acbc-100cd341a6f9	user@example.com	Ahmed Al Mansouri	User	17f046a0-8c7f-45e7-84b2-5941c5189375	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:28.739
79f26c45-20e1-4f99-b00b-0dba180a31de	user2@example.com	Sarah Khan	User	3bd38396-3d04-4b86-812c-4958e6cff136	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:30.633
5d796a9a-1fe9-497f-ae69-57f99e267268	sme@techstartup.ae	Mohammad Al Hashimi	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:31.665
1e5cde7a-9f36-4d02-9b47-0ffea26a6242	sme@healthplus.ae	Dr. Fatima Al Zaabi	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:34.674
5c0f8f51-e37c-40e3-8708-0839059e28c5	sme@retailhub.ae	Khalid Al Nasser	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:37.549
c60caa78-3975-4f2d-92ef-324142f4fc7e	sme@newbusiness.ae	Layla Hassan	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:39.474
79d92b26-2524-4370-8208-ffefa6f27f5f	user@example.com	Ahmed Al Mansouri	User	17f046a0-8c7f-45e7-84b2-5941c5189375	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:20:39.895
6aa6af47-9862-4d27-900f-8ece3d037d25	user2@example.com	Sarah Khan	User	3bd38396-3d04-4b86-812c-4958e6cff136	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:20:41.775
ab65e2ba-f05f-4c12-b939-fb05d3783da6	sme@constructco.ae	Omar Al Qassim	User	0918869a-495b-490d-95f2-604131cd34c9	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:42.06
a93374a7-2e64-48dd-9084-e252744efd1b	catalyst@theredstone.ai	Sajid Usman	User	0aa46452-b94e-481e-87c6-390d50c821b2	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:44.051
45c835d6-43ef-4b1b-8e76-2099c2f473b2	sme@techstartup.ae	Mohammad Al Hashimi	User	9a29bfa2-6177-45a8-a308-61c1f34fb13b	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:20:44.545
87011e34-6a3d-45f0-9963-e1e7f1d03c5c	parisapari4u53@gmail.com	sonia soni	User	d20849a8-e976-4711-8e27-bc530aed0c4a	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:46.993
6ecbb7bf-6905-49fb-a8b4-ff4dced85570	sme@healthplus.ae	Dr. Fatima Al Zaabi	User	c4bf6f2a-e8d1-43c5-96fc-088387e93232	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:20:47.375
82175287-a0f1-4940-9ac4-d48c01ca448a	sme@retailhub.ae	Khalid Al Nasser	User	0c7a2ae9-b24b-4741-962b-10155a4131d6	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:20:49.316
3e1fce0d-f37e-49f1-94bd-43a916edb29f	elishagill166@gmail.com	ELISHA eli	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:49.556
24bb30c7-bb97-4c89-8217-971a6abcdf86	sme@newbusiness.ae	Layla Hassan	User	f7677afa-4185-4c3f-ae44-aadd4ce6d886	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:20:50.56
bbe20c96-05b2-4edb-8f14-51f7151517a3	sme@constructco.ae	Omar Al Qassim	User	0918869a-495b-490d-95f2-604131cd34c9	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:20:51.591
d03cdc0e-032f-463c-91a9-292352f82445	rayasatmuhammad64@gmail.com	Aqsa Aqsa	User	258cb6d6-85be-4e4f-9830-107bac843987	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:52.306
e4028458-bcf3-4216-9bbb-dd4ec295f4d5	arbazkhan164598@gmail.com	aqsa aqsa	User	e9152f33-af41-4c15-95f2-2d09b6feb174	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:54.345
42f9a0b3-5575-439e-8492-28d8f98cc0ba	catalyst@theredstone.ai	Sajid Usman	User	0aa46452-b94e-481e-87c6-390d50c821b2	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:20:54.849
820075b2-0959-4b01-b971-82aecb31a7f0	aqsariasat235@gmail.com	Aqsa Riasat	User	e873e8bb-4435-4562-b595-59ba8898c092	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:56.358
8402c5b0-732a-4440-93f9-7d000bff9b30	parisapari4u53@gmail.com	sonia soni	User	d20849a8-e976-4711-8e27-bc530aed0c4a	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:20:56.912
9e6c012d-a631-4a9e-9744-23b85fd729d2	soniarabbani2166@gmail.com	Parisa Pari	User	cb56dd57-504f-4e19-99c0-e457999c5665	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:20:58.299
8db6e489-77d9-4552-b475-6de51c9beeb6	elishagill166@gmail.com	ELISHA eli	User	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:20:58.761
8a9f800c-7842-40ad-a903-b3bd430f8456	parisaumerkhalil@gmail.com	sonia soni	User	22c55feb-de85-421b-bf76-7dd85ab66746	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:21:00.145
4c41ff6f-a462-49ea-a11a-14e570cbefd2	rayasatmuhammad64@gmail.com	Aqsa Aqsa	User	258cb6d6-85be-4e4f-9830-107bac843987	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:21:00.627
53bba1bd-b2a1-4dbc-8eb3-1c2a0856b45a	email@theredstone.ai	Ali Hussain	User	eb13f924-6e62-47a6-a3c2-7708e677861c	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:21:01.248
d9b49461-5b2d-4c5f-83b9-592ceff93e68	arbazkhan164598@gmail.com	aqsa aqsa	User	e9152f33-af41-4c15-95f2-2d09b6feb174	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:21:02.455
401c13bf-278b-4e0a-bf19-05511eb8a06e	admin@smecert.ae	System Administrator	User	674d623b-c2d4-4648-8115-5d0b1d164865	legal_update	Policy Update: Certification Fees and Services - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-fees", "pageName": "Certification Fees and Services"}	2026-02-08 16:21:03.084
3c862518-1910-402f-8fde-ea87c760124d	aqsariasat235@gmail.com	Aqsa Riasat	User	e873e8bb-4435-4562-b595-59ba8898c092	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:21:05.246
7c8c9a3c-8845-4bc1-8f98-9f76307d7c2f	soniarabbani2166@gmail.com	Parisa Pari	User	cb56dd57-504f-4e19-99c0-e457999c5665	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:21:07.72
ad1f8454-edc9-4f69-8102-b6aea03aa809	parisaumerkhalil@gmail.com	sonia soni	User	22c55feb-de85-421b-bf76-7dd85ab66746	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:21:10.609
dbbe93e9-a01e-406d-8287-29bfd2463cb8	email@theredstone.ai	Ali Hussain	User	eb13f924-6e62-47a6-a3c2-7708e677861c	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:21:12.167
4581e09a-5283-423c-a950-985b91c0764f	admin@smecert.ae	System Administrator	User	674d623b-c2d4-4648-8115-5d0b1d164865	legal_update	Policy Update: Certification Standards - Naywa	\N	sent	\N	{"pageUrl": "https://sme.byredstone.com/certification-standards", "pageName": "Certification Standards"}	2026-02-08 16:21:14.031
\.


--
-- Data for Name: introduction_requests; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.introduction_requests (id, "requesterId", "smeProfileId", message, "contactPreferences", status, "requestedDate", "updatedAt", "respondedAt", "smeResponse") FROM stdin;
233e182d-f01a-48e9-ad0d-66cbb5ba08b5	17f046a0-8c7f-45e7-84b2-5941c5189375	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	We are interested in exploring potential technology partnerships for our digital transformation initiatives. Would love to schedule a meeting to discuss collaboration opportunities.	Email preferred, available Mon-Thu	pending	2026-01-30 15:24:46.994	2026-01-30 15:24:46.994	\N	\N
b9ef8a4b-51a4-4284-b6c6-7a4cbc0bfe27	3bd38396-3d04-4b86-812c-4958e6cff136	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	Our investment fund is evaluating healthcare sector opportunities. Would appreciate an introduction to discuss your growth plans.	Phone call or video meeting	viewed	2026-01-30 15:24:47.002	2026-01-30 15:24:47.002	\N	\N
133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	i want to know about your company	\N	responded	2026-01-30 20:07:32.104	2026-01-30 20:26:35.874	2026-01-30 20:26:35.873	hlo
26c33880-2196-4839-b1db-3db18e13ff07	258cb6d6-85be-4e4f-9830-107bac843987	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	hello	\N	pending	2026-02-02 12:41:35.496	2026-02-02 12:41:35.496	\N	\N
2f0de7c1-cae6-4f30-ac2b-8a31e2405fb8	0aa46452-b94e-481e-87c6-390d50c821b2	bff4a163-a102-4334-ad12-37b1a6e468c1	hlo	\N	pending	2026-02-02 15:22:30.52	2026-02-02 15:22:30.52	\N	\N
\.


--
-- Data for Name: legal_pages; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.legal_pages (id, slug, title, content, "isPublished", "lastUpdated", "updatedBy", "createdAt", "updatedAt") FROM stdin;
290ac61a-a5d5-410b-ae6a-fb3953f0d32c	terms	Terms of Service	**Effective Date:** [Insert Date]\n**Version:** 1.0\n\n## 1. Introduction\nThese Terms of Service ("Terms") govern access to and use of Naywa (the "Platform"), an SME readiness, certification, and registry service. By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, you must not use the Platform.\n\n## 2. Nature of the Platform\n**Naywa provides:**\n- SME readiness assessment\n- Certification based on submitted documentation\n- Inclusion in a read-only SME registry\n\n**Naywa does not:**\n- Facilitate fundraising or investment\n- Act as a marketplace or broker\n- Provide financial, legal, or investment advice\n- Guarantee funding, partnerships, or commercial outcomes\n\nCertification reflects a review at a point in time based on provided information only.\n\n## 3. Eligibility & Accounts\nYou represent that:\n- Information submitted is accurate and complete\n- You are authorized to act on behalf of the SME\n- You will keep credentials secure\n\nNaywa may suspend or terminate access if information is misleading, incomplete, or violates these Terms.\n\n## 4. Certification Process\n- Certification decisions are based on documentation submitted and internal review\n- Naywa reserves the right to approve, reject, revoke, or suspend certification\n- Certification may have an expiry date and require renewal\n- Any material change to SME information may invalidate certification and require re-review\n\n## 5. Registry\n- The registry is read-only for users and partners\n- Inclusion does not imply endorsement, investment worthiness, or performance ranking\n- Naywa controls visibility and may remove or suspend listings at its discretion\n\n## 6. Certificates\n- Certificates are issued digitally and may be downloaded as PDFs\n- Certificates include identifiers, issue date, and expiry date\n- Certificates are non-transferable and for verification purposes only\n- Misuse or misrepresentation of a certificate may result in revocation\n\n## 7. Data & Privacy\nUse of the Platform is subject to the Privacy Policy. Naywa processes data solely for certification, registry, compliance, and operational purposes.\n\n## 8. Limitation of Liability\nTo the fullest extent permitted by law:\n- Naywa is not liable for business outcomes, losses, or missed opportunities\n- Naywa does not warrant uninterrupted or error-free operation\n- Use of the Platform is at your own risk\n\n## 9. Modifications\nNaywa may update these Terms periodically. Continued use constitutes acceptance of revised Terms.\n\n## 10. Governing Law\nThese Terms are governed by the laws of the United Arab Emirates, unless otherwise stated.\n\n## 11. Contact\nFor certification or platform inquiries only: support@naywa.ae	t	2026-02-05 14:30:02.03	\N	2026-02-05 14:30:02.125	2026-02-05 14:30:02.125
cd645044-82c0-4ab6-b156-7a924b446e68	privacy	Privacy Policy	**Platform:** Naywa\n**Version:** 1.0\n**Effective Date:** [Insert Date]\n\n## 1. Introduction\nThis Privacy Policy explains how Naywa ("we", "us", "our") collects, uses, stores, and protects personal and business information when you access or use the Naywa platform (the "Platform").\n\nBy using the Platform, you acknowledge and agree to the practices described in this Privacy Policy.\n\n## 2. Scope of This Policy\nThis Policy applies to:\n- SME users submitting information for certification\n- Authorized representatives of SMEs\n- Partners or users accessing the SME registry\n- Administrators operating the Platform\n\nThis Policy does not apply to third-party websites or services that may be linked from the Platform.\n\n## 3. Information We Collect\n\n### 3.1 Information You Provide\nWe may collect the following categories of information:\n\n**SME & Business Information**\n- Company name, trade license number, registration details\n- Industry sector, location, and operational information\n- Supporting documents submitted for certification\n\n**User & Representative Information**\n- Name, email address, and contact details\n- Role or authorization to act on behalf of an SME\n- Identity verification information (where required for compliance)\n\n### 3.2 System & Usage Information\nWe may automatically collect limited technical information such as:\n- Login timestamps\n- IP addresses\n- Device or browser metadata\n- Actions performed on the Platform (for audit purposes)\n\nThis information is collected solely for security, compliance, and operational integrity.\n\n## 4. Purpose of Data Collection\nWe collect and process information only for the following purposes:\n- Operating the SME certification and review process\n- Verifying identity and authorization\n- Maintaining the SME registry\n- Ensuring platform security and auditability\n- Complying with legal, regulatory, or internal governance requirements\n\nNaywa does not use personal data for:\n- Advertising\n- Profiling\n- Marketing campaigns\n- Behavioral or popularity analysis\n\n## 5. Registry Visibility\nCertain non-personal SME information may appear in the public or partner-accessible registry once certification is granted.\n\nInclusion in the registry:\n- Does not imply endorsement\n- Does not rank or compare SMEs\n- Is subject to visibility controls and removal at Naywa's discretion\n\n## 6. Data Sharing\nNaywa does not sell, rent, or trade personal data.\n\nInformation may be shared only:\n- With internal administrators for certification and compliance\n- When required by applicable law or regulatory authority\n- With trusted service providers strictly for platform operation (under confidentiality obligations)\n\n## 7. Data Storage & Security\nWe apply reasonable administrative, technical, and organizational safeguards to protect data, including:\n- Access controls\n- Role-based permissions\n- Audit logging of sensitive actions\n\nDespite these measures, no system can be guaranteed to be fully secure.\n\n## 8. Data Retention\nInformation is retained only for as long as necessary to:\n- Operate the certification and registry process\n- Meet legal or regulatory requirements\n- Maintain audit and compliance records\n\nRetention periods may vary depending on data type and obligations.\n\n## 9. Your Responsibilities\nUsers are responsible for:\n- Providing accurate and up-to-date information\n- Maintaining the confidentiality of login credentials\n- Not submitting data they are not authorized to share\n\nMisuse or misrepresentation may result in access suspension.\n\n## 10. Your Rights\nSubject to applicable law, you may request:\n- Access to your information\n- Correction of inaccurate information\n\nRequests may be limited where data must be retained for compliance or audit purposes.\n\n## 11. Changes to This Policy\nWe may update this Privacy Policy from time to time. Updated versions will be posted on the Platform with a revised effective date.\n\nContinued use of the Platform constitutes acceptance of the updated Policy.\n\n## 12. Contact\nFor privacy or data-related inquiries only: support@naywa.ae	t	2026-02-05 14:30:02.129	\N	2026-02-05 14:30:02.13	2026-02-05 14:30:02.13
ad481c25-e65a-4285-a07d-f97c9dc48ad4	legal-notice	Legal Notice	**Platform:** Naywa\n**Version:** 1.0\n**Effective Date:** [Insert Date]\n\n## 1. Platform Status\nNaywa is a digital platform providing SME readiness assessment, certification, and registry services.\n\n**Naywa is not:**\n- A government authority\n- A financial institution\n- An investment platform\n- A marketplace or broker\n\nAny reference to "certification" relates solely to Naywa's internal review process and does not represent a government license, approval, or endorsement.\n\n## 2. No Financial or Investment Services\nNaywa does not:\n- Facilitate fundraising or capital raising\n- Collect or transfer funds\n- Match investors and businesses\n- Provide financial, legal, or investment advice\n\nUsers must make independent decisions and conduct their own due diligence.\n\n## 3. No Guarantee of Outcomes\nCertification or inclusion in the registry:\n- Does not guarantee funding, partnerships, or commercial success\n- Does not imply performance ranking or endorsement\n- Reflects a point-in-time review based on submitted information\n\nNaywa makes no warranties regarding outcomes.\n\n## 4. Accuracy of Information\nWhile reasonable efforts are made to review submitted information, Naywa relies on the accuracy and completeness of data provided by users.\n\nNaywa is not responsible for:\n- False or misleading submissions\n- Third-party reliance on registry information\n- Decisions made based on registry listings\n\n## 5. Limitation of Liability\nTo the fullest extent permitted by law, Naywa shall not be liable for:\n- Business losses\n- Indirect or consequential damages\n- Decisions or actions taken by users or third parties\n\nUse of the platform is at the user's own risk.\n\n## 6. Intellectual Property\nAll platform content, trademarks, logos, and materials are the property of Naywa unless otherwise stated.\n\nUnauthorized use is prohibited.\n\n## 7. Governing Law\nThis Legal Notice is governed by the laws of the United Arab Emirates, unless otherwise required by applicable regulations.\n\n## 8. Contact\nFor legal or compliance inquiries only: support@naywa.ae	t	2026-02-05 14:30:02.136	\N	2026-02-05 14:30:02.137	2026-02-05 14:30:02.137
697e39e0-a0ef-4b8c-8bbd-20951c1caf85	contact	Contact	## Contact Naywa\n\nFor certification, registry, or platform-related inquiries, please contact us using the details below.\n\n**Email:** support@naywa.ae\n\n## Scope of Support\n- Certification process questions\n- Registry access issues\n- Account or technical support\n\n## Please Note\nNaywa does not provide:\n- Investment advice\n- Funding assistance\n- Partnership matchmaking	t	2026-02-05 14:30:02.142	\N	2026-02-05 14:30:02.143	2026-02-05 14:30:02.143
cert-standards-001	certification-standards	Certification Standards	## 1. Purpose of Certification\n\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\n\nCertification is intended to support transparency and informed decision-making. It does not constitute a regulatory approval, guarantee, endorsement, or legal opinion.\n\n## 2. Scope of Certification\n\nCertification is based solely on information and documentation submitted by the applicant and reviewed in accordance with Naywa's internal assessment framework.\n\nThe scope of certification includes, but is not limited to:\n- Legal existence and registration\n- Ownership and authorized control\n- Financial documentation and disclosures\n- Operational and business information\n- Sector-specific considerations where applicable\n\nCertification does not replace, override, or substitute any statutory, regulatory, or licensing requirements imposed by relevant authorities.\n\n## 3. Certification Process\n\nThe certification process follows a structured review of submitted documentation.\n\nApplicants are guided through required submissions during the application process. Review outcomes are determined based on completeness, consistency, and professional judgement applied at the time of review.\n\nInternal assessment criteria, weighting, and review logic are proprietary and are not disclosed.\n\n## 4. Certification Outcomes\n\nUpon completion of review, an application may be:\n- Approved\n- Returned for clarification or additional information\n- Deferred\n- Declined\n\nApplicants are notified only of high-level outcomes or requests for additional information. Detailed internal deliberations are not disclosed.\n\n## 5. Validity, Suspension, and Revocation\n\nCertification is valid for a defined period from the date of issue, unless otherwise stated.\n\nCertification may be suspended or revoked if:\n- Material information is found to be inaccurate or incomplete\n- Circumstances materially change\n- Required updates or clarifications are not provided\n\nNaywa reserves the right to update certification status to preserve registry accuracy and integrity.\n\n## 6. Registry Inclusion & Verification\n\nCertified entities may be listed in Naywa's registry for verification purposes.\n\nEach certification includes a unique identifier and verification mechanism. Third parties are encouraged to verify certification status directly through Naywa's official registry.\n\nIn the event of any discrepancy, the registry record shall prevail over any downloaded or printed certificate.\n\n## 7. Limitations\n\nCertification reflects an assessment conducted at a specific point in time based on information provided by the applicant.\n\nNaywa does not:\n- Guarantee future performance or outcomes\n- Provide investment, financial, or legal advice\n- Assume responsibility for third-party decisions or reliance\n\nAll users are responsible for conducting their own independent assessments where required.\n\n## 8. Confidentiality & Data Handling\n\nInformation submitted for certification is handled in accordance with Naywa's Privacy Policy and applicable data protection standards.\n\nAccess to submitted information is limited to certification purposes and authorized review processes.\n\n## 9. Amendments\n\nNaywa may update these Certification Standards from time to time to reflect operational, legal, or governance considerations. Updates take effect upon publication.\n\nContinued use of the platform constitutes acceptance of the updated Certification Standards.	t	2026-02-07 16:10:42.301	674d623b-c2d4-4648-8115-5d0b1d164865	2026-02-06 21:04:33.688	2026-02-07 16:10:42.302
1152c08e-dffa-4dc9-a456-d519e77247f4	certification-fees	Certification Fees and Services	## Overview\n\nNaywa provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency purposes. Certification outcomes may include certified, deferred, or declined, based solely on the documentation submitted.\n\n## Fee Determination\n\nCertification fees are determined administratively on a case-by-case basis. The applicable fee may vary depending on factors such as the scope of certification, entity profile, and nature of the assessment required.\n\nThere is no standard published rate. Fees are communicated directly to the applicant following a certification decision.\n\n## Payment Process\n\nPayment is requested only after the certification application has been reviewed and a certification decision has been reached. No payment is required at the time of application submission.\n\nUpon approval, the applicant will receive a payment request with the applicable fee amount and invoice details.\n\n## VAT Information\n\nNaywa is currently not registered for VAT under UAE VAT Law. As such, VAT is not applicable to certification fees at this time.\n\nVAT status is indicated on all invoices issued. Should VAT registration status change in the future, the applicable VAT at the applicable rate under UAE VAT Law will be applied and clearly reflected on invoices with a full breakdown.\n\n---\n\n*This page is provided for informational purposes only and does not constitute a fee schedule, price list, or contractual offer. All fees are subject to administrative determination and may be updated without prior notice.*\n\n*Certification fees do not include legal, regulatory, financial, or advisory services, and do not constitute licensing, endorsement, or any guarantee of funding or investment.*\n\n*Certification outcomes are based solely on information submitted by the applicant and do not constitute verification of underlying facts beyond the scope of the assessment.*\n\n*Certified entities may be subject to future re-certification under separately communicated terms.*	t	2026-02-09 06:29:56.902	674d623b-c2d4-4648-8115-5d0b1d164865	2026-02-08 16:19:20.115	2026-02-09 06:29:56.903
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.payments (id, "paymentId", "smeProfileId", amount, currency, description, status, "stripePaymentIntentId", "stripeClientSecret", "stripeChargeId", "requestedById", "requestedAt", "paidAt", "failedAt", "failureReason", "invoiceNumber", "receiptUrl", "createdAt", "updatedAt") FROM stdin;
752ac41f-667d-4ac0-a3d9-f84c0184193a	PAY-AFFF4C53	ea0c4da9-3fef-4433-8296-df1a4513c947	500.00	AED	SME Certification Fee	failed	\N	\N	\N	674d623b-c2d4-4648-8115-5d0b1d164865	2026-02-09 20:41:23.552	\N	\N	Cancelled by admin	NAYWA-INV-E7FBC141	\N	2026-02-09 20:41:23.553	2026-02-09 20:41:31.435
e8cf399e-10c0-415c-a3e3-dbe4c35aa775	PAY-71C00457	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	500.00	AED	SME Certification Fee	failed	\N	\N	\N	674d623b-c2d4-4648-8115-5d0b1d164865	2026-02-06 21:48:52.291	\N	\N	Cancelled by admin	NAYWA-INV-608BBEE7	\N	2026-02-06 21:48:52.292	2026-02-10 03:59:33.232
21414c40-824c-4a93-b10d-a99999247f18	PAY-88DFEF63	bff4a163-a102-4334-ad12-37b1a6e468c1	400.00	AED	SME Certification Fee	pending	\N	\N	\N	674d623b-c2d4-4648-8115-5d0b1d164865	2026-02-10 04:01:43.544	\N	\N	\N	NAYWA-INV-41362745	\N	2026-02-10 04:01:43.544	2026-02-10 04:01:43.544
\.


--
-- Data for Name: sme_profiles; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.sme_profiles (id, "userId", "companyName", "tradeLicenseNumber", "companyDescription", "industrySector", "foundingDate", "employeeCount", "annualRevenue", website, address, documents, "certificationStatus", "submittedDate", "reviewedById", "revisionNotes", "listingVisible", "createdAt", "updatedAt", "auditorName", "bankAccountNumber", "bankName", "boardMembers", "businessModel", "complianceOfficerEmail", "complianceOfficerName", "existingCertifications", "fundingStage", "hasAmlPolicy", "hasDataProtectionPolicy", "headOfficeAddress", "headOfficeLatitude", "headOfficeLongitude", "lastAuditDate", "legalStructure", "licenseExpiryDate", "linkedinUrl", "majorClients", "officeType", "operatingCountries", "ownerIdNumber", "ownerName", "ownerNationality", "profitMargin", "registrationCity", "registrationCountry", "registrationNumber", "regulatoryLicenses", "secondaryContactEmail", "secondaryContactName", "secondaryContactPhone", "shareholderStructure", "socialMedia", "vatNumber", "internalDimensions", "internalNotes", "internalReviewStartedAt", "lastInternalReviewAt") FROM stdin;
50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	9a29bfa2-6177-45a8-a308-61c1f34fb13b	TechStart UAE	TL-2024-001234	Leading technology solutions provider specializing in AI and machine learning applications for businesses in the GCC region.	technology	2020-03-15 00:00:00	25	2500000.00	https://techstart.ae	Dubai Internet City, Building 5, Office 301	"[{\\"name\\":\\"Trade License\\",\\"path\\":\\"/uploads/tl-techstart.pdf\\",\\"uploadedAt\\":\\"2024-01-15\\"},{\\"name\\":\\"Financial Statement\\",\\"path\\":\\"/uploads/fs-techstart.pdf\\",\\"uploadedAt\\":\\"2024-01-15\\"}]"	certified	2024-01-20 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-01-30 15:24:46.85	2026-01-30 15:24:46.85	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c8d8db60-d7ab-4b2e-b13e-bd6197169d72	c4bf6f2a-e8d1-43c5-96fc-088387e93232	HealthPlus Medical Center	TL-2024-005678	Premium healthcare provider offering comprehensive medical services with state-of-the-art facilities.	healthcare	2018-07-10 00:00:00	45	5000000.00	https://healthplus.ae	Healthcare City, Abu Dhabi	"[{\\"name\\":\\"Trade License\\",\\"path\\":\\"/uploads/tl-healthplus.pdf\\",\\"uploadedAt\\":\\"2024-02-01\\"},{\\"name\\":\\"Healthcare License\\",\\"path\\":\\"/uploads/hl-healthplus.pdf\\",\\"uploadedAt\\":\\"2024-02-01\\"}]"	certified	2024-02-05 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-01-30 15:24:46.87	2026-01-30 15:24:46.87	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c5be1bd8-8f06-4623-9a58-0c66ee912a38	f7677afa-4185-4c3f-ae44-aadd4ce6d886	NewBiz Solutions	\N	\N	finance	\N	\N	\N	\N	\N	\N	draft	\N	\N	\N	f	2026-01-30 15:24:46.902	2026-01-30 15:24:46.902	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
67ab0070-d300-4e07-b86b-b4d41d7f9d6a	0918869a-495b-490d-95f2-604131cd34c9	ConstructCo Building Materials	TL-2024-003456	Building materials supplier for construction projects across UAE.	manufacturing	2017-05-12 00:00:00	60	8000000.00	https://constructco.ae	Jebel Ali Free Zone	\N	revision_requested	2024-02-15 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	Please provide updated financial statements for the last fiscal year and valid trade license copy.	f	2026-01-30 15:24:46.912	2026-01-30 15:24:46.912	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
f68a5830-0b06-49b3-b08f-0ebb2f219350	0c7a2ae9-b24b-4741-962b-10155a4131d6	RetailHub Trading	TL-2024-009012	Multi-channel retail business specializing in consumer electronics and home appliances.	retail	2019-11-20 00:00:00	30	3200000.00	https://retailhub.ae	Sharjah Industrial Area	"[{\\"name\\":\\"Trade License\\",\\"path\\":\\"/uploads/tl-retailhub.pdf\\",\\"uploadedAt\\":\\"2024-03-01\\"}]"	rejected	2024-03-05 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	nothing	f	2026-01-30 15:24:46.886	2026-01-31 16:37:56.438	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e86fa395-04ca-4c30-aef9-d60073ebd829	d20849a8-e976-4711-8e27-bc530aed0c4a	REDSTONE CATALYST	727161	\N	healthcare	\N	\N	\N	\N	\N	\N	draft	\N	\N	\N	f	2026-02-02 13:30:46.764	2026-02-02 13:30:46.764	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c24e36a9-ef8d-48f6-a03e-6649d21dad2b	d88b3155-20b4-4c5d-bb70-f6d5007358b5	CRS LLC	45312	\N	healthcare	\N	\N	\N	\N	\N	\N	draft	\N	\N	\N	f	2026-02-05 21:10:16.079	2026-02-05 21:10:16.079	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
159197cd-de45-4585-93e1-1b4b284f9ed3	e9152f33-af41-4c15-95f2-2d09b6feb174	redstone	7548695	\N	technology	\N	\N	\N	\N	\N	{"uploadedFiles": []}	draft	\N	\N	\N	f	2026-02-06 16:18:55.652	2026-02-06 16:58:07.886	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e08d8b84-de5a-46b0-a2ca-a53a6c58b252	eb13f924-6e62-47a6-a3c2-7708e677861c	tjara	9876	tjara	finance	2026-01-16 00:00:00	175	\N	tjara.com	USA	{"companyLogo": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769877885750-862383348-Catalyst_Logo__1_.png", "contactName": "ali", "contactEmail": "aqsariasat235@gmail.com", "contactPhone": "+92545028212", "fundingStage": "seed", "revenueRange": ">100m", "revenueGrowth": "10-25", "uploadedFiles": [{"id": "doc_1769802932396_fwx40o9h8", "name": "1769802932382-997599077-5G_JOBS.pdf", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802932382-997599077-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-01-30T19:55:32.396Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1769802955799_yi71k4lh8", "name": "1769802955795-547704221-4784e97d99d60fbbc4723864e3f57281.jpg", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802955795-547704221-4784e97d99d60fbbc4723864e3f57281.jpg", "size": 17232, "type": "certificate_of_incorporation", "mimeType": "image/jpeg", "uploadedAt": "2026-01-30T19:55:55.799Z", "originalName": "4784e97d99d60fbbc4723864e3f57281.jpg"}, {"id": "doc_1769802999963_3wp3z6c0w", "name": "1769802999959-490222575-Catalyst_Logo_red__1_.png", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802999959-490222575-Catalyst_Logo_red__1_.png", "size": 38309, "type": "financial_statements", "mimeType": "image/png", "uploadedAt": "2026-01-30T19:56:39.963Z", "originalName": "Catalyst_Logo_red (1).png"}, {"id": "doc_1769803012292_dzn6dwtlb", "name": "1769803012286-509302961-Catalyst_Logo__1_.png", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769803012286-509302961-Catalyst_Logo__1_.png", "size": 11185, "type": "company_profile", "mimeType": "image/png", "uploadedAt": "2026-01-30T19:56:52.292Z", "originalName": "Catalyst_Logo (1).png"}], "contactPosition": "ceo"}	certified	2026-01-31 17:57:01.451	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-01-30 18:41:16.261	2026-02-07 00:03:10.865	YES		NBD	[]	b2b	aqsa	aqsa	[]	series_a	t	t	Dubai	\N	\N	2026-02-13 00:00:00	llc	2026-02-28 00:00:00	www	[]	own_premises	[]	533990	Ali	UAE	\N	Dubai	UAE	12345	[]	email@theredstone.ai	Ali	+92518434024	[]	{}	123	{"business_model": "not_reviewed", "legal_ownership": "under_review", "risk_continuity": "not_reviewed", "governance_controls": "not_reviewed", "financial_discipline": "not_reviewed"}	\N	2026-02-06 17:45:45.378	2026-02-07 00:03:10.864
ddbf9e93-420c-4056-9fb4-ac8939f13efb	cd0990a6-9a5f-4758-aebc-e215b7a66ff8	redstone	TEST-727161	\N	technology	\N	\N	\N	\N	\N	\N	draft	\N	\N	\N	f	2026-02-08 08:02:37.162	2026-02-08 08:02:37.162	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
ea0c4da9-3fef-4433-8296-df1a4513c947	22c55feb-de85-421b-bf76-7dd85ab66746	Al Noor Technologies	4356456	Minimum 100 characters recommended for better visibility Minimum 100 characters recommended for better visibility	technology	2026-09-07 00:00:00	75	\N	https://example.com	Business Location Business Location Business Location	{"companyLogo": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770469881417-617603422-5c8c4370299b453f7d56029b15c13e72.jpg", "contactName": "Soniya Rabbani", "contactEmail": "sonia@theredstone.ai", "contactPhone": "+923009842041", "revenueRange": "10m-50m", "revenueGrowth": "25-50", "uploadedFiles": [{"id": "doc_1770470062060_bqwp3duab", "name": "1770470062056-918609861-5G_JOBS.pdf", "path": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470062056-918609861-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "version": 1, "mimeType": "application/pdf", "uploadedAt": "2026-02-07T13:14:22.060Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770470070502_1wutfafbo", "name": "1770470070500-97820719-5G_JOBS.pdf", "path": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470070500-97820719-5G_JOBS.pdf", "size": 101099, "type": "company_registration", "version": 1, "mimeType": "application/pdf", "uploadedAt": "2026-02-07T13:14:30.502Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770470082808_0t7g98d36", "name": "1770470082806-246528705-5G_JOBS.pdf", "path": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470082806-246528705-5G_JOBS.pdf", "size": 101099, "type": "signatory_id", "version": 1, "mimeType": "application/pdf", "uploadedAt": "2026-02-07T13:14:42.808Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770470091891_oudve3qg1", "name": "1770470091889-104533731-5G_JOBS.pdf", "path": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470091889-104533731-5G_JOBS.pdf", "size": 101099, "type": "financial_statements", "version": 1, "mimeType": "application/pdf", "uploadedAt": "2026-02-07T13:14:51.891Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770470096883_4wn0s2db6", "name": "1770470096881-73937440-5G_JOBS.pdf", "path": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470096881-73937440-5G_JOBS.pdf", "size": 101099, "type": "company_profile", "version": 1, "mimeType": "application/pdf", "uploadedAt": "2026-02-07T13:14:56.883Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770470123750_cvq0xb7dm", "name": "1770470123748-721487310-5G_JOBS.pdf", "path": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470123748-721487310-5G_JOBS.pdf", "size": 101099, "type": "ubo_declaration", "version": 1, "mimeType": "application/pdf", "uploadedAt": "2026-02-07T13:15:23.750Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770470128276_p1nk1lieu", "name": "1770470128274-312665546-5G_JOBS.pdf", "path": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470128274-312665546-5G_JOBS.pdf", "size": 101099, "type": "moa_shareholding", "version": 1, "mimeType": "application/pdf", "uploadedAt": "2026-02-07T13:15:28.276Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770470134645_yaf1gm733", "name": "1770470134643-76186643-5G_JOBS.pdf", "path": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470134643-76186643-5G_JOBS.pdf", "size": 101099, "type": "vat_certificate", "version": 1, "mimeType": "application/pdf", "uploadedAt": "2026-02-07T13:15:34.645Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770470138045_aohytdvw4", "name": "1770470138043-514901878-5G_JOBS.pdf", "path": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470138043-514901878-5G_JOBS.pdf", "size": 101099, "type": "certificate_of_incorporation", "version": 1, "mimeType": "application/pdf", "uploadedAt": "2026-02-07T13:15:38.045Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770470146272_9vt8ce96b", "name": "1770470146270-803816687-5G_JOBS.pdf", "path": "/uploads/22c55feb-de85-421b-bf76-7dd85ab66746/1770470146270-803816687-5G_JOBS.pdf", "size": 101099, "type": "licenses_permits", "version": 1, "mimeType": "application/pdf", "uploadedAt": "2026-02-07T13:15:46.272Z", "originalName": "5G JOBS.pdf"}], "contactPosition": "Managing Director"}	certified	2026-02-07 13:25:56.501	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-02-07 13:06:08.72	2026-02-09 15:26:58.386	ABC Auditing & Consulting LLC		Emirates NBD	[]	b2b	sonia@theredstone.ai	hania mirza	[]	bootstrapped	t	t	Office No. 1204, Al Fahidi Business Center, Bur Dubai, Dubai, United Arab Emirates	\N	\N	2026-02-12 00:00:00	corporation	2027-02-07 00:00:00	https://linkedin.com/company/carebridge-health-solutions	[]	own_premises	[]	784-1990-1234567-1	testing soni	Emirati	\N	Dubai	United Arab Emirates	CR-987654	[]	sonia@theredstone.ai	Haniya Khan	+923009842041	[]	{}	VAT-TRN-123456789000001	\N	\N	\N	\N
bff4a163-a102-4334-ad12-37b1a6e468c1	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	UAE GEM	65432	UAE GEM is a manufacturing-based company specializing in the production, processing, and distribution of high-quality industrial and commercial products. The company focuses on efficient manufacturing practices, quality control, and timely delivery to meet client and market demands across the UAE and regional markets.	manufacturing	2018-03-15 00:00:00	25	\N	https://example.com	Warehouse No. 12, Industrial Area 3,\nAl Qusais, Dubai,\nUnited Arab Emirates	{"companyLogo": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770042484831-850257127-bird_2.jpg", "contactName": "Sara Mahmood", "contactEmail": "contact@company.ae", "contactPhone": "+971 50 123 4567", "revenueRange": "50m-100m", "revenueGrowth": "10-25", "uploadedFiles": [{"id": "doc_1770043728158_ieg3lksig", "name": "1770043728155-200027744-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043728155-200027744-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:48:48.158Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770043733837_e3x2qyqvz", "name": "1770043733835-417939527-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043733835-417939527-5G_JOBS.pdf", "size": 101099, "type": "certificate_of_incorporation", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:48:53.837Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770043737648_tp3d1f5s5", "name": "1770043737646-144276519-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043737646-144276519-5G_JOBS.pdf", "size": 101099, "type": "financial_statements", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:48:57.648Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770043742667_f3ufqhezq", "name": "1770043742665-313672501-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043742665-313672501-5G_JOBS.pdf", "size": 101099, "type": "company_profile", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:49:02.667Z", "originalName": "5G JOBS.pdf"}], "contactPosition": "Managing Director"}	certified	2026-02-02 14:49:15.627	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-02-02 14:19:21.15	2026-02-09 20:48:01.215	ABC Auditing & Consulting LLC		Emirates NBD	[]	b2b	compliance@company.ae	Fatima Noor	[]	bootstrapped	f	f	Office 405, Building A, Dubai Silicon Oasis, Dubai, United Arab Emirates	\N	\N	2026-06-30 00:00:00	llc	2026-12-31 00:00:00	https://linkedin.com/company/uae-gem	[]	own_premises	[]	784-1990-1234567-1	ELISHA ELI	Emirati	\N	Dubai	United Arab Emirates	CR-987654	[]	secondary@company.ae	Omar Khan	+971 55 987 6543	[]	{}	VAT-TRN-123456789000001	\N	\N	\N	\N
\.


--
-- Data for Name: support_messages; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.support_messages (id, "ticketId", "senderId", content, "isRead", "createdAt") FROM stdin;
8c301fe0-bedd-40de-be54-ac0f5370e583	882e0107-098a-4456-89e3-e9a6d2362b1d	eb13f924-6e62-47a6-a3c2-7708e677861c	help about registration	t	2026-01-31 18:36:22.606
c5ed4008-50b9-4144-b00e-310d0743d956	882e0107-098a-4456-89e3-e9a6d2362b1d	674d623b-c2d4-4648-8115-5d0b1d164865	hlo	t	2026-01-31 18:36:40.605
68df5fe1-22b3-4d72-8690-fe5341702708	9acc5f83-0126-4770-86ac-c2c2df02cf37	eb13f924-6e62-47a6-a3c2-7708e677861c	hello how r u ?	t	2026-02-02 12:28:23.834
6243d330-345c-4e84-9f0f-f48e1324096f	cea61170-97a5-4d84-991c-4051669e5d59	eb13f924-6e62-47a6-a3c2-7708e677861c	testing issues 	t	2026-02-02 12:22:12.125
5aa3f2f8-c75d-4ec3-bb54-5b2bef28b467	cea61170-97a5-4d84-991c-4051669e5d59	eb13f924-6e62-47a6-a3c2-7708e677861c	hello	t	2026-02-02 12:23:55.761
d8f0544c-6dec-4542-863c-0e021dc423a4	ccc854ba-5bd5-49b4-9061-81eeb6f2ee2a	eb13f924-6e62-47a6-a3c2-7708e677861c	testing testing testing	t	2026-02-02 12:19:53.22
b42e3743-7101-4f36-9ef8-009bce4cfa2e	ccc854ba-5bd5-49b4-9061-81eeb6f2ee2a	eb13f924-6e62-47a6-a3c2-7708e677861c	hello	t	2026-02-02 12:20:35.522
e89c7ea5-cbdc-4029-9e06-b5e78dbd902a	832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	hlo	t	2026-02-01 18:52:03.14
c9aeb0ac-732b-4b9a-9f00-fe6f8cefd44d	7bd390f4-17b2-44f1-a284-1c87343cf7aa	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	Hello Team,\nThis is a test support request submitted to verify the support form functionality. Please ignore this message as it is for testing purposes only.\nThank you.	t	2026-02-02 14:50:19.682
2df438cd-91a8-4f6b-a4bc-927b087c9441	cea61170-97a5-4d84-991c-4051669e5d59	674d623b-c2d4-4648-8115-5d0b1d164865	hi	t	2026-02-02 12:47:49.053
4d701b91-d70f-42f7-8c33-47acb00e1d59	cea61170-97a5-4d84-991c-4051669e5d59	674d623b-c2d4-4648-8115-5d0b1d164865	how can i help u?	t	2026-02-02 12:48:02.381
6dab54dc-e0e0-4bba-b6d3-7e8cbcd691c1	9acc5f83-0126-4770-86ac-c2c2df02cf37	eb13f924-6e62-47a6-a3c2-7708e677861c	[ATTACHMENT]{"type":"attachment","fileName":"1770281020935-303165317.png","originalName":"Screenshot 2026-02-04 at 4.03.48â¯PM.png","mimeType":"image/png","size":241189,"path":"/api/support/tickets/9acc5f83-0126-4770-86ac-c2c2df02cf37/download/1770281020935-303165317.png"}	t	2026-02-05 08:43:40.943
db28544c-29db-45b7-820d-bd978f10fde4	832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	[ATTACHMENT]{"type":"attachment","fileName":"1770048857856-998708406.png","originalName":"Screenshot 2026-02-01 at 9.43.08aÌ_Â¯PM (1).png","mimeType":"image/png","size":316935,"path":"/api/support/tickets/832bd7c1-3926-4750-80c8-d964da4ae3d6/download/1770048857856-998708406.png"}	t	2026-02-02 16:14:17.862
113094e9-532a-4919-a006-5e30954d7d0f	832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	[ATTACHMENT]{"type":"attachment","fileName":"1770220533729-316146566.png","originalName":"screencapture-localhost-3000-2026-02-03-19_53_16.png","mimeType":"image/png","size":708342,"path":"/api/support/tickets/832bd7c1-3926-4750-80c8-d964da4ae3d6/download/1770220533729-316146566.png"}	t	2026-02-04 15:55:33.736
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.support_tickets (id, "userId", subject, status, priority, "createdAt", "updatedAt", "closedAt") FROM stdin;
882e0107-098a-4456-89e3-e9a6d2362b1d	eb13f924-6e62-47a6-a3c2-7708e677861c	help about registration	closed	medium	2026-01-31 18:36:22.606	2026-01-31 18:37:08.981	2026-01-31 18:37:08.98
cea61170-97a5-4d84-991c-4051669e5d59	eb13f924-6e62-47a6-a3c2-7708e677861c	testing request	resolved	medium	2026-02-02 12:22:12.125	2026-02-02 12:48:13.418	2026-02-02 12:48:13.418
ccc854ba-5bd5-49b4-9061-81eeb6f2ee2a	eb13f924-6e62-47a6-a3c2-7708e677861c	testing	in_progress	medium	2026-02-02 12:19:53.22	2026-02-02 12:48:57.926	\N
7bd390f4-17b2-44f1-a284-1c87343cf7aa	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	hi	in_progress	medium	2026-02-02 14:50:19.682	2026-02-02 14:52:36.73	\N
832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	hlo	open	medium	2026-02-01 18:52:03.14	2026-02-04 15:55:33.741	\N
9acc5f83-0126-4770-86ac-c2c2df02cf37	eb13f924-6e62-47a6-a3c2-7708e677861c	testing	open	medium	2026-02-02 12:28:23.834	2026-02-05 08:43:40.947	\N
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.user_profiles (id, "userId", company, "jobTitle", "createdAt", "updatedAt", "annualIncome", "authRepEmail", "authRepEmiratesId", "authRepName", "authRepPhone", "authRepPosition", "beneficialOwners", city, "companyAddress", "companyAnnualRevenue", "companyCity", "companyCountry", "companyEmployeeCount", "companyName", "companyPoBox", "companyType", country, "dateOfBirth", "emiratesId", "emiratesIdExpiry", "employerName", "employmentStatus", gender, "investmentBudget", "investmentInterests", "investorType", "kycDocuments", "kycRejectionReason", "kycReviewedAt", "kycReviewedBy", "kycRevisionNotes", "kycStatus", "kycSubmittedAt", nationality, occupation, "passportCountry", "passportExpiry", "passportNumber", "poBox", "registrationAuthority", "registrationDate", "registrationNumber", "residencyStatus", "residentialAddress", "riskTolerance", "sourceOfFunds", "tradeLicenseExpiry", "tradeLicenseNumber") FROM stdin;
568414a6-8bc5-400c-ab6d-b1b0e5bf5f11	17f046a0-8c7f-45e7-84b2-5941c5189375	Dubai Investment Partners	Business Development Manager	2026-01-30 15:24:46.721	2026-01-30 15:24:46.721	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	not_submitted	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c46be5b7-5191-4646-b2f4-a65b7453d2be	3bd38396-3d04-4b86-812c-4958e6cff136	Abu Dhabi Ventures	Investment Analyst	2026-01-30 15:24:46.738	2026-01-30 15:24:46.738	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	not_submitted	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32b17582-71e2-4c85-bf62-2d50f89655db	258cb6d6-85be-4e4f-9830-107bac843987	redtsone	\N	2026-01-31 08:33:53.821	2026-02-04 15:54:07.016	100k_250k	\N	\N	\N	\N	\N	\N	pakistan	\N	\N	\N	\N	\N	\N	\N	\N	pakistan	2026-02-03 00:00:00	Y45788	2046-03-20 00:00:00	\N	employed	female	\N	\N	individual	[{"name": "Screenshot 2026-02-02 at 3.49.59â¯PM.png", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021800137-42029610-Screenshot_2026_02_02_at_3_49_59___PM.png", "type": "emirates_id_front", "uploadedAt": "2026-02-02T08:43:20.141Z"}, {"name": "Screenshot 2026-02-02 at 3.49.59â¯PM.png", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021840868-302677117-Screenshot_2026_02_02_at_3_49_59___PM.png", "type": "emirates_id_back", "uploadedAt": "2026-02-02T08:44:00.870Z"}, {"name": "Screenshot 2026-02-02 at 3.49.59â¯PM.png", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021849377-26333005-Screenshot_2026_02_02_at_3_49_59___PM.png", "type": "passport", "uploadedAt": "2026-02-02T08:44:09.379Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021877502-772281117-5G_JOBS.pdf", "type": "proof_of_address", "uploadedAt": "2026-02-02T08:44:37.503Z"}]	\N	2026-02-02 10:11:40.614	674d623b-c2d4-4648-8115-5d0b1d164865	\N	approved	2026-02-02 08:44:39.765	UAE	pakistan	pakistan	2036-02-20 00:00:00	76347578	\N	\N	\N	\N	resident	pakistan	\N	business	\N	\N
b8c7b643-7d83-4b7c-a425-72fa717e5c76	cb56dd57-504f-4e19-99c0-e457999c5665	soni	\N	2026-02-07 13:50:55.673	2026-02-07 14:09:25.266	100k_250k	\N	\N	\N	\N	\N	\N	Dubai	\N	\N	\N	\N	\N	\N	\N	\N	\N	1994-09-06 00:00:00	784-XXXX-XXXXXXX-X	2030-02-10 00:00:00	\N	employed	female	\N	\N	individual	[{"name": "5G JOBS (1).pdf", "path": "/uploads/cb56dd57-504f-4e19-99c0-e457999c5665/1770472792703-873314234-5G_JOBS__1_.pdf", "type": "emirates_id_front", "uploadedAt": "2026-02-07T13:59:52.704Z"}, {"name": "5G JOBS (1).pdf", "path": "/uploads/cb56dd57-504f-4e19-99c0-e457999c5665/1770472797109-827349838-5G_JOBS__1_.pdf", "type": "emirates_id_back", "uploadedAt": "2026-02-07T13:59:57.110Z"}, {"name": "5G JOBS (1).pdf", "path": "/uploads/cb56dd57-504f-4e19-99c0-e457999c5665/1770472808044-972221656-5G_JOBS__1_.pdf", "type": "passport", "uploadedAt": "2026-02-07T14:00:08.045Z"}, {"name": "5G JOBS (1).pdf", "path": "/uploads/cb56dd57-504f-4e19-99c0-e457999c5665/1770472809060-417090930-5G_JOBS__1_.pdf", "type": "proof_of_address", "uploadedAt": "2026-02-07T14:00:09.060Z"}, {"name": "5G JOBS (1).pdf", "path": "/uploads/cb56dd57-504f-4e19-99c0-e457999c5665/1770472813943-599814479-5G_JOBS__1_.pdf", "type": "source_of_funds", "uploadedAt": "2026-02-07T14:00:13.943Z"}]	\N	2026-02-07 14:05:55.39	674d623b-c2d4-4648-8115-5d0b1d164865	\N	approved	2026-02-07 14:05:35.77	Emareti	Business Analyst	dubai	2029-02-03 00:00:00	239829hd23	\N	\N	\N	\N	citizen	Villa 12, Street 45, Al Nahda	\N	salary	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sme_user
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
a1025933-1b48-4623-91db-0ff13a091b7c	test-email-check@gmail.com	$2b$10$vrpNNqSYdTvzyZ9ll2H7yeSiZ9KfkFi1PoVXFLyYxpeBtlYxVD.K2	user	Test Email	\N	f	N02MTkRtUkoETfO7bXZdINB7PnSzQZHGs4SSSyiPiKwmmpjDYxaSOLePuyFHPfLJ	\N	\N	2026-01-30 17:04:29.066	2026-01-30 17:04:29.066	\N	\N	active	\N	\N	\N
0aa46452-b94e-481e-87c6-390d50c821b2	catalyst@theredstone.ai	$2b$10$ck54V15Kc0Ju.tfoRl3/VumKbKfE8hKiXXZpTaDtFYJHpyNNnKeyW	user	Sajid Usman	\N	t	\N	\N	\N	2026-02-02 14:16:36.107	2026-02-02 14:18:14.127	2026-02-02 14:18:14.126	\N	active	\N	\N	\N
d20849a8-e976-4711-8e27-bc530aed0c4a	parisapari4u53@gmail.com	$2b$10$zlgphXpKXv8wGS/lQamJPebOu4pk3ubF8EJft1EVxhpW31NNoahXa	sme	sonia soni	\N	t	\N	\N	\N	2026-02-02 13:30:46.759	2026-02-02 15:24:09.911	2026-02-02 15:24:09.91	\N	active	\N	\N	\N
da65cb66-0593-4ab3-a690-82396bdf80d4	elishagill057@gmail.com	$2b$10$rXbZ95t/SC87RHJPOL5swe6YV3sbAWkA/Xo4qA6Er.n6hXbNh43dK	user	Elisha Gill	\N	f	Nran3mYzA7NnCl69O9cqdL8ZSk2xVNO22n1H4eQELH3ppDARqFgJ7vkKhKQeNhr2	\N	\N	2026-02-02 12:19:08.173	2026-02-02 12:19:08.173	\N	\N	active	\N	\N	\N
701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	elishagill166@gmail.com	$2b$10$KQbm9EtTt6k1Pxmm4Ebvu.4c7b6J7r65o93lv2n9J4R0Jc9xql6Mu	sme	ELISHA eli	\N	t	\N	\N	\N	2026-02-02 14:19:21.145	2026-02-02 15:03:01.461	2026-02-02 15:03:01.461	\N	active	\N	\N	\N
cd0990a6-9a5f-4758-aebc-e215b7a66ff8	javeria@gmail.com	$2b$10$n0ahBpDSsBz3vbogi6Z74.FM6c3fbm17nsPk9Z1GdxjcVmFS8ogm2	sme	aqsa aqsa	\N	f	LTcn3ONmbfV4sWgRfFOZoH0HBgsd7CgANSkbDrmKnTWOgA7MqjA9hFKzRZpL05Uj	\N	\N	2026-02-08 08:02:37.158	2026-02-08 08:19:11.618	\N	\N	suspended	2026-02-08 08:19:11.617	674d623b-c2d4-4648-8115-5d0b1d164865	hello
eb13f924-6e62-47a6-a3c2-7708e677861c	email@theredstone.ai	$2b$10$knhSLwhUqTtxUbDhVcGzTOonu96HPT5uH34UzeFCcm4XhP1jMgJii	sme	Ali Hussain	\N	t	\N	\N	\N	2026-01-30 18:41:16.253	2026-02-09 15:13:15.231	2026-02-09 15:13:15.23	\N	active	\N	\N	\N
258cb6d6-85be-4e4f-9830-107bac843987	rayasatmuhammad64@gmail.com	$2b$10$wJ6AXgagSmrlFLPjeKn6n.G8LPWcsuvQhklmaklMwD0df6o.kb/Yq	user	Aqsa Aqsa	0342096643	t	\N	\N	\N	2026-01-30 17:05:23.182	2026-02-09 15:17:54.636	2026-02-09 15:17:54.635	\N	active	\N	\N	\N
e9152f33-af41-4c15-95f2-2d09b6feb174	arbazkhan164598@gmail.com	$2b$10$CWuLMVE4HPdZAAwxeF2tOuL1zimHX8NuHRIEblU7FGZCszSvIQq6a	sme	aqsa aqsa	\N	t	\N	\N	\N	2026-02-06 16:18:55.647	2026-02-06 18:02:48.425	2026-02-06 18:02:48.424	\N	active	\N	\N	\N
d88b3155-20b4-4c5d-bb70-f6d5007358b5	x.sbf.x@live.com	$2b$10$PUr9/ynelOeqgsS9kVzuhOK4UdjsZTdpJOmGDqbF6cqUOsrRPc686	sme	john Doe	\N	f	6gLbxUcGJrbH0lX4SGH9IqtjYsoLnAQzHeJkyWxSG7CjbfAnBQrWaljXZZRXfDDv	\N	\N	2026-02-05 21:10:16.071	2026-02-05 21:10:16.071	\N	\N	active	\N	\N	\N
e873e8bb-4435-4562-b595-59ba8898c092	aqsariasat235@gmail.com	$2b$10$7.vY4xYZnoIR77CSgjMJNeddLtnBNNNpMq2LLRBQHkKP2hsKoDKe2	user	Aqsa Riasat	\N	t	WYOmX0rn74AdgERMKyzoPSCBiTY4OuK0D94SIL08paOZfF5CkxJm7JAsfgyg5V87	\N	\N	2026-01-30 16:54:22.61	2026-02-08 08:36:33.838	2026-02-08 08:36:33.838	\N	active	\N	\N	\N
cb56dd57-504f-4e19-99c0-e457999c5665	soniarabbani2166@gmail.com	$2b$10$LeAkE2HAmy.zH0oHrCsG1O60fgF9hVKJBL1qFEFpKWlVOE.gRfJ1e	user	Parisa Pari	+923363007224	t	\N	\N	\N	2026-02-07 13:48:51.966	2026-02-07 14:09:34.171	2026-02-07 14:09:34.17	/uploads/cb56dd57-504f-4e19-99c0-e457999c5665/1770472242538-276469204-40c65d3567a5561903c08729d36584ac.jpg	active	\N	\N	\N
22c55feb-de85-421b-bf76-7dd85ab66746	parisaumerkhalil@gmail.com	$2b$10$9a1Gou8XEdPNMSGAde.s4OtzK7Y0G1gudaBhe/Zmqn3Zvqn6ld.UG	sme	sonia soni	\N	t	\N	\N	\N	2026-02-07 13:06:08.714	2026-02-07 14:05:05.019	2026-02-07 14:05:05.018	\N	active	\N	\N	\N
674d623b-c2d4-4648-8115-5d0b1d164865	admin@smecert.ae	$2b$10$VF.CCufGG9FSQCnIwpcTL.6TUmvAgwuT3Be54HtsIUruC0azd9Qdu	admin	System Administrator	+971501234567	t	\N	\N	\N	2026-01-30 15:24:46.706	2026-02-10 04:14:12.825	2026-02-10 04:14:12.824	\N	active	\N	\N	\N
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: chat_attachments chat_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.chat_attachments
    ADD CONSTRAINT chat_attachments_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: document_versions document_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.document_versions
    ADD CONSTRAINT document_versions_pkey PRIMARY KEY (id);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: introduction_requests introduction_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.introduction_requests
    ADD CONSTRAINT introduction_requests_pkey PRIMARY KEY (id);


--
-- Name: legal_pages legal_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.legal_pages
    ADD CONSTRAINT legal_pages_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: sme_profiles sme_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.sme_profiles
    ADD CONSTRAINT sme_profiles_pkey PRIMARY KEY (id);


--
-- Name: support_messages support_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT support_messages_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_actionType_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "audit_logs_actionType_idx" ON public.audit_logs USING btree ("actionType");


--
-- Name: audit_logs_timestamp_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX audit_logs_timestamp_idx ON public.audit_logs USING btree ("timestamp");


--
-- Name: audit_logs_userId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "audit_logs_userId_idx" ON public.audit_logs USING btree ("userId");


--
-- Name: certificates_certificateId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "certificates_certificateId_idx" ON public.certificates USING btree ("certificateId");


--
-- Name: certificates_certificateId_key; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE UNIQUE INDEX "certificates_certificateId_key" ON public.certificates USING btree ("certificateId");


--
-- Name: certificates_smeProfileId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "certificates_smeProfileId_idx" ON public.certificates USING btree ("smeProfileId");


--
-- Name: certificates_status_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX certificates_status_idx ON public.certificates USING btree (status);


--
-- Name: chat_messages_introductionRequestId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "chat_messages_introductionRequestId_idx" ON public.chat_messages USING btree ("introductionRequestId");


--
-- Name: chat_messages_senderId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "chat_messages_senderId_idx" ON public.chat_messages USING btree ("senderId");


--
-- Name: document_versions_documentType_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "document_versions_documentType_idx" ON public.document_versions USING btree ("documentType");


--
-- Name: document_versions_isLatest_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "document_versions_isLatest_idx" ON public.document_versions USING btree ("isLatest");


--
-- Name: document_versions_smeProfileId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "document_versions_smeProfileId_idx" ON public.document_versions USING btree ("smeProfileId");


--
-- Name: email_logs_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "email_logs_entityType_entityId_idx" ON public.email_logs USING btree ("entityType", "entityId");


--
-- Name: email_logs_eventType_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "email_logs_eventType_idx" ON public.email_logs USING btree ("eventType");


--
-- Name: email_logs_recipientEmail_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "email_logs_recipientEmail_idx" ON public.email_logs USING btree ("recipientEmail");


--
-- Name: email_logs_sentAt_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "email_logs_sentAt_idx" ON public.email_logs USING btree ("sentAt");


--
-- Name: email_logs_status_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX email_logs_status_idx ON public.email_logs USING btree (status);


--
-- Name: legal_pages_slug_key; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE UNIQUE INDEX legal_pages_slug_key ON public.legal_pages USING btree (slug);


--
-- Name: payments_paymentId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "payments_paymentId_idx" ON public.payments USING btree ("paymentId");


--
-- Name: payments_paymentId_key; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE UNIQUE INDEX "payments_paymentId_key" ON public.payments USING btree ("paymentId");


--
-- Name: payments_smeProfileId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "payments_smeProfileId_idx" ON public.payments USING btree ("smeProfileId");


--
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- Name: sme_profiles_tradeLicenseNumber_key; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE UNIQUE INDEX "sme_profiles_tradeLicenseNumber_key" ON public.sme_profiles USING btree ("tradeLicenseNumber");


--
-- Name: sme_profiles_userId_key; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE UNIQUE INDEX "sme_profiles_userId_key" ON public.sme_profiles USING btree ("userId");


--
-- Name: support_messages_senderId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "support_messages_senderId_idx" ON public.support_messages USING btree ("senderId");


--
-- Name: support_messages_ticketId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "support_messages_ticketId_idx" ON public.support_messages USING btree ("ticketId");


--
-- Name: support_tickets_status_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX support_tickets_status_idx ON public.support_tickets USING btree (status);


--
-- Name: support_tickets_userId_idx; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE INDEX "support_tickets_userId_idx" ON public.support_tickets USING btree ("userId");


--
-- Name: user_profiles_userId_key; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE UNIQUE INDEX "user_profiles_userId_key" ON public.user_profiles USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: sme_user
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: audit_logs audit_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: certificates certificates_issuedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "certificates_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: certificates certificates_smeProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "certificates_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES public.sme_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_attachments chat_attachments_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.chat_attachments
    ADD CONSTRAINT "chat_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public.chat_messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_introductionRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "chat_messages_introductionRequestId_fkey" FOREIGN KEY ("introductionRequestId") REFERENCES public.introduction_requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "chat_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: document_versions document_versions_reviewedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.document_versions
    ADD CONSTRAINT "document_versions_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: document_versions document_versions_smeProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.document_versions
    ADD CONSTRAINT "document_versions_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES public.sme_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: introduction_requests introduction_requests_requesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.introduction_requests
    ADD CONSTRAINT "introduction_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: introduction_requests introduction_requests_smeProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.introduction_requests
    ADD CONSTRAINT "introduction_requests_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES public.sme_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_requestedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payments payments_smeProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES public.sme_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sme_profiles sme_profiles_reviewedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.sme_profiles
    ADD CONSTRAINT "sme_profiles_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sme_profiles sme_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.sme_profiles
    ADD CONSTRAINT "sme_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: support_messages support_messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT "support_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: support_messages support_messages_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public.support_tickets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: support_tickets support_tickets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT "support_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sme_user
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO sme_user;


--
-- PostgreSQL database dump complete
--

\unrestrict gh2U9R1njirHkkGjZziNoZaMPwTH3EMWr2ef4jIoOIf9uf8nM5rc9vm1NY0eAP2

