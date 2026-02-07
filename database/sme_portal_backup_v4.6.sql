--
-- PostgreSQL database dump
--

\restrict KzoMql7dAgVVDiJC0n0XdhqFsFLfrnDEXecwSBnTKjb1iurrX4OMUb1ErwFmbHZ

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
    "profilePicture" text
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
c62b17f8-1ef4-4feb-9c4e-8787e2ed12f4	b628b909-9328-4062-8648-bc243eb086aa	USER_REGISTERED	New sme account registered	\N	\N	10.10.10.1	2026-02-02 11:51:12.021	\N	\N
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
4539681a-32f9-4a1e-b69b-04e5d110af9b	b94da295-129a-49d5-9589-380bd25c59ef	USER_REGISTERED	New user account registered	\N	\N	10.10.10.1	2026-02-02 13:05:47.292	\N	\N
5ac2d62c-2c6b-4ec7-ba2d-4423c30e3842	b94da295-129a-49d5-9589-380bd25c59ef	EMAIL_VERIFIED	Email address verified successfully	\N	\N	10.10.10.1	2026-02-02 13:06:52.652	\N	\N
1cb9add3-a907-45d6-990c-a8bd0f76ff4e	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:15:38.091	\N	\N
708e3ee5-8aa3-47f9-af91-ebf344ad98d0	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 13:15:42.426	\N	\N
d9bf6969-7dbd-46bb-85b2-385a378eaf9a	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:15:45.958	\N	\N
03743201-1f2d-4329-bee3-ae645ec26927	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 13:17:06.211	\N	\N
e4dce3bc-e27e-4df8-b32a-eb514472eae5	b628b909-9328-4062-8648-bc243eb086aa	PASSWORD_RESET_REQUESTED	Password reset requested	\N	\N	10.10.10.1	2026-02-02 13:20:33.443	\N	\N
b41e3c3a-b383-408e-9e58-0101c6127900	b628b909-9328-4062-8648-bc243eb086aa	PASSWORD_RESET_COMPLETED	Password reset completed successfully	\N	\N	10.10.10.1	2026-02-02 13:21:13.382	\N	\N
fdee8b98-9a47-49f2-ba56-8056e4a1d642	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:26:29.142	\N	\N
525e0733-b54d-40bd-8577-5ddf5072b172	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 13:27:02.427	\N	\N
6c4fcd56-6392-4c4f-b840-1a60fd01c23d	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_REGISTERED	New sme account registered	\N	\N	10.10.10.1	2026-02-02 13:30:47.954	\N	\N
8453be1e-1b41-4829-951b-abb38620d206	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:31:14.585	\N	\N
e717b082-a0f4-478a-84ab-7b1840fb4f4c	d20849a8-e976-4711-8e27-bc530aed0c4a	EMAIL_VERIFIED	Email address verified successfully	\N	\N	10.10.10.1	2026-02-02 13:36:36.019	\N	\N
96b12891-2ab3-4702-b739-581793beea97	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:36:49.572	\N	\N
08e8509b-7224-4d23-bb69-a5cc1291ff32	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 13:43:48.896	\N	\N
33050c8d-340a-4e50-a7e1-85f94bea5eca	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 13:44:36.497	\N	\N
ff740908-8790-4e8a-beab-35bb341a8fa9	b628b909-9328-4062-8648-bc243eb086aa	EMAIL_VERIFIED	Email address verified successfully	\N	\N	10.10.10.1	2026-02-02 14:01:21.639	\N	\N
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
903f7c15-b1d6-4e9b-aea2-ab6f5b6ef8b3	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 14:55:03.55	\N	\N
ea6bb00d-2981-40ed-8c4c-ab83d156f988	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 14:55:12.406	\N	\N
a562619b-40e3-448e-bd97-be756f5dfbc0	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 14:55:26.847	\N	\N
66a438f0-dfb0-4ad0-a8ef-b223a4f9d969	b94da295-129a-49d5-9589-380bd25c59ef	INTRODUCTION_REQUESTED	Requested introduction to UAE GEM	IntroductionRequest	47d863b7-7387-42be-b191-f812f947e6c9	10.10.10.1	2026-02-02 14:56:03.998	\N	\N
9d0bd22c-3e7d-4246-b017-05a38d3a432a	b94da295-129a-49d5-9589-380bd25c59ef	KYC_SUBMITTED	Submitted individual investor KYC	UserProfile	b94da295-129a-49d5-9589-380bd25c59ef	10.10.10.1	2026-02-02 15:01:06.599	\N	\N
1374a3fd-e0fd-41b1-b135-9c14eefe8a6d	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:02:56.989	\N	\N
cd723166-c29c-4d53-8941-a40458ec48c4	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:03:01.47	\N	\N
b77f86d4-4411-410f-9432-9c1faa26ff25	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:08:52.163	\N	\N
525e861f-d518-4187-ade7-c2a4c3153906	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:08:59.42	\N	\N
683243d5-7161-4381-97cd-54520ddb2760	674d623b-c2d4-4648-8115-5d0b1d164865	KYC_APPROVE	Approved KYC for investor Soniya Rabbani	UserProfile	049cabf6-2690-4864-a7f0-103b6ebba063	10.10.10.1	2026-02-02 15:09:54.721	\N	{"status":"approved","notes":null}
f92e04ea-c7a1-473c-8b21-5e078cfe766b	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:10:25.963	\N	\N
04c3dd1f-18da-4500-8d8f-c611bca43752	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:10:32.885	\N	\N
d6e0bf2b-fbcc-4818-9a3a-b10865c1b6f4	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:10:57.07	\N	\N
3c9efa34-df0f-44f0-a23e-a249cbd55573	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:11:06.799	\N	\N
c5fb982f-a8b8-49ce-a5a5-11c0f51bad32	b94da295-129a-49d5-9589-380bd25c59ef	PROFILE_PICTURE_UPDATED	Updated profile picture	User	b94da295-129a-49d5-9589-380bd25c59ef	10.10.10.1	2026-02-02 15:19:26.688	\N	\N
e86f3e56-7fb1-4d55-bf23-77987ade78ce	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:21:02.798	\N	\N
eff00046-c6c7-4e23-88c4-d8e9222f583c	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:21:08.798	\N	\N
6ecff536-08ab-485c-9ac8-7a975fab48ef	0aa46452-b94e-481e-87c6-390d50c821b2	INTRODUCTION_REQUESTED	Requested introduction to UAE GEM	IntroductionRequest	2f0de7c1-cae6-4f30-ac2b-8a31e2405fb8	10.10.10.1	2026-02-02 15:22:30.527	\N	\N
84d66e7d-5379-42f9-9ed0-be5afa3d3a7c	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:22:54.084	\N	\N
5d45749a-84fc-4b53-97bb-10327fc5eacd	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:22:59.879	\N	\N
893345e0-3556-4408-9413-f173673de07b	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:23:59.275	\N	\N
d82119cc-4e0f-4bce-a8a4-a6c124827c60	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:24:09.917	\N	\N
9b872dd1-7704-45b7-86cb-395c44bfa3a7	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:25:44.901	\N	\N
186a9368-a374-4d9e-8bd7-d5f85a31139b	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:26:05.52	\N	\N
546846b4-bb9c-4721-9af2-593d40659e3a	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:26:12.416	\N	\N
bfc8e298-ea7d-4f25-ade1-4be83269c007	0aa46452-b94e-481e-87c6-390d50c821b2	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 15:28:19.766	\N	\N
c6b1f07e-f7a0-441e-b26f-fe52c3d54ee8	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-02 15:28:38.42	\N	\N
ee6dbab1-f37c-4683-9c7d-b23b80412714	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-02 17:27:20.834	\N	\N
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
\.


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.certificates (id, "certificateId", "certificateVersion", "smeProfileId", "companyName", "tradeLicenseNumber", "industrySector", "issuedAt", "expiresAt", status, "revokedAt", "revocationReason", "verificationUrl", "verificationHash", "issuedById", "lastReissuedAt", "createdAt", "updatedAt") FROM stdin;
668b4c78-db89-4893-a176-0091759a7594	SME-CERT-5A78C7ED	v1.0	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	TechStart UAE	TL-2024-001234	technology	2024-01-20 00:00:00	2025-01-20 00:00:00	active	\N	\N	https://sme.byredstone.com/registry/verify/SME-CERT-5A78C7ED	82ebd5134e0753b2e820c1cec2c785ea3b6517f15cb8e864e0ba8ed1e6873183	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:32:04.607	2026-02-05 19:32:04.607
c3c90930-7251-4004-b61c-65541c27cb60	SME-CERT-05E4A59F	v1.0	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	HealthPlus Medical Center	TL-2024-005678	healthcare	2024-02-05 00:00:00	2025-02-05 00:00:00	active	\N	\N	https://sme.byredstone.com/registry/verify/SME-CERT-05E4A59F	b3bb4c2b7eb7853a995f715a63891877edfab96c1b968c27cf24496072a17163	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:32:04.612	2026-02-05 19:32:04.612
fd3cb1df-0aaa-4a95-b3e6-94a2a9196e27	SME-CERT-2C41732F	v1.0	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	tjara	9876	finance	2026-01-31 17:57:01.451	2027-01-31 17:57:01.451	active	\N	\N	https://sme.byredstone.com/registry/verify/SME-CERT-2C41732F	799d6ec3957130d8ac7adcd038e9a4c9912f4e08bbf00c7be256a894d709f74b	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:32:04.618	2026-02-05 19:32:04.618
481bd625-cefc-46ed-9d99-9df4357bb537	SME-CERT-E099E930	v1.0	bff4a163-a102-4334-ad12-37b1a6e468c1	UAE GEM	65432	manufacturing	2026-02-02 14:49:15.627	2027-02-02 14:49:15.627	active	\N	\N	https://sme.byredstone.com/registry/verify/SME-CERT-E099E930	977c1a766c451c154bd2fa2c2ea2505d1e1e965511e34fbc4a0460dc4e8b8da1	674d623b-c2d4-4648-8115-5d0b1d164865	\N	2026-02-05 19:32:04.624	2026-02-05 19:32:04.624
\.


--
-- Data for Name: chat_attachments; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.chat_attachments (id, "messageId", "fileName", "originalName", "filePath", "fileSize", "mimeType", "createdAt") FROM stdin;
37b0ae65-1eb4-4450-b023-b2de4036cb8c	f76120fb-79d0-4af9-9d89-bd8883b7cd87	1769805322212-575804526.pdf	5G JOBS.pdf	/uploads/chat/133e1536-b3d6-486d-a049-70a1f15847e4/1769805322212-575804526.pdf	101099	application/pdf	2026-01-30 20:35:22.218
4668aecf-18aa-46f1-aee4-3a134e12fe9c	37114906-bca6-4f07-957d-1845298992c3	1769971701345-271067704.png	Screenshot 2026-02-02 at 12.37.02â¯AM.png	/uploads/chat/133e1536-b3d6-486d-a049-70a1f15847e4/1769971701345-271067704.png	626756	image/png	2026-02-01 18:48:21.353
4981bf51-a770-441f-81b7-e8e721476a86	2bded04c-a479-42f5-8093-af75f4a915f2	1770044718343-993546801.jpg	5be9e932fc2a23ddd7810c35a9131de8.jpg	/uploads/chat/47d863b7-7387-42be-b191-f812f947e6c9/1770044718343-993546801.jpg	13219	image/jpeg	2026-02-02 15:05:18.345
330687db-2a28-4258-b99c-e5b27c9720eb	9650d9e5-eb1c-41df-ad66-de991e1498af	1770044730415-326793977.jpg	5be9e932fc2a23ddd7810c35a9131de8.jpg	/uploads/chat/47d863b7-7387-42be-b191-f812f947e6c9/1770044730415-326793977.jpg	13219	image/jpeg	2026-02-02 15:05:30.417
6055723c-87b7-4578-bd23-01d2ebc85a82	55a91215-b36f-4be6-86c8-3ef75c51d0e5	1770045996914-380139734.JPG	12.JPG	/uploads/chat/47d863b7-7387-42be-b191-f812f947e6c9/1770045996914-380139734.JPG	34405	image/jpeg	2026-02-02 15:26:36.916
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
4b10ab3e-6225-4bfc-b29a-5261e597b53c	47d863b7-7387-42be-b191-f812f947e6c9	b94da295-129a-49d5-9589-380bd25c59ef	.	2026-02-02 15:02:37.83	t	[]	\N	f	f
8d2c4119-fc9e-4a82-84c9-5e1c4a1b0717	47d863b7-7387-42be-b191-f812f947e6c9	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	Hello Soniya,  Thank you for reaching out. We appreciate your interest in connecting with UAE GEM. We would be happy to explore potential collaboration opportunities with you.  Best regards, UAE GEM Team	2026-02-02 15:04:35.814	t	[]	\N	f	f
9650d9e5-eb1c-41df-ad66-de991e1498af	47d863b7-7387-42be-b191-f812f947e6c9	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004		2026-02-02 15:05:30.417	t	[]	\N	t	f
2bded04c-a479-42f5-8093-af75f4a915f2	47d863b7-7387-42be-b191-f812f947e6c9	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004		2026-02-02 15:05:18.345	t	[]	\N	t	f
55a91215-b36f-4be6-86c8-3ef75c51d0e5	47d863b7-7387-42be-b191-f812f947e6c9	b94da295-129a-49d5-9589-380bd25c59ef		2026-02-02 15:26:36.916	f	[]	\N	f	f
6deb1c07-fe10-494c-b1ec-014a4870a901	26c33880-2196-4839-b1db-3db18e13ff07	258cb6d6-85be-4e4f-9830-107bac843987	hi	2026-02-02 15:29:08.59	f	[]	\N	f	f
0ad4635d-685a-4663-b6ef-d550e25f619d	26c33880-2196-4839-b1db-3db18e13ff07	258cb6d6-85be-4e4f-9830-107bac843987		2026-02-02 15:29:17.893	f	[]	\N	f	f
\.


--
-- Data for Name: document_versions; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.document_versions (id, "smeProfileId", "documentType", "originalName", "fileName", "filePath", "fileSize", "mimeType", version, status, "adminFeedback", "reviewedById", "reviewedAt", "uploadedAt", "replacedAt", "isLatest") FROM stdin;
66fec6da-2de0-45df-9656-c8e684149ace	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	company_profile	Catalyst_Logo (1).png	1769803012286-509302961-Catalyst_Logo__1_.png	/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769803012286-509302961-Catalyst_Logo__1_.png	\N	\N	1	approved	\N	674d623b-c2d4-4648-8115-5d0b1d164865	2026-02-07 00:02:57.91	2026-02-07 00:02:57.91	\N	t
\.


--
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.email_logs (id, "recipientEmail", "recipientName", "entityType", "entityId", "eventType", subject, "templateId", status, "errorMessage", metadata, "sentAt") FROM stdin;
\.


--
-- Data for Name: introduction_requests; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.introduction_requests (id, "requesterId", "smeProfileId", message, "contactPreferences", status, "requestedDate", "updatedAt", "respondedAt", "smeResponse") FROM stdin;
233e182d-f01a-48e9-ad0d-66cbb5ba08b5	17f046a0-8c7f-45e7-84b2-5941c5189375	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	We are interested in exploring potential technology partnerships for our digital transformation initiatives. Would love to schedule a meeting to discuss collaboration opportunities.	Email preferred, available Mon-Thu	pending	2026-01-30 15:24:46.994	2026-01-30 15:24:46.994	\N	\N
b9ef8a4b-51a4-4284-b6c6-7a4cbc0bfe27	3bd38396-3d04-4b86-812c-4958e6cff136	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	Our investment fund is evaluating healthcare sector opportunities. Would appreciate an introduction to discuss your growth plans.	Phone call or video meeting	viewed	2026-01-30 15:24:47.002	2026-01-30 15:24:47.002	\N	\N
133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	i want to know about your company	\N	responded	2026-01-30 20:07:32.104	2026-01-30 20:26:35.874	2026-01-30 20:26:35.873	hlo
26c33880-2196-4839-b1db-3db18e13ff07	258cb6d6-85be-4e4f-9830-107bac843987	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	hello	\N	pending	2026-02-02 12:41:35.496	2026-02-02 12:41:35.496	\N	\N
47d863b7-7387-42be-b191-f812f947e6c9	b94da295-129a-49d5-9589-380bd25c59ef	bff4a163-a102-4334-ad12-37b1a6e468c1	Hello,\nI would like to connect with UAE GEM to explore potential collaboration opportunities and to better understand your manufacturing services. Looking forward to connecting.\nThank you.	\N	responded	2026-02-02 14:56:03.994	2026-02-02 15:04:35.82	2026-02-02 15:04:35.82	\N
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
cert-standards-001	certification-standards	Certification Standards	## 1. Purpose of Certification\n\nNaywa certification provides an independent, documentation-based assessment of an SME's readiness and credibility at a specific point in time.\n\nCertification is intended to support transparency and informed decision-making. It does not constitute a regulatory approval, guarantee, endorsement, or legal opinion.\n\n## 2. Scope of Certification\n\nCertification is based solely on information and documentation submitted by the applicant and reviewed in accordance with Naywa's internal assessment framework.\n\nThe scope of certification includes, but is not limited to:\n- Legal existence and registration\n- Ownership and authorized control\n- Financial documentation and disclosures\n- Operational and business information\n- Sector-specific considerations where applicable\n\nCertification does not replace, override, or substitute any statutory, regulatory, or licensing requirements imposed by relevant authorities.\n\n## 3. Certification Process\n\nThe certification process follows a structured review of submitted documentation.\n\nApplicants are guided through required submissions during the application process. Review outcomes are determined based on completeness, consistency, and professional judgement applied at the time of review.\n\nInternal assessment criteria, weighting, and review logic are proprietary and are not disclosed.\n\n## 4. Certification Outcomes\n\nUpon completion of review, an application may be:\n- Approved\n- Returned for clarification or additional information\n- Deferred\n- Declined\n\nApplicants are notified only of high-level outcomes or requests for additional information. Detailed internal deliberations are not disclosed.\n\n## 5. Validity, Suspension, and Revocation\n\nCertification is valid for a defined period from the date of issue, unless otherwise stated.\n\nCertification may be suspended or revoked if:\n- Material information is found to be inaccurate or incomplete\n- Circumstances materially change\n- Required updates or clarifications are not provided\n\nNaywa reserves the right to update certification status to preserve registry accuracy and integrity.\n\n## 6. Registry Inclusion & Verification\n\nCertified entities may be listed in Naywa's registry for verification purposes.\n\nEach certification includes a unique identifier and verification mechanism. Third parties are encouraged to verify certification status directly through Naywa's official registry.\n\nIn the event of any discrepancy, the registry record shall prevail over any downloaded or printed certificate.\n\n## 7. Limitations\n\nCertification reflects an assessment conducted at a specific point in time based on information provided by the applicant.\n\nNaywa does not:\n- Guarantee future performance or outcomes\n- Provide investment, financial, or legal advice\n- Assume responsibility for third-party decisions or reliance\n\nAll users are responsible for conducting their own independent assessments where required.\n\n## 8. Confidentiality & Data Handling\n\nInformation submitted for certification is handled in accordance with Naywa's Privacy Policy and applicable data protection standards.\n\nAccess to submitted information is limited to certification purposes and authorized review processes.\n\n## 9. Amendments\n\nNaywa may update these Certification Standards from time to time to reflect operational, legal, or governance considerations. Updates take effect upon publication.\n\nContinued use of the platform constitutes acceptance of the updated Certification Standards.	t	2026-02-06 21:04:33.688	\N	2026-02-06 21:04:33.688	2026-02-06 21:04:33.688
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.payments (id, "paymentId", "smeProfileId", amount, currency, description, status, "stripePaymentIntentId", "stripeClientSecret", "stripeChargeId", "requestedById", "requestedAt", "paidAt", "failedAt", "failureReason", "invoiceNumber", "receiptUrl", "createdAt", "updatedAt") FROM stdin;
e8cf399e-10c0-415c-a3e3-dbe4c35aa775	PAY-71C00457	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	500.00	AED	SME Certification Fee	pending	\N	\N	\N	674d623b-c2d4-4648-8115-5d0b1d164865	2026-02-06 21:48:52.291	\N	\N	\N	NAYWA-INV-608BBEE7	\N	2026-02-06 21:48:52.292	2026-02-06 21:48:52.292
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
d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	b628b909-9328-4062-8648-bc243eb086aa	Redstone	TL-123456789	\N	technology	\N	\N	\N	\N	\N	\N	draft	\N	\N	\N	f	2026-02-02 11:51:11.811	2026-02-02 11:51:11.811	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e86fa395-04ca-4c30-aef9-d60073ebd829	d20849a8-e976-4711-8e27-bc530aed0c4a	REDSTONE CATALYST	727161	\N	healthcare	\N	\N	\N	\N	\N	\N	draft	\N	\N	\N	f	2026-02-02 13:30:46.764	2026-02-02 13:30:46.764	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c24e36a9-ef8d-48f6-a03e-6649d21dad2b	d88b3155-20b4-4c5d-bb70-f6d5007358b5	CRS LLC	45312	\N	healthcare	\N	\N	\N	\N	\N	\N	draft	\N	\N	\N	f	2026-02-05 21:10:16.079	2026-02-05 21:10:16.079	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
bff4a163-a102-4334-ad12-37b1a6e468c1	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	UAE GEM	65432	UAE GEM is a manufacturing-based company specializing in the production, processing, and distribution of high-quality industrial and commercial products. The company focuses on efficient manufacturing practices, quality control, and timely delivery to meet client and market demands across the UAE and regional markets.	manufacturing	2018-03-15 00:00:00	25	\N	https://example.com	Warehouse No. 12, Industrial Area 3,\nAl Qusais, Dubai,\nUnited Arab Emirates	{"companyLogo": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770042484831-850257127-bird_2.jpg", "contactName": "Sara Mahmood", "contactEmail": "contact@company.ae", "contactPhone": "+971 50 123 4567", "revenueRange": "50m-100m", "revenueGrowth": "10-25", "uploadedFiles": [{"id": "doc_1770043728158_ieg3lksig", "name": "1770043728155-200027744-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043728155-200027744-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:48:48.158Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770043733837_e3x2qyqvz", "name": "1770043733835-417939527-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043733835-417939527-5G_JOBS.pdf", "size": 101099, "type": "certificate_of_incorporation", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:48:53.837Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770043737648_tp3d1f5s5", "name": "1770043737646-144276519-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043737646-144276519-5G_JOBS.pdf", "size": 101099, "type": "financial_statements", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:48:57.648Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770043742667_f3ufqhezq", "name": "1770043742665-313672501-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043742665-313672501-5G_JOBS.pdf", "size": 101099, "type": "company_profile", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:49:02.667Z", "originalName": "5G JOBS.pdf"}], "contactPosition": "Managing Director"}	certified	2026-02-02 14:49:15.627	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-02-02 14:19:21.15	2026-02-04 23:12:34.531	ABC Auditing & Consulting LLC		Emirates NBD	[]	b2b	compliance@company.ae	Fatima Noor	[]	bootstrapped	f	f	Office 405, Building A, Dubai Silicon Oasis, Dubai, United Arab Emirates	\N	\N	2026-06-30 00:00:00	llc	2026-12-31 00:00:00	https://linkedin.com/company/uae-gem	[]	own_premises	[]	784-1990-1234567-1	ELISHA ELI	Emirati	\N	Dubai	United Arab Emirates	CR-987654	[]	secondary@company.ae	Omar Khan	+971 55 987 6543	[]	{}	VAT-TRN-123456789000001	\N	\N	\N	\N
159197cd-de45-4585-93e1-1b4b284f9ed3	e9152f33-af41-4c15-95f2-2d09b6feb174	redstone	7548695	\N	technology	\N	\N	\N	\N	\N	{"uploadedFiles": []}	draft	\N	\N	\N	f	2026-02-06 16:18:55.652	2026-02-06 16:58:07.886	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e08d8b84-de5a-46b0-a2ca-a53a6c58b252	eb13f924-6e62-47a6-a3c2-7708e677861c	tjara	9876	tjara	finance	2026-01-16 00:00:00	175	\N	tjara.com	USA	{"companyLogo": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769877885750-862383348-Catalyst_Logo__1_.png", "contactName": "ali", "contactEmail": "aqsariasat235@gmail.com", "contactPhone": "+92545028212", "fundingStage": "seed", "revenueRange": ">100m", "revenueGrowth": "10-25", "uploadedFiles": [{"id": "doc_1769802932396_fwx40o9h8", "name": "1769802932382-997599077-5G_JOBS.pdf", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802932382-997599077-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-01-30T19:55:32.396Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1769802955799_yi71k4lh8", "name": "1769802955795-547704221-4784e97d99d60fbbc4723864e3f57281.jpg", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802955795-547704221-4784e97d99d60fbbc4723864e3f57281.jpg", "size": 17232, "type": "certificate_of_incorporation", "mimeType": "image/jpeg", "uploadedAt": "2026-01-30T19:55:55.799Z", "originalName": "4784e97d99d60fbbc4723864e3f57281.jpg"}, {"id": "doc_1769802999963_3wp3z6c0w", "name": "1769802999959-490222575-Catalyst_Logo_red__1_.png", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802999959-490222575-Catalyst_Logo_red__1_.png", "size": 38309, "type": "financial_statements", "mimeType": "image/png", "uploadedAt": "2026-01-30T19:56:39.963Z", "originalName": "Catalyst_Logo_red (1).png"}, {"id": "doc_1769803012292_dzn6dwtlb", "name": "1769803012286-509302961-Catalyst_Logo__1_.png", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769803012286-509302961-Catalyst_Logo__1_.png", "size": 11185, "type": "company_profile", "mimeType": "image/png", "uploadedAt": "2026-01-30T19:56:52.292Z", "originalName": "Catalyst_Logo (1).png"}], "contactPosition": "ceo"}	certified	2026-01-31 17:57:01.451	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-01-30 18:41:16.261	2026-02-07 00:03:10.865	YES		NBD	[]	b2b	aqsa	aqsa	[]	series_a	t	t	Dubai	\N	\N	2026-02-13 00:00:00	llc	2026-02-28 00:00:00	www	[]	own_premises	[]	533990	Ali	UAE	\N	Dubai	UAE	12345	[]	email@theredstone.ai	Ali	+92518434024	[]	{}	123	{"business_model": "not_reviewed", "legal_ownership": "under_review", "risk_continuity": "not_reviewed", "governance_controls": "not_reviewed", "financial_discipline": "not_reviewed"}	\N	2026-02-06 17:45:45.378	2026-02-07 00:03:10.864
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
db28544c-29db-45b7-820d-bd978f10fde4	832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	[ATTACHMENT]{"type":"attachment","fileName":"1770048857856-998708406.png","originalName":"Screenshot 2026-02-01 at 9.43.08aÌ_Â¯PM (1).png","mimeType":"image/png","size":316935,"path":"/api/support/tickets/832bd7c1-3926-4750-80c8-d964da4ae3d6/download/1770048857856-998708406.png"}	f	2026-02-02 16:14:17.862
113094e9-532a-4919-a006-5e30954d7d0f	832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	[ATTACHMENT]{"type":"attachment","fileName":"1770220533729-316146566.png","originalName":"screencapture-localhost-3000-2026-02-03-19_53_16.png","mimeType":"image/png","size":708342,"path":"/api/support/tickets/832bd7c1-3926-4750-80c8-d964da4ae3d6/download/1770220533729-316146566.png"}	f	2026-02-04 15:55:33.736
2df438cd-91a8-4f6b-a4bc-927b087c9441	cea61170-97a5-4d84-991c-4051669e5d59	674d623b-c2d4-4648-8115-5d0b1d164865	hi	t	2026-02-02 12:47:49.053
4d701b91-d70f-42f7-8c33-47acb00e1d59	cea61170-97a5-4d84-991c-4051669e5d59	674d623b-c2d4-4648-8115-5d0b1d164865	how can i help u?	t	2026-02-02 12:48:02.381
6dab54dc-e0e0-4bba-b6d3-7e8cbcd691c1	9acc5f83-0126-4770-86ac-c2c2df02cf37	eb13f924-6e62-47a6-a3c2-7708e677861c	[ATTACHMENT]{"type":"attachment","fileName":"1770281020935-303165317.png","originalName":"Screenshot 2026-02-04 at 4.03.48â¯PM.png","mimeType":"image/png","size":241189,"path":"/api/support/tickets/9acc5f83-0126-4770-86ac-c2c2df02cf37/download/1770281020935-303165317.png"}	f	2026-02-05 08:43:40.943
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
049cabf6-2690-4864-a7f0-103b6ebba063	b94da295-129a-49d5-9589-380bd25c59ef	\N	\N	2026-02-02 15:00:45.308	2026-02-02 15:09:54.711	100k_250k	\N	\N	\N	\N	\N	\N	Dubai	\N	\N	\N	\N	\N	\N	\N	\N	United Arab Emirates	1993-08-12 00:00:00	784-1992-4567890-1	2028-09-30 00:00:00	\N	employed	male	\N	\N	individual	[{"name": "5G JOBS.pdf", "path": "/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770044445305-65736314-5G_JOBS.pdf", "type": "emirates_id_front", "uploadedAt": "2026-02-02T15:00:45.305Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770044454585-582670561-5G_JOBS.pdf", "type": "emirates_id_back", "uploadedAt": "2026-02-02T15:00:54.586Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770044458382-231151908-5G_JOBS.pdf", "type": "passport", "uploadedAt": "2026-02-02T15:00:58.382Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770044462865-400648210-5G_JOBS.pdf", "type": "proof_of_address", "uploadedAt": "2026-02-02T15:01:02.866Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770044465758-237162635-5G_JOBS.pdf", "type": "source_of_funds", "uploadedAt": "2026-02-02T15:01:05.759Z"}]	\N	2026-02-02 15:09:54.71	674d623b-c2d4-4648-8115-5d0b1d164865	\N	approved	2026-02-02 15:01:06.593	UAE	Business Analyst	United Arab Emirates	2030-07-15 00:00:00	A12345678	\N	\N	\N	\N	resident	Apartment 1204, Al Nahda Tower	\N	salary	\N	\N
32b17582-71e2-4c85-bf62-2d50f89655db	258cb6d6-85be-4e4f-9830-107bac843987	redtsone	\N	2026-01-31 08:33:53.821	2026-02-04 15:54:07.016	100k_250k	\N	\N	\N	\N	\N	\N	pakistan	\N	\N	\N	\N	\N	\N	\N	\N	pakistan	2026-02-03 00:00:00	Y45788	2046-03-20 00:00:00	\N	employed	female	\N	\N	individual	[{"name": "Screenshot 2026-02-02 at 3.49.59â¯PM.png", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021800137-42029610-Screenshot_2026_02_02_at_3_49_59___PM.png", "type": "emirates_id_front", "uploadedAt": "2026-02-02T08:43:20.141Z"}, {"name": "Screenshot 2026-02-02 at 3.49.59â¯PM.png", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021840868-302677117-Screenshot_2026_02_02_at_3_49_59___PM.png", "type": "emirates_id_back", "uploadedAt": "2026-02-02T08:44:00.870Z"}, {"name": "Screenshot 2026-02-02 at 3.49.59â¯PM.png", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021849377-26333005-Screenshot_2026_02_02_at_3_49_59___PM.png", "type": "passport", "uploadedAt": "2026-02-02T08:44:09.379Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021877502-772281117-5G_JOBS.pdf", "type": "proof_of_address", "uploadedAt": "2026-02-02T08:44:37.503Z"}]	\N	2026-02-02 10:11:40.614	674d623b-c2d4-4648-8115-5d0b1d164865	\N	approved	2026-02-02 08:44:39.765	UAE	pakistan	pakistan	2036-02-20 00:00:00	76347578	\N	\N	\N	\N	resident	pakistan	\N	business	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sme_user
--

COPY public.users (id, email, password, role, "fullName", "phoneNumber", "isVerified", "verificationToken", "resetPasswordToken", "resetPasswordExpires", "createdAt", "updatedAt", "lastLogin", "profilePicture") FROM stdin;
17f046a0-8c7f-45e7-84b2-5941c5189375	user@example.com	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	user	Ahmed Al Mansouri	+971502345678	t	\N	\N	\N	2026-01-30 15:24:46.721	2026-01-30 15:24:46.721	\N	\N
3bd38396-3d04-4b86-812c-4958e6cff136	user2@example.com	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	user	Sarah Khan	+971503456789	t	\N	\N	\N	2026-01-30 15:24:46.738	2026-01-30 15:24:46.738	\N	\N
9a29bfa2-6177-45a8-a308-61c1f34fb13b	sme@techstartup.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	sme	Mohammad Al Hashimi	+971504567890	t	\N	\N	\N	2026-01-30 15:24:46.85	2026-01-30 15:24:46.85	\N	\N
c4bf6f2a-e8d1-43c5-96fc-088387e93232	sme@healthplus.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	sme	Dr. Fatima Al Zaabi	+971505678901	t	\N	\N	\N	2026-01-30 15:24:46.87	2026-01-30 15:24:46.87	\N	\N
0c7a2ae9-b24b-4741-962b-10155a4131d6	sme@retailhub.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	sme	Khalid Al Nasser	+971506789012	t	\N	\N	\N	2026-01-30 15:24:46.886	2026-01-30 15:24:46.886	\N	\N
f7677afa-4185-4c3f-ae44-aadd4ce6d886	sme@newbusiness.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	sme	Layla Hassan	+971507890123	t	\N	\N	\N	2026-01-30 15:24:46.902	2026-01-30 15:24:46.902	\N	\N
0918869a-495b-490d-95f2-604131cd34c9	sme@constructco.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	sme	Omar Al Qassim	+971508901234	t	\N	\N	\N	2026-01-30 15:24:46.912	2026-01-30 15:24:46.912	\N	\N
86af4e7b-adaa-4e7d-b51f-806697d2e80e	testuser2@example.com	$2b$10$EJp/8KxOr7P9kJuzSSRfzu25Rx2womzaUqm5i/AJ2lwtybaZSJRpa	user	Test User	\N	f	BsxYGK4zBtyaGMccJPcC8cRPN6JNAfnV7eVE6JlM0z4WXb76kaG8kvD473QLUVZ1	\N	\N	2026-01-30 16:53:51.318	2026-01-30 16:53:51.318	\N	\N
e873e8bb-4435-4562-b595-59ba8898c092	aqsariasat235@gmail.com	$2b$10$7.vY4xYZnoIR77CSgjMJNeddLtnBNNNpMq2LLRBQHkKP2hsKoDKe2	user	Aqsa Riasat	\N	t	WYOmX0rn74AdgERMKyzoPSCBiTY4OuK0D94SIL08paOZfF5CkxJm7JAsfgyg5V87	\N	\N	2026-01-30 16:54:22.61	2026-01-30 16:56:35.924	\N	\N
a1025933-1b48-4623-91db-0ff13a091b7c	test-email-check@gmail.com	$2b$10$vrpNNqSYdTvzyZ9ll2H7yeSiZ9KfkFi1PoVXFLyYxpeBtlYxVD.K2	user	Test Email	\N	f	N02MTkRtUkoETfO7bXZdINB7PnSzQZHGs4SSSyiPiKwmmpjDYxaSOLePuyFHPfLJ	\N	\N	2026-01-30 17:04:29.066	2026-01-30 17:04:29.066	\N	\N
0aa46452-b94e-481e-87c6-390d50c821b2	catalyst@theredstone.ai	$2b$10$ck54V15Kc0Ju.tfoRl3/VumKbKfE8hKiXXZpTaDtFYJHpyNNnKeyW	user	Sajid Usman	\N	t	\N	\N	\N	2026-02-02 14:16:36.107	2026-02-02 14:18:14.127	2026-02-02 14:18:14.126	\N
d20849a8-e976-4711-8e27-bc530aed0c4a	parisapari4u53@gmail.com	$2b$10$zlgphXpKXv8wGS/lQamJPebOu4pk3ubF8EJft1EVxhpW31NNoahXa	sme	sonia soni	\N	t	\N	\N	\N	2026-02-02 13:30:46.759	2026-02-02 15:24:09.911	2026-02-02 15:24:09.91	\N
da65cb66-0593-4ab3-a690-82396bdf80d4	elishagill057@gmail.com	$2b$10$rXbZ95t/SC87RHJPOL5swe6YV3sbAWkA/Xo4qA6Er.n6hXbNh43dK	user	Elisha Gill	\N	f	Nran3mYzA7NnCl69O9cqdL8ZSk2xVNO22n1H4eQELH3ppDARqFgJ7vkKhKQeNhr2	\N	\N	2026-02-02 12:19:08.173	2026-02-02 12:19:08.173	\N	\N
b628b909-9328-4062-8648-bc243eb086aa	soniarabbani2166@gmail.com	$2b$10$zyYDGk9L3rTYzqU6owQt9uITuv7BKCBOIBGfX8oTnXkvoLwJEgfGC	sme	Soniya Rabbani	\N	t	\N	\N	\N	2026-02-02 11:51:11.804	2026-02-02 15:25:44.897	2026-02-02 15:25:44.896	\N
b94da295-129a-49d5-9589-380bd25c59ef	parisaumerkhalil@gmail.com	$2b$10$8usZUTvl8HJ/d.stutRFn.J2cY1ld1ac9Ld3.hGmVLwySzVS4NvP6	user	Soniya Rabbani	\N	t	\N	\N	\N	2026-02-02 13:05:46.036	2026-02-02 15:26:12.412	2026-02-02 15:26:12.411	/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770045566681-16122301-f5e1b56bc4764ec5442481b9ff4171b7.jpg
701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	elishagill166@gmail.com	$2b$10$KQbm9EtTt6k1Pxmm4Ebvu.4c7b6J7r65o93lv2n9J4R0Jc9xql6Mu	sme	ELISHA eli	\N	t	\N	\N	\N	2026-02-02 14:19:21.145	2026-02-02 15:03:01.461	2026-02-02 15:03:01.461	\N
258cb6d6-85be-4e4f-9830-107bac843987	rayasatmuhammad64@gmail.com	$2b$10$wJ6AXgagSmrlFLPjeKn6n.G8LPWcsuvQhklmaklMwD0df6o.kb/Yq	user	Aqsa Aqsa	0342096643	t	\N	\N	\N	2026-01-30 17:05:23.182	2026-02-06 16:52:10.431	2026-02-06 16:52:10.43	\N
eb13f924-6e62-47a6-a3c2-7708e677861c	email@theredstone.ai	$2b$10$knhSLwhUqTtxUbDhVcGzTOonu96HPT5uH34UzeFCcm4XhP1jMgJii	sme	Ali Hussain	\N	t	\N	\N	\N	2026-01-30 18:41:16.253	2026-02-06 22:33:17.582	2026-02-06 22:33:17.581	\N
e9152f33-af41-4c15-95f2-2d09b6feb174	arbazkhan164598@gmail.com	$2b$10$CWuLMVE4HPdZAAwxeF2tOuL1zimHX8NuHRIEblU7FGZCszSvIQq6a	sme	aqsa aqsa	\N	t	\N	\N	\N	2026-02-06 16:18:55.647	2026-02-06 18:02:48.425	2026-02-06 18:02:48.424	\N
d88b3155-20b4-4c5d-bb70-f6d5007358b5	x.sbf.x@live.com	$2b$10$PUr9/ynelOeqgsS9kVzuhOK4UdjsZTdpJOmGDqbF6cqUOsrRPc686	sme	john Doe	\N	f	6gLbxUcGJrbH0lX4SGH9IqtjYsoLnAQzHeJkyWxSG7CjbfAnBQrWaljXZZRXfDDv	\N	\N	2026-02-05 21:10:16.071	2026-02-05 21:10:16.071	\N	\N
674d623b-c2d4-4648-8115-5d0b1d164865	admin@smecert.ae	$2b$10$VF.CCufGG9FSQCnIwpcTL.6TUmvAgwuT3Be54HtsIUruC0azd9Qdu	admin	System Administrator	+971501234567	t	\N	\N	\N	2026-01-30 15:24:46.706	2026-02-07 00:02:18.649	2026-02-07 00:02:18.648	\N
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

\unrestrict KzoMql7dAgVVDiJC0n0XdhqFsFLfrnDEXecwSBnTKjb1iurrX4OMUb1ErwFmbHZ

