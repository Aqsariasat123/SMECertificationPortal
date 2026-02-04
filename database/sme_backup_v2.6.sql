[sudo] password for catalyst: --
-- PostgreSQL database dump
--

\restrict Fs4zeMgfS8dgdiVafhJ7DZUPxcYvOOboXxVXuicjScCgH2Xfppb7wDcntYphcTS

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: smeuser
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO smeuser;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: smeuser
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BusinessModel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BusinessModel" AS ENUM (
    'b2b',
    'b2c',
    'b2b2c',
    'marketplace',
    'saas',
    'other'
);


ALTER TYPE public."BusinessModel" OWNER TO postgres;

--
-- Name: CertificationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CertificationStatus" AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'certified',
    'rejected',
    'revision_requested'
);


ALTER TYPE public."CertificationStatus" OWNER TO postgres;

--
-- Name: FundingStage; Type: TYPE; Schema: public; Owner: postgres
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


ALTER TYPE public."FundingStage" OWNER TO postgres;

--
-- Name: IndustrySector; Type: TYPE; Schema: public; Owner: postgres
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


ALTER TYPE public."IndustrySector" OWNER TO postgres;

--
-- Name: InvestorType; Type: TYPE; Schema: public; Owner: smeuser
--

CREATE TYPE public."InvestorType" AS ENUM (
    'individual',
    'company'
);


ALTER TYPE public."InvestorType" OWNER TO smeuser;

--
-- Name: KycStatus; Type: TYPE; Schema: public; Owner: smeuser
--

CREATE TYPE public."KycStatus" AS ENUM (
    'not_submitted',
    'pending',
    'approved',
    'rejected',
    'revision_requested'
);


ALTER TYPE public."KycStatus" OWNER TO smeuser;

--
-- Name: LegalStructure; Type: TYPE; Schema: public; Owner: postgres
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


ALTER TYPE public."LegalStructure" OWNER TO postgres;

--
-- Name: OfficeType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OfficeType" AS ENUM (
    'own_premises',
    'rented',
    'shared_coworking',
    'virtual',
    'home_based'
);


ALTER TYPE public."OfficeType" OWNER TO postgres;

--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'pending',
    'viewed',
    'responded'
);


ALTER TYPE public."RequestStatus" OWNER TO postgres;

--
-- Name: SupportTicketPriority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SupportTicketPriority" AS ENUM (
    'low',
    'medium',
    'high'
);


ALTER TYPE public."SupportTicketPriority" OWNER TO postgres;

--
-- Name: SupportTicketStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SupportTicketStatus" AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'closed'
);


ALTER TYPE public."SupportTicketStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'user',
    'sme',
    'admin'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: smeuser
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


ALTER TABLE public._prisma_migrations OWNER TO smeuser;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: smeuser
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


ALTER TABLE public.audit_logs OWNER TO smeuser;

--
-- Name: chat_attachments; Type: TABLE; Schema: public; Owner: smeuser
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


ALTER TABLE public.chat_attachments OWNER TO smeuser;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: smeuser
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


ALTER TABLE public.chat_messages OWNER TO smeuser;

--
-- Name: introduction_requests; Type: TABLE; Schema: public; Owner: smeuser
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


ALTER TABLE public.introduction_requests OWNER TO smeuser;

--
-- Name: sme_profiles; Type: TABLE; Schema: public; Owner: smeuser
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
    "vatNumber" text
);


ALTER TABLE public.sme_profiles OWNER TO smeuser;

--
-- Name: support_messages; Type: TABLE; Schema: public; Owner: smeuser
--

CREATE TABLE public.support_messages (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.support_messages OWNER TO smeuser;

--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: smeuser
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


ALTER TABLE public.support_tickets OWNER TO smeuser;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: smeuser
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


ALTER TABLE public.user_profiles OWNER TO smeuser;

--
-- Name: users; Type: TABLE; Schema: public; Owner: smeuser
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


ALTER TABLE public.users OWNER TO smeuser;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: smeuser
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a1e145aa-2661-42f0-bbf9-28b56be7df3b	4155536762de1a3303b6457aac9d1513cc1300327eaa07f967e7fa471f7f8418	2026-01-30 15:22:00.397637+00	20260130152200_init	\N	\N	2026-01-30 15:22:00.351614+00	1
32eba1e6-ac43-43a9-92ee-23fd8a9f5249	3f66b16690d3ad9aa6d7dab553dd46398b4be8db3ce2c6762f24829d57f18a52	2026-01-30 20:22:51.584763+00	20260130202251_add_sme_response_field	\N	\N	2026-01-30 20:22:51.579103+00	1
683d14c3-61d7-426c-8e57-c734a2e45809	da430607c1c441cd03fe9c6d0f5ab08de33a36d9648a8645423b6b7784eb8767	2026-01-30 20:28:09.702087+00	20260130202809_add_chat_messages	\N	\N	2026-01-30 20:28:09.679599+00	1
7e12e67a-b735-4518-b0cc-3f0108f4900f	76906e053a1a4ccc7b75ef46874e5ffea7afee7d4f0a2981c1c0cbadc24bc50d	2026-01-30 20:38:00.877826+00	20260130203800_add_message_edit_delete	\N	\N	2026-01-30 20:38:00.872697+00	1
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: smeuser
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
6fb3cd70-bc06-46ed-808e-1488d63eaf05	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 06:27:16.702	\N	\N
47d413ab-42f4-4d58-99ed-c2014af45f85	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 06:45:09.953	\N	\N
316a2b6a-cd47-46e6-8667-27c953176bfe	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 06:46:35.004	\N	\N
a52197c0-cbec-46d3-8d65-154ee60515f7	0aa46452-b94e-481e-87c6-390d50c821b2	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 06:46:56.734	\N	\N
b97290d5-5846-4a99-9260-8380c3ae44a5	0aa46452-b94e-481e-87c6-390d50c821b2	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 06:48:22.484	\N	\N
db6829a0-9a3a-4a3d-a15f-4d5e69380db1	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 06:49:03.555	\N	\N
aa78a0e5-b814-4783-95ee-71f83d1877c6	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 06:56:29.727	\N	\N
1c53d886-0985-4e63-9121-9f4839ccf015	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 06:56:39.232	\N	\N
20dfc5ed-2954-47a3-bc93-e3c3fbb09d7f	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 06:57:06.451	\N	\N
c9eb3b18-9d87-4d19-a1aa-e5c7fef423ea	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 06:57:31.582	\N	\N
be294f4e-0a7c-489b-a880-473c03397ea8	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 07:04:56.833	\N	\N
5a31654b-aae7-49af-b432-e14616c19297	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 07:05:11.849	\N	\N
c64b7ba4-fd7b-476d-9d3e-4c1e0b4b8d6e	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 09:34:53.16	\N	\N
1504a494-fcac-4c62-95f7-e9b214de5070	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 09:34:57.833	\N	\N
221b42ef-acfe-49be-ad65-1c4521596e64	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 09:35:07.197	\N	\N
6ea3e2a9-91aa-4ace-a04c-afd6c0327491	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 09:48:21.747	\N	\N
f0035465-119e-4b2e-bdc8-aa2d31a97a00	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 09:48:28.639	\N	\N
f861c54e-bb07-4c27-8ecd-4b62699fea45	d20849a8-e976-4711-8e27-bc530aed0c4a	PROFILE_UPDATED	SME profile updated	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 09:51:56.926	\N	\N
700a92f2-48fc-49a9-b53c-f0ee333e182d	d20849a8-e976-4711-8e27-bc530aed0c4a	PROFILE_UPDATED	SME profile updated	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 09:53:07.586	\N	\N
a28e8985-cb77-421b-bb62-38a02151fdb9	d20849a8-e976-4711-8e27-bc530aed0c4a	PROFILE_UPDATED	SME profile updated	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 09:54:47.672	\N	\N
538bf6e2-6b63-4490-88c8-34a9e5ea939d	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 09:55:47.036	\N	\N
5708a65f-67c3-432b-baf5-87d682e2bf18	d20849a8-e976-4711-8e27-bc530aed0c4a	PROFILE_UPDATED	SME profile updated	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 09:56:24.486	\N	\N
f5b535a3-52d5-448e-97c5-57bb13a15c82	d20849a8-e976-4711-8e27-bc530aed0c4a	PROFILE_UPDATED	SME profile updated	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 09:58:15.913	\N	\N
5820bbe6-f7a0-40e5-839c-a5f5e743e455	d20849a8-e976-4711-8e27-bc530aed0c4a	PROFILE_UPDATED	SME profile updated	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 09:58:51.602	\N	\N
c9086b8f-13f7-4a3c-bc51-e6549987227e	d20849a8-e976-4711-8e27-bc530aed0c4a	DOCUMENT_UPLOADED	Document uploaded: Trade License	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 10:00:16.332	\N	\N
de500a44-d5e6-45ab-9bd8-a484716393b5	d20849a8-e976-4711-8e27-bc530aed0c4a	DOCUMENT_UPLOADED	Document uploaded: Certificate of Incorporation	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 10:00:21.722	\N	\N
f22a2462-488d-4583-b579-2bcb6686eebb	d20849a8-e976-4711-8e27-bc530aed0c4a	DOCUMENT_UPLOADED	Document uploaded: Financial Statements (Last 2 years)	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 10:00:25.681	\N	\N
96df2b2c-1397-4d1c-a5f8-3915ae707b91	d20849a8-e976-4711-8e27-bc530aed0c4a	DOCUMENT_UPLOADED	Document uploaded: Company Profile / Brochure	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 10:00:30.285	\N	\N
d48e929a-fb51-4f19-9bee-b1b39c6429a6	d20849a8-e976-4711-8e27-bc530aed0c4a	CERTIFICATION_SUBMITTED	Certification application submitted for CAREBRIDGE HEALTH SOLUTIONS	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 10:00:33.107	\N	\N
e024eaf6-e3da-4d70-a5a8-78438cdf3eb3	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 10:06:05.53	\N	\N
f1283ea9-9a5e-48d6-8f83-cc8c9e211d9a	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 10:06:13.135	\N	\N
98ed8705-a4c8-4500-b0dd-be6c7a56c0a7	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for CAREBRIDGE HEALTH SOLUTIONS	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 10:06:33.267	\N	{"status":"under_review"}
7c433ddb-146a-4f4a-933a-d9b893145410	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_APPROVE	Approved certification for CAREBRIDGE HEALTH SOLUTIONS	SMEProfile	e86fa395-04ca-4c30-aef9-d60073ebd829	10.10.10.1	2026-02-03 10:06:47.945	\N	{"status":"certified"}
23f79b05-b599-4658-8e3c-1023adf88583	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 10:08:36.185	\N	\N
9bff0d6e-92af-44b4-99eb-7a6656af0b91	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 10:08:40.978	\N	\N
1df24c2b-d7b8-46f0-85b8-2f83a12bb48a	b94da295-129a-49d5-9589-380bd25c59ef	INTRODUCTION_REQUESTED	Requested introduction to CAREBRIDGE HEALTH SOLUTIONS	IntroductionRequest	55441b99-8950-4232-a596-b4eb8db7d506	10.10.10.1	2026-02-03 10:09:30.31	\N	\N
de834424-12d8-4a49-b8c1-7de88bd751cc	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 10:10:15.497	\N	\N
470f05e9-2f49-494a-acd9-0619eccc3837	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 10:10:21.825	\N	\N
0f2bc370-b0c4-42cb-89d7-78f4e8331ea8	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 10:11:39.673	\N	\N
9ba00dc7-6ea9-4a14-ac1a-5b3a0fabbefe	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 10:11:42.271	\N	\N
3f1ff081-c1cc-45e4-a9d2-ad589fd523ba	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 10:12:31.703	\N	\N
e4e8cf8b-df8a-4315-a21b-14f7c7993822	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 10:12:36.049	\N	\N
84adf8e4-2d10-436d-b39f-03b9abafa79a	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 10:13:04.126	\N	\N
18eb18a7-603f-475d-8bd7-89a63d49fde8	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 12:59:41.362	\N	\N
8222c6a5-017f-44af-b81f-7e388ef34e57	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:00:05.519	\N	\N
8e4e78e8-e759-4398-a769-d4ccb27c387b	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:18:56.305	\N	\N
ff40f9b7-2886-4d1a-8d5e-1bd9423ac323	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:20:23.889	\N	\N
a040a896-6eee-4a0b-bd75-c0cc89c7bf36	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:22:26.496	\N	\N
5fb36fbe-a229-4f45-97da-29e84e408fc3	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:23:08.186	\N	\N
64bfe0b6-b113-40da-876d-560ba7d48924	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:23:13.862	\N	\N
fc77dd83-09f3-4c54-822e-05de9ac1ce27	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:27:26.173	\N	\N
543fc288-0bad-4ead-807f-4df019c9a888	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:36:25.154	\N	\N
eb6089d9-a0da-48b6-a9f2-db2ecdc48b6d	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:36:31	\N	\N
5da8b7f4-26ab-471b-839b-8dafec90a4af	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:36:36.177	\N	\N
6c7c73f9-1414-448f-9bbd-90151e98651a	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:39:31.844	\N	\N
378819d3-090f-4302-a38b-72b532c4b83d	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:39:38.442	\N	\N
ae2e96a1-cba8-4f85-8efc-bdb7ce889720	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:39:40.619	\N	\N
c893971a-6378-49e6-80b3-6ebfe8ab586a	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:39:45.934	\N	\N
9b0981a8-4f35-406e-a5db-3a7d0c7e7dea	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:40:37.364	\N	\N
d6282df5-6970-4ae1-8796-30ea33c6ea44	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:40:41.307	\N	\N
6d016088-b5dc-43bc-bb96-67d290f18e8f	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:42:09.058	\N	\N
0844979e-e2b2-44e7-91f0-5ea642a4b203	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:42:17.33	\N	\N
eb3ec487-db06-4a1d-a486-b205f591258e	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 13:42:26.815	\N	\N
42c9983e-3168-43ec-8d5a-684f7c679590	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 13:42:35.723	\N	\N
0d9567d0-448f-41fb-8c42-f38d00a35ad2	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 13:43:01.42	\N	\N
31622b67-d191-47a6-bb6f-e8d42309dd2b	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 13:43:10.048	\N	\N
c09e2323-edf8-4f4a-af61-36368cf8373d	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 13:43:13.153	\N	\N
42d3b0d3-8430-4343-b4c2-e66cc025f3e0	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 13:43:17.521	\N	\N
236e92a9-3e5a-4902-a2f0-c69d7c1f0f20	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 13:43:22.891	\N	\N
2a920769-cbae-4bc0-9b61-7d9a446819fd	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:44:05.867	\N	\N
65051afd-1bfe-4de6-8511-0f956b8c64fe	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:45:33.243	\N	\N
3c5cbf2b-2756-49d2-9756-bb4010dcde13	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:48:57.206	\N	\N
6eb45ac9-c4eb-4a5d-abed-2009420ff206	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 13:58:38.15	\N	\N
5e40472c-a01d-40cc-9237-f0ce44e1f062	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 13:59:29.594	\N	\N
565fc5b0-b4c7-463f-be48-7ab5ca6842f0	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 14:06:40.85	\N	\N
e0f01488-4610-4714-9095-f55d18185684	b628b909-9328-4062-8648-bc243eb086aa	LOGO_UPLOADED	Company logo uploaded for SME	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:08:29.538	\N	\N
0bcc5727-745d-4a56-9719-9bf36d968342	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:08:32.156	\N	\N
07207ebb-4767-4582-8654-aa57a28a9ca3	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:09:08.128	\N	\N
2834be56-fa17-49a9-9069-15c969edd6c5	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:09:45.144	\N	\N
c25eb2b7-f697-4d64-839c-32e2f90be8a1	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:10:11.345	\N	\N
99f31d74-b75f-477a-9b0b-9c5655bccc79	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:10:37.103	\N	\N
82e2c25b-7f22-4e31-b57c-a0ed3654a1a5	b628b909-9328-4062-8648-bc243eb086aa	PROFILE_UPDATED	SME profile updated	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:10:53.411	\N	\N
3acdc9cb-92c7-4198-aedb-c9c9571f312e	b628b909-9328-4062-8648-bc243eb086aa	DOCUMENT_UPLOADED	Document uploaded: Trade License	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:11:15.211	\N	\N
db472b3d-6795-412f-aefe-e0f1f8740573	b628b909-9328-4062-8648-bc243eb086aa	DOCUMENT_UPLOADED	Document uploaded: Certificate of Incorporation	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:11:21.872	\N	\N
61997f5f-ab54-44e1-bece-2b691da2606c	b628b909-9328-4062-8648-bc243eb086aa	DOCUMENT_UPLOADED	Document uploaded: Financial Statements (Last 2 years)	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:11:29.742	\N	\N
90749196-fd7a-4e3c-8862-3aee59b88dc7	b628b909-9328-4062-8648-bc243eb086aa	DOCUMENT_UPLOADED	Document uploaded: Company Profile / Brochure	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:12:21.484	\N	\N
2f318dc1-0794-4185-a4e3-c86b48f141a9	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 14:17:24.619	\N	\N
2b9fa2d4-6cc8-45bc-ab51-bf713de2500b	b628b909-9328-4062-8648-bc243eb086aa	CERTIFICATION_SUBMITTED	Certification application submitted for testing	SMEProfile	d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	10.10.10.1	2026-02-03 14:17:39.269	\N	\N
bdc80494-193f-40bc-b25c-945f1f73a4ef	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 14:18:56.229	\N	\N
1a152167-2fb1-4b55-a84d-7bd9c68dd5c6	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 14:19:35.678	\N	\N
e2a49efe-b387-4cf0-98e0-537855d22ff5	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 14:19:52.462	\N	\N
29425cf3-b01e-4a6e-b6ac-ff8180782624	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 14:22:33.411	\N	\N
a5a26052-ccdb-47ea-b090-4eb11d6f2c21	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 14:22:41.107	\N	\N
73a70ab4-0cb7-4d69-8637-510e411f1348	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 14:23:52.755	\N	\N
05a65c3a-7d89-491f-ba02-24b1f03b9895	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 14:24:11.245	\N	\N
f871b7fa-9cee-4315-8d70-45c90717cad7	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 14:27:00.398	\N	\N
3405d2fe-4fce-4f9f-a0ca-6fb92b7efb20	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 14:27:02.861	\N	\N
bc6d9a43-e338-4225-8165-4817dcbddd56	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 14:28:27.307	\N	\N
f76d4a4a-72e0-461d-9eb7-67fba9aec7b7	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 14:42:37.758	\N	\N
f2a635f8-57d0-42d7-8b1c-8fe01ffc2373	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 14:47:29.343	\N	\N
4ba353a2-6db7-4717-b28e-cd158317ba7a	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 14:48:25.911	\N	\N
a4790bc7-b958-43d6-9f08-43794c4b55f2	22186bc1-e5d5-4554-9d30-472e6f103956	USER_REGISTERED	New sme account registered	\N	\N	10.10.10.1	2026-02-03 15:11:38.908	\N	\N
9a376bc0-bd55-41b5-b8d9-f679eee8bd19	38a32b2d-d33e-479f-89de-e631c9ddc331	USER_REGISTERED	New user account registered	\N	\N	10.10.10.1	2026-02-03 15:15:07.945	\N	\N
28f12f75-ddde-4b6d-84ce-e880478d015e	38a32b2d-d33e-479f-89de-e631c9ddc331	EMAIL_VERIFIED	Email address verified successfully	\N	\N	10.10.10.1	2026-02-03 15:46:27.505	\N	\N
fb7364e2-c809-40dc-ae8d-530081eedc14	38a32b2d-d33e-479f-89de-e631c9ddc331	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 15:47:23.803	\N	\N
61a5cbce-fedf-4add-954c-509f06ade4c5	22186bc1-e5d5-4554-9d30-472e6f103956	EMAIL_VERIFIED	Email address verified successfully	\N	\N	10.10.10.1	2026-02-03 15:52:28.57	\N	\N
c4d88700-2530-4a97-ac58-0024bc0ec4d8	22186bc1-e5d5-4554-9d30-472e6f103956	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 15:52:36.509	\N	\N
da399157-52ac-4800-b584-bf8a0e2abba3	22186bc1-e5d5-4554-9d30-472e6f103956	LOGO_UPLOADED	Company logo uploaded for soniya soni	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:54:45.401	\N	\N
3c9c1e37-edd5-41e4-a491-60c26a05b591	22186bc1-e5d5-4554-9d30-472e6f103956	PROFILE_UPDATED	SME profile updated	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:55:09.004	\N	\N
ecf34ff8-5669-47d9-bd1a-a57d7b24d1a9	22186bc1-e5d5-4554-9d30-472e6f103956	PROFILE_UPDATED	SME profile updated	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:55:24.28	\N	\N
73480266-cae2-430f-b40e-88a838e05f9f	22186bc1-e5d5-4554-9d30-472e6f103956	PROFILE_UPDATED	SME profile updated	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:55:41.916	\N	\N
e0bea497-2a87-4b47-9261-beba7b277a2b	22186bc1-e5d5-4554-9d30-472e6f103956	PROFILE_UPDATED	SME profile updated	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:55:59.113	\N	\N
154b644d-8890-474c-94fd-a8beae4f2331	22186bc1-e5d5-4554-9d30-472e6f103956	PROFILE_UPDATED	SME profile updated	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:56:04.08	\N	\N
57060c48-02f4-4003-95e3-286941eb25ca	22186bc1-e5d5-4554-9d30-472e6f103956	PROFILE_UPDATED	SME profile updated	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:56:27.502	\N	\N
71e6f956-cc91-4d0f-bfcf-cbbf1a673a6c	22186bc1-e5d5-4554-9d30-472e6f103956	PROFILE_UPDATED	SME profile updated	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:56:43.494	\N	\N
072bc17f-2819-4970-a7f7-9420e6263f50	22186bc1-e5d5-4554-9d30-472e6f103956	DOCUMENT_UPLOADED	Document uploaded: Trade License	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:56:56.399	\N	\N
843749ff-f017-4c8c-852c-605cf57c6c18	22186bc1-e5d5-4554-9d30-472e6f103956	DOCUMENT_UPLOADED	Document uploaded: Certificate of Incorporation	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:56:57.927	\N	\N
a9509de1-86be-4c59-a6bd-1bb4d7daba7d	22186bc1-e5d5-4554-9d30-472e6f103956	DOCUMENT_UPLOADED	Document uploaded: Financial Statements (Last 2 years)	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:56:58.944	\N	\N
2f6877a4-e2cf-4250-bba1-8365d5209ac7	22186bc1-e5d5-4554-9d30-472e6f103956	DOCUMENT_UPLOADED	Document uploaded: Company Profile / Brochure	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:57:02.16	\N	\N
955713f8-6e56-43b1-8771-c524f8d7cbf8	22186bc1-e5d5-4554-9d30-472e6f103956	CERTIFICATION_SUBMITTED	Certification application submitted for soniya soni	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 15:57:04.488	\N	\N
9093852f-dff7-4172-b529-ba132a47bcb5	22186bc1-e5d5-4554-9d30-472e6f103956	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 16:00:13.263	\N	\N
5866eab2-a1dc-44cf-9786-8475e1c53e74	22186bc1-e5d5-4554-9d30-472e6f103956	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 16:00:23.329	\N	\N
ec8468d7-5b29-4998-b1d7-5375fb02773c	22186bc1-e5d5-4554-9d30-472e6f103956	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 16:01:01.406	\N	\N
209800a8-aa4b-4aac-a5ce-544946a7b47b	22186bc1-e5d5-4554-9d30-472e6f103956	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 16:02:15.982	\N	\N
08bf8703-9865-457b-9516-bab1463d768d	22186bc1-e5d5-4554-9d30-472e6f103956	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 16:02:41.625	\N	\N
7bb5c217-5ddd-4cfa-8cdb-a5f4b538d42d	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 16:02:44.995	\N	\N
f0efbbd7-f140-4eea-9e23-138bca0079b7	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for soniya soni	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-03 16:03:02.488	\N	{"status":"under_review"}
79b08ee4-529b-4d43-9b34-b177f387b714	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 17:42:38.253	\N	\N
5dbf39e0-1512-430f-add3-cf18061d0c16	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 18:03:55.972	\N	\N
54c80e49-b424-40f0-a6f5-806b5eab8e31	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 18:05:06.887	\N	\N
1256b888-4009-4e27-a142-dc84a0c3b589	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 18:05:38.264	\N	\N
693b4c90-8a8f-4cbd-a708-bb0353ea8dc7	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 19:36:20.839	\N	\N
9f0e4357-b96d-420b-83b6-d6c5fc156e97	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-03 19:38:30.181	\N	\N
e5a87e5e-9525-4279-b323-b486f0c2a4a5	eb13f924-6e62-47a6-a3c2-7708e677861c	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 19:38:58.591	\N	\N
b52e8550-ec9d-4c4b-811e-4daff0cc93ab	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-03 20:00:38.113	\N	\N
f1c846d3-b566-4cb1-94b1-96e4aad7e445	1d3e7a64-f32c-41fb-b4a9-0e12816ea89a	USER_REGISTERED	New sme account registered	\N	\N	10.10.10.1	2026-02-04 08:42:47.351	\N	\N
d1519865-ad35-4a9b-915a-1481c77595e5	1d3e7a64-f32c-41fb-b4a9-0e12816ea89a	EMAIL_VERIFIED	Email address verified successfully	\N	\N	10.10.10.1	2026-02-04 08:43:37.847	\N	\N
ddf38a5e-23ff-4232-bdb8-5183ce3a9758	1d3e7a64-f32c-41fb-b4a9-0e12816ea89a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 08:43:48.079	\N	\N
d07a8b46-8e7e-4d3e-b5bd-c460bfc023c3	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:10:39.698	\N	\N
f8f1f04e-5885-4507-b712-7545e53c9061	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:11:50.743	\N	\N
24b41db6-df8e-45a0-9000-63bd595ed5e2	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:12:00.006	\N	\N
af5dac58-e3d3-47b8-832a-7f99b6a09ff8	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:12:09.558	\N	\N
daf594f5-b1ff-49ac-b2af-fad5933ebd81	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:12:14.483	\N	\N
924c7ca7-b42d-42a8-a87d-7828abef71dc	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_REQUEST_REVISION	Requested revision for soniya soni	SMEProfile	8299399b-dc5a-4757-83cb-62345bd56ac3	10.10.10.1	2026-02-04 10:12:42.068	\N	{"status":"revision_requested","notes":"testing "}
ba0518e5-867e-4fda-9f63-94be60f8ef33	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:13:53.706	\N	\N
856b3f9a-e95d-49ff-ae34-e0b82a2efb71	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:14:07.434	\N	\N
e905c733-933c-4650-a94f-eac1a6bb2564	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:14:09.564	\N	\N
74eaeedc-a071-46d5-b708-0659d269476f	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:14:14.458	\N	\N
a1dfa9aa-c77c-43d0-99e1-e3174092bdb4	d20849a8-e976-4711-8e27-bc530aed0c4a	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:14:17.454	\N	\N
021a1c13-c8bc-4e70-8e1c-20b2fc91470e	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:14:24.091	\N	\N
72240c57-d101-4369-b11b-77c670c62054	b628b909-9328-4062-8648-bc243eb086aa	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:14:26.587	\N	\N
de236163-aa84-4f3d-b1b8-26e7b7c11400	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:14:44.064	\N	\N
200c8692-d378-407a-a652-f069f9973a29	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:16:17.101	\N	\N
6a840a68-f67a-4d0a-942c-267e4358774c	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:16:22.587	\N	\N
03f27de6-0f04-45af-8678-38b74715ceba	b94da295-129a-49d5-9589-380bd25c59ef	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:16:24.713	\N	\N
6fc1ac96-cde5-4d34-9972-3ff7c0a10858	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:16:41.477	\N	\N
664a6fe1-19bc-45f4-b189-163288a741b8	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:17:10.67	\N	\N
5fad61aa-7a18-417e-8cd7-b0d2787780f3	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	USER_REGISTERED	New sme account registered	\N	\N	10.10.10.1	2026-02-04 10:20:47.278	\N	\N
2cfacc11-f1b0-44ae-acac-a4a4060be702	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	EMAIL_VERIFIED	Email address verified successfully	\N	\N	10.10.10.1	2026-02-04 10:24:26.99	\N	\N
fcc80e79-d0fc-4c84-84cd-94b7e82e20b9	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:24:29.595	\N	\N
45c289c7-7776-46f8-81f2-36472ea4a261	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	PROFILE_UPDATED	SME profile updated	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:25:30.67	\N	\N
a98051a1-e504-412c-8376-895eb7861ea6	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	PROFILE_UPDATED	SME profile updated	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:25:49.395	\N	\N
7fb83221-d1a7-43f2-ad61-352fad856cfe	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	PROFILE_UPDATED	SME profile updated	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:26:15.102	\N	\N
1375d035-90a7-431d-b798-09b264e871bd	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	PROFILE_UPDATED	SME profile updated	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:26:25.469	\N	\N
402aaf10-4d63-460d-9489-662e78e7327f	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	PROFILE_UPDATED	SME profile updated	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:26:48.585	\N	\N
ff9f33ea-b2b5-4888-877e-9a3067f23e8a	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	PROFILE_UPDATED	SME profile updated	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:26:59.277	\N	\N
b0d2ca4e-97a4-4305-8e4c-a066c767ecce	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	DOCUMENT_UPLOADED	Document uploaded: Certificate of Incorporation	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:27:05.286	\N	\N
44285f1f-5134-493a-80cd-e033e5297bcd	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	DOCUMENT_UPLOADED	Document uploaded: Financial Statements (Last 2 years)	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:27:08.538	\N	\N
e30dffb2-1234-446e-98d1-c73957966681	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	DOCUMENT_UPLOADED	Document uploaded: Company Profile / Brochure	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:27:11.286	\N	\N
d123ed0c-1493-4c7f-b4d9-beb667903e86	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	DOCUMENT_UPLOADED	Document uploaded: Trade License	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:27:15.319	\N	\N
9ec181a6-1f0f-4da3-9a76-21f04ad312bb	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	LOGO_UPLOADED	Company logo uploaded for pasho	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:27:33.723	\N	\N
8f739337-00d0-4332-92e4-58b428e903b1	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	PROFILE_UPDATED	SME profile updated	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:27:37.914	\N	\N
23522e80-31d2-4c7a-8c1b-e63c5c80ff86	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	CERTIFICATION_SUBMITTED	Certification application submitted for pasho	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:27:45.103	\N	\N
82e0ada1-e549-419c-aed6-e532b5a58264	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:28:01.515	\N	\N
a37d68dd-5609-481f-a1c9-68d776c02bf5	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:28:05.606	\N	\N
40b998e8-1d3b-44aa-a872-4b508e7b5abd	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for pasho	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:28:13.952	\N	{"status":"under_review"}
d1894b09-5362-4b2a-9bac-e51e762f4d8d	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_REQUEST_REVISION	Requested revision for pasho	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:28:30.863	\N	{"status":"revision_requested","notes":"testing"}
68298ea3-3fdd-4423-b63b-aa69506758e6	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:28:50.494	\N	\N
6eb34bff-b4b9-4fea-a3b0-115091193717	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:28:52.722	\N	\N
b01d7216-a0f3-4655-a04b-0176a1143b56	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:28:54.629	\N	\N
37ac8ecd-d64b-43aa-b25e-c9e9b119068a	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:29:01.898	\N	\N
b38343c4-1c97-46fb-a72f-68386282d9fd	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	CERTIFICATION_SUBMITTED	Certification application submitted for pasho	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:29:48.579	\N	\N
4d27081f-af2c-4e26-bdb2-cc49d1c2c585	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:29:54.632	\N	\N
4a72b8d2-af15-4b73-867c-ae0c02c33dc1	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:29:58.823	\N	\N
9962ce1c-8d92-4982-b9f5-bd1234f52223	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_START_REVIEW	Started review for pasho	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:30:04.718	\N	{"status":"under_review"}
0b4b774a-2c8c-46d2-a0d3-4a4bdd4addac	674d623b-c2d4-4648-8115-5d0b1d164865	CERTIFICATION_REJECT	Rejected certification for pasho	SMEProfile	408e663e-b698-4500-9372-b1419b00b9fe	10.10.10.1	2026-02-04 10:30:43.901	\N	{"status":"rejected","notes":"sorry"}
cda1335d-bbe2-467b-bc27-f918a5049aad	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:30:48.673	\N	\N
37a93464-f3f1-4895-9664-19ee8644b906	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:30:52.895	\N	\N
2f3c611a-810e-4be9-99d2-8b92b4741c84	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 10:31:07.247	\N	\N
c280ad71-092c-4408-ab12-be464222e953	674d623b-c2d4-4648-8115-5d0b1d164865	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:31:54.844	\N	\N
e1c52ece-f853-4c69-8eb1-48156989cb19	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 10:37:45.769	\N	\N
30439e5d-8e07-4a55-8d1e-6da78268e155	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 12:14:44.453	\N	\N
68468856-db0f-4a25-8793-18f5c69e6c18	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 14:15:00.473	\N	\N
e312920b-7f0a-458f-b097-efdb463f79c8	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 14:15:12.95	\N	\N
46c1165c-4657-41f0-af34-e23fe351c0b9	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 14:39:16.936	\N	\N
805b1512-aaa7-418e-81cb-08b97a3eb708	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 14:39:39.304	\N	\N
cc2eeef8-9b4b-436c-abb0-77b4abdd4710	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 14:55:56.744	\N	\N
d796b98f-678d-4765-bed1-7506bde12f0f	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 14:56:04.789	\N	\N
6c290527-8ccb-4ecd-b978-dcfdcbd59a77	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGOUT	User logged out	\N	\N	10.10.10.1	2026-02-04 15:29:24.835	\N	\N
c2c22197-fc93-468f-b9a4-955fcd40fa52	258cb6d6-85be-4e4f-9830-107bac843987	USER_LOGIN	User logged in successfully	\N	\N	10.10.10.1	2026-02-04 15:29:34.407	\N	\N
\.


--
-- Data for Name: chat_attachments; Type: TABLE DATA; Schema: public; Owner: smeuser
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
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: smeuser
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
ed2f1b9d-8a66-45f3-a4d9-2f820aa276cd	55441b99-8950-4232-a596-b4eb8db7d506	d20849a8-e976-4711-8e27-bc530aed0c4a	Hello Soniya,  Thank you for reaching out and showing interest in CAREBRIDGE HEALTH SOLUTIONS. We appreciate your initiative and would be happy to explore potential collaboration opportunities with you.  Please let us know a convenient time to discuss further, or feel free to share more details about your proposal.  Best regards, CAREBRIDGE HEALTH SOLUTIONS Team	2026-02-03 10:11:07.684	f	[]	\N	f	f
92442d40-b39b-41e4-aabb-a849e276f88b	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	hlo	2026-02-03 07:05:21.739	t	[]	\N	f	f
bd99b027-5b28-45ba-8c96-9f79bcae01b8	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	hlo	2026-02-03 07:05:30.646	t	[]	\N	f	f
78f329ad-f447-407f-b399-fdd188d2f5bb	133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	hlo	2026-02-03 07:52:36.216	t	[]	\N	f	f
\.


--
-- Data for Name: introduction_requests; Type: TABLE DATA; Schema: public; Owner: smeuser
--

COPY public.introduction_requests (id, "requesterId", "smeProfileId", message, "contactPreferences", status, "requestedDate", "updatedAt", "respondedAt", "smeResponse") FROM stdin;
233e182d-f01a-48e9-ad0d-66cbb5ba08b5	17f046a0-8c7f-45e7-84b2-5941c5189375	50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	We are interested in exploring potential technology partnerships for our digital transformation initiatives. Would love to schedule a meeting to discuss collaboration opportunities.	Email preferred, available Mon-Thu	pending	2026-01-30 15:24:46.994	2026-01-30 15:24:46.994	\N	\N
b9ef8a4b-51a4-4284-b6c6-7a4cbc0bfe27	3bd38396-3d04-4b86-812c-4958e6cff136	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	Our investment fund is evaluating healthcare sector opportunities. Would appreciate an introduction to discuss your growth plans.	Phone call or video meeting	viewed	2026-01-30 15:24:47.002	2026-01-30 15:24:47.002	\N	\N
133e1536-b3d6-486d-a049-70a1f15847e4	258cb6d6-85be-4e4f-9830-107bac843987	e08d8b84-de5a-46b0-a2ca-a53a6c58b252	i want to know about your company	\N	responded	2026-01-30 20:07:32.104	2026-01-30 20:26:35.874	2026-01-30 20:26:35.873	hlo
26c33880-2196-4839-b1db-3db18e13ff07	258cb6d6-85be-4e4f-9830-107bac843987	c8d8db60-d7ab-4b2e-b13e-bd6197169d72	hello	\N	pending	2026-02-02 12:41:35.496	2026-02-02 12:41:35.496	\N	\N
47d863b7-7387-42be-b191-f812f947e6c9	b94da295-129a-49d5-9589-380bd25c59ef	bff4a163-a102-4334-ad12-37b1a6e468c1	Hello,\nI would like to connect with UAE GEM to explore potential collaboration opportunities and to better understand your manufacturing services. Looking forward to connecting.\nThank you.	\N	responded	2026-02-02 14:56:03.994	2026-02-02 15:04:35.82	2026-02-02 15:04:35.82	\N
2f0de7c1-cae6-4f30-ac2b-8a31e2405fb8	0aa46452-b94e-481e-87c6-390d50c821b2	bff4a163-a102-4334-ad12-37b1a6e468c1	hlo	\N	pending	2026-02-02 15:22:30.52	2026-02-02 15:22:30.52	\N	\N
55441b99-8950-4232-a596-b4eb8db7d506	b94da295-129a-49d5-9589-380bd25c59ef	e86fa395-04ca-4c30-aef9-d60073ebd829	Hello,\n\nMy name is Sonia Rabbani. I am interested in connecting with CAREBRIDGE HEALTH SOLUTIONS to explore potential collaboration opportunities and to better understand your healthcare consulting and operational support services.\n\nLooking forward to connecting. Thank you.	\N	responded	2026-02-03 10:09:30.305	2026-02-03 10:11:07.69	2026-02-03 10:11:07.689	\N
\.


--
-- Data for Name: sme_profiles; Type: TABLE DATA; Schema: public; Owner: smeuser
--

COPY public.sme_profiles (id, "userId", "companyName", "tradeLicenseNumber", "companyDescription", "industrySector", "foundingDate", "employeeCount", "annualRevenue", website, address, documents, "certificationStatus", "submittedDate", "reviewedById", "revisionNotes", "listingVisible", "createdAt", "updatedAt", "auditorName", "bankAccountNumber", "bankName", "boardMembers", "businessModel", "complianceOfficerEmail", "complianceOfficerName", "existingCertifications", "fundingStage", "hasAmlPolicy", "hasDataProtectionPolicy", "headOfficeAddress", "headOfficeLatitude", "headOfficeLongitude", "lastAuditDate", "legalStructure", "licenseExpiryDate", "linkedinUrl", "majorClients", "officeType", "operatingCountries", "ownerIdNumber", "ownerName", "ownerNationality", "profitMargin", "registrationCity", "registrationCountry", "registrationNumber", "regulatoryLicenses", "secondaryContactEmail", "secondaryContactName", "secondaryContactPhone", "shareholderStructure", "socialMedia", "vatNumber") FROM stdin;
50ce20c7-c1d8-48ed-9fbf-b6e16e4517f8	9a29bfa2-6177-45a8-a308-61c1f34fb13b	TechStart UAE	TL-2024-001234	Leading technology solutions provider specializing in AI and machine learning applications for businesses in the GCC region.	technology	2020-03-15 00:00:00	25	2500000.00	https://techstart.ae	Dubai Internet City, Building 5, Office 301	"[{\\"name\\":\\"Trade License\\",\\"path\\":\\"/uploads/tl-techstart.pdf\\",\\"uploadedAt\\":\\"2024-01-15\\"},{\\"name\\":\\"Financial Statement\\",\\"path\\":\\"/uploads/fs-techstart.pdf\\",\\"uploadedAt\\":\\"2024-01-15\\"}]"	certified	2024-01-20 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-01-30 15:24:46.85	2026-01-30 15:24:46.85	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c8d8db60-d7ab-4b2e-b13e-bd6197169d72	c4bf6f2a-e8d1-43c5-96fc-088387e93232	HealthPlus Medical Center	TL-2024-005678	Premium healthcare provider offering comprehensive medical services with state-of-the-art facilities.	healthcare	2018-07-10 00:00:00	45	5000000.00	https://healthplus.ae	Healthcare City, Abu Dhabi	"[{\\"name\\":\\"Trade License\\",\\"path\\":\\"/uploads/tl-healthplus.pdf\\",\\"uploadedAt\\":\\"2024-02-01\\"},{\\"name\\":\\"Healthcare License\\",\\"path\\":\\"/uploads/hl-healthplus.pdf\\",\\"uploadedAt\\":\\"2024-02-01\\"}]"	certified	2024-02-05 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-01-30 15:24:46.87	2026-01-30 15:24:46.87	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c5be1bd8-8f06-4623-9a58-0c66ee912a38	f7677afa-4185-4c3f-ae44-aadd4ce6d886	NewBiz Solutions	\N	\N	finance	\N	\N	\N	\N	\N	\N	draft	\N	\N	\N	f	2026-01-30 15:24:46.902	2026-01-30 15:24:46.902	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
67ab0070-d300-4e07-b86b-b4d41d7f9d6a	0918869a-495b-490d-95f2-604131cd34c9	ConstructCo Building Materials	TL-2024-003456	Building materials supplier for construction projects across UAE.	manufacturing	2017-05-12 00:00:00	60	8000000.00	https://constructco.ae	Jebel Ali Free Zone	\N	revision_requested	2024-02-15 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	Please provide updated financial statements for the last fiscal year and valid trade license copy.	f	2026-01-30 15:24:46.912	2026-01-30 15:24:46.912	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
f68a5830-0b06-49b3-b08f-0ebb2f219350	0c7a2ae9-b24b-4741-962b-10155a4131d6	RetailHub Trading	TL-2024-009012	Multi-channel retail business specializing in consumer electronics and home appliances.	retail	2019-11-20 00:00:00	30	3200000.00	https://retailhub.ae	Sharjah Industrial Area	"[{\\"name\\":\\"Trade License\\",\\"path\\":\\"/uploads/tl-retailhub.pdf\\",\\"uploadedAt\\":\\"2024-03-01\\"}]"	rejected	2024-03-05 00:00:00	674d623b-c2d4-4648-8115-5d0b1d164865	nothing	f	2026-01-30 15:24:46.886	2026-01-31 16:37:56.438	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e08d8b84-de5a-46b0-a2ca-a53a6c58b252	eb13f924-6e62-47a6-a3c2-7708e677861c	tjara	9876	tjara	finance	2026-01-16 00:00:00	175	\N	tjara.com	USA	{"companyLogo": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769877885750-862383348-Catalyst_Logo__1_.png", "contactName": "ali", "contactEmail": "aqsariasat235@gmail.com", "contactPhone": "+92545028212", "fundingStage": "seed", "revenueRange": ">100m", "revenueGrowth": "10-25", "uploadedFiles": [{"id": "doc_1769802932396_fwx40o9h8", "name": "1769802932382-997599077-5G_JOBS.pdf", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802932382-997599077-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-01-30T19:55:32.396Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1769802955799_yi71k4lh8", "name": "1769802955795-547704221-4784e97d99d60fbbc4723864e3f57281.jpg", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802955795-547704221-4784e97d99d60fbbc4723864e3f57281.jpg", "size": 17232, "type": "certificate_of_incorporation", "mimeType": "image/jpeg", "uploadedAt": "2026-01-30T19:55:55.799Z", "originalName": "4784e97d99d60fbbc4723864e3f57281.jpg"}, {"id": "doc_1769802999963_3wp3z6c0w", "name": "1769802999959-490222575-Catalyst_Logo_red__1_.png", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769802999959-490222575-Catalyst_Logo_red__1_.png", "size": 38309, "type": "financial_statements", "mimeType": "image/png", "uploadedAt": "2026-01-30T19:56:39.963Z", "originalName": "Catalyst_Logo_red (1).png"}, {"id": "doc_1769803012292_dzn6dwtlb", "name": "1769803012286-509302961-Catalyst_Logo__1_.png", "path": "/uploads/eb13f924-6e62-47a6-a3c2-7708e677861c/1769803012286-509302961-Catalyst_Logo__1_.png", "size": 11185, "type": "company_profile", "mimeType": "image/png", "uploadedAt": "2026-01-30T19:56:52.292Z", "originalName": "Catalyst_Logo (1).png"}], "contactPosition": "ceo"}	certified	2026-01-31 17:57:01.451	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-01-30 18:41:16.261	2026-02-02 19:18:13.593	YES		NBD	[]	b2b	aqsa	aqsa	[]	series_a	t	t	Dubai	\N	\N	2026-02-13 00:00:00	llc	2026-02-28 00:00:00	www	[]	own_premises	[]	533990	Ali	UAE	\N	Dubai	UAE	12345	[]	email@theredstone.ai	Ali	+92518434024	[]	{}	123
bff4a163-a102-4334-ad12-37b1a6e468c1	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	UAE GEM	65432	UAE GEM is a manufacturing-based company specializing in the production, processing, and distribution of high-quality industrial and commercial products. The company focuses on efficient manufacturing practices, quality control, and timely delivery to meet client and market demands across the UAE and regional markets.	manufacturing	2018-03-15 00:00:00	25	\N	https://example.com	Warehouse No. 12, Industrial Area 3,\nAl Qusais, Dubai,\nUnited Arab Emirates	{"companyLogo": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770042484831-850257127-bird_2.jpg", "contactName": "Sara Mahmood", "contactEmail": "contact@company.ae", "contactPhone": "+971 50 123 4567", "revenueRange": "50m-100m", "revenueGrowth": "10-25", "uploadedFiles": [{"id": "doc_1770043728158_ieg3lksig", "name": "1770043728155-200027744-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043728155-200027744-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:48:48.158Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770043733837_e3x2qyqvz", "name": "1770043733835-417939527-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043733835-417939527-5G_JOBS.pdf", "size": 101099, "type": "certificate_of_incorporation", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:48:53.837Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770043737648_tp3d1f5s5", "name": "1770043737646-144276519-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043737646-144276519-5G_JOBS.pdf", "size": 101099, "type": "financial_statements", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:48:57.648Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770043742667_f3ufqhezq", "name": "1770043742665-313672501-5G_JOBS.pdf", "path": "/uploads/701db0a1-7c0c-4b8a-94e4-72a8bd4c9004/1770043742665-313672501-5G_JOBS.pdf", "size": 101099, "type": "company_profile", "mimeType": "application/pdf", "uploadedAt": "2026-02-02T14:49:02.667Z", "originalName": "5G JOBS.pdf"}], "contactPosition": "Managing Director"}	certified	2026-02-02 14:49:15.627	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-02-02 14:19:21.15	2026-02-02 19:18:14.635	ABC Auditing & Consulting LLC		Emirates NBD	[]	b2b	compliance@company.ae	Fatima Noor	[]	bootstrapped	f	f	Office 405, Building A, Dubai Silicon Oasis, Dubai, United Arab Emirates	\N	\N	2026-06-30 00:00:00	llc	2026-12-31 00:00:00	https://linkedin.com/company/uae-gem	[]	own_premises	[]	784-1990-1234567-1	ELISHA ELI	Emirati	\N	Dubai	United Arab Emirates	CR-987654	[]	secondary@company.ae	Omar Khan	+971 55 987 6543	[]	{}	VAT-TRN-123456789000001
e86fa395-04ca-4c30-aef9-d60073ebd829	d20849a8-e976-4711-8e27-bc530aed0c4a	CAREBRIDGE HEALTH SOLUTIONS	727161	CAREBRIDGE HEALTH SOLUTIONS is a healthcare-focused company providing consulting, operational support, and healthcare management services. The company works with clinics, hospitals, and healthcare organizations to improve efficiency, compliance, and service quality while supporting sustainable healthcare operations.	healthcare	2012-01-15 00:00:00	25	\N	https://example.com	Office No. 1204, Al Fahidi Business Center,\nBur Dubai, Dubai,\nUnited Arab Emirates	{"contactName": "Sonia Rabbani", "contactEmail": "contact@carebridgehealth.ae", "contactPhone": "+971 50 123 4567", "revenueRange": "10m-50m", "revenueGrowth": "25-50", "uploadedFiles": [{"id": "doc_1770112816327_srtczkka1", "name": "1770112816309-537356255-5G_JOBS.pdf", "path": "/uploads/d20849a8-e976-4711-8e27-bc530aed0c4a/1770112816309-537356255-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T10:00:16.327Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770112821717_9xn15fp3m", "name": "1770112821715-433251640-5G_JOBS.pdf", "path": "/uploads/d20849a8-e976-4711-8e27-bc530aed0c4a/1770112821715-433251640-5G_JOBS.pdf", "size": 101099, "type": "certificate_of_incorporation", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T10:00:21.717Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770112825676_bkwchbub9", "name": "1770112825674-395024693-5G_JOBS.pdf", "path": "/uploads/d20849a8-e976-4711-8e27-bc530aed0c4a/1770112825674-395024693-5G_JOBS.pdf", "size": 101099, "type": "financial_statements", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T10:00:25.676Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770112830279_v7wqadwjv", "name": "1770112830277-738298242-5G_JOBS.pdf", "path": "/uploads/d20849a8-e976-4711-8e27-bc530aed0c4a/1770112830277-738298242-5G_JOBS.pdf", "size": 101099, "type": "company_profile", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T10:00:30.279Z", "originalName": "5G JOBS.pdf"}], "contactPosition": "Managing Director"}	certified	2026-02-03 10:00:33.102	674d623b-c2d4-4648-8115-5d0b1d164865	\N	t	2026-02-02 13:30:46.764	2026-02-03 10:06:47.94	KPMG Lower Gulf		Emirates NBD	[]	b2b2c	compliance@carebridgehealth.ae	Fatima Noor	[]	bootstrapped	t	t	Office No. 1204, Al Fahidi Business Center, Bur Dubai, Dubai, United Arab Emirates	\N	\N	2025-12-31 00:00:00	llc	2026-12-31 00:00:00	https://linkedin.com/company/carebridge-health-solutions	[]	own_premises	[]	784-1990-1234567-1	Pareesa Umer 	Emirati	\N	Dubai	United Arab Emirates	727161	[]	soniarabbani2166@gmail.com	Haniya Khan	+971 55 987 6543	[]	{}	100000000000003
d6d5376d-133d-4ac1-b60e-32ff0e93d7e3	b628b909-9328-4062-8648-bc243eb086aa	testing	727161	testing Company Identity	education	2026-08-06 00:00:00	175	\N	https://example.com	blah blah blah	{"companyLogo": "/uploads/b628b909-9328-4062-8648-bc243eb086aa/1770127709528-990128591-5be9e932fc2a23ddd7810c35a9131de8.jpg", "contactName": "Danish Rabbani", "contactEmail": "parisaumerkhalil@gmail.com", "contactPhone": "+923363007224", "revenueRange": "10m-50m", "revenueGrowth": "25-50", "uploadedFiles": [{"id": "doc_1770127875206_r8505a0ja", "name": "1770127875204-14100448-5G_JOBS.pdf", "path": "/uploads/b628b909-9328-4062-8648-bc243eb086aa/1770127875204-14100448-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T14:11:15.206Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770127881865_kmyvkzmcs", "name": "1770127881863-504609258-5G_JOBS.pdf", "path": "/uploads/b628b909-9328-4062-8648-bc243eb086aa/1770127881863-504609258-5G_JOBS.pdf", "size": 101099, "type": "certificate_of_incorporation", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T14:11:21.865Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770127889737_rcwiz4gpv", "name": "1770127889735-759746291-5G_JOBS.pdf", "path": "/uploads/b628b909-9328-4062-8648-bc243eb086aa/1770127889735-759746291-5G_JOBS.pdf", "size": 101099, "type": "financial_statements", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T14:11:29.737Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770127941479_hu3c6o8u3", "name": "1770127941464-646513658-5G_JOBS.pdf", "path": "/uploads/b628b909-9328-4062-8648-bc243eb086aa/1770127941464-646513658-5G_JOBS.pdf", "size": 101099, "type": "company_profile", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T14:12:21.479Z", "originalName": "5G JOBS.pdf"}], "contactPosition": "Managing Director"}	submitted	2026-02-03 14:17:39.254	\N	\N	f	2026-02-02 11:51:11.811	2026-02-03 14:17:39.255	ABC Auditing & Consulting LLC		Emirates NBD	[]	b2b	sonia@theredstone.ai	Fatima Noor	[]	bootstrapped	t	t	Office No. 1204, Al Fahidi Business Center, Bur Dubai, Dubai, United Arab Emirates	\N	\N	2025-07-06 00:00:00	branch	\N	https://linkedin.com/company/uae-gem	[]	own_premises	[]	784-1990-1234567-1	testing soni	Emirati	\N	Dubai	United Arab Emirates	727161	[]	soniarabbani2166@gmail.com	Haniya Khan	+923363007224	[]	{}	VAT-TRN-123456789000001
dc235c6e-2ba8-4a94-955b-2c701d667bad	1d3e7a64-f32c-41fb-b4a9-0e12816ea89a	Redstone Catalyst	764587768956	\N	healthcare	\N	\N	\N	\N	\N	\N	draft	\N	\N	\N	f	2026-02-04 08:42:45.118	2026-02-04 08:42:45.118	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8299399b-dc5a-4757-83cb-62345bd56ac3	22186bc1-e5d5-4554-9d30-472e6f103956	soniya soni	368269	Company Description * Company Description *Company Description *	real_estate	2026-05-13 00:00:00	500	\N	https://example.com	Business Address * Business Address *Business Address *	{"companyLogo": "/uploads/22186bc1-e5d5-4554-9d30-472e6f103956/1770134085393-927604340-875d1a806fc30904262b36bc5784f29e.jpg", "contactName": "Danish Rabbani", "contactEmail": "parisaumerkhalil@gmail.com", "contactPhone": "+923363007224", "revenueRange": "10m-50m", "revenueGrowth": "10-25", "uploadedFiles": [{"id": "doc_1770134216393_709upbylj", "name": "1770134216391-379406814-5G_JOBS.pdf", "path": "/uploads/22186bc1-e5d5-4554-9d30-472e6f103956/1770134216391-379406814-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T15:56:56.393Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770134217922_ss8bpwmc3", "name": "1770134217920-855367367-5G_JOBS.pdf", "path": "/uploads/22186bc1-e5d5-4554-9d30-472e6f103956/1770134217920-855367367-5G_JOBS.pdf", "size": 101099, "type": "certificate_of_incorporation", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T15:56:57.922Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770134218937_g3v7i47ht", "name": "1770134218935-766541579-5G_JOBS.pdf", "path": "/uploads/22186bc1-e5d5-4554-9d30-472e6f103956/1770134218935-766541579-5G_JOBS.pdf", "size": 101099, "type": "financial_statements", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T15:56:58.937Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770134222155_gtln42ezj", "name": "1770134222153-454289408-5G_JOBS.pdf", "path": "/uploads/22186bc1-e5d5-4554-9d30-472e6f103956/1770134222153-454289408-5G_JOBS.pdf", "size": 101099, "type": "company_profile", "mimeType": "application/pdf", "uploadedAt": "2026-02-03T15:57:02.155Z", "originalName": "5G JOBS.pdf"}], "contactPosition": "Managing Director"}	revision_requested	2026-02-03 15:57:04.481	674d623b-c2d4-4648-8115-5d0b1d164865	testing 	f	2026-02-03 15:11:36.913	2026-02-04 10:12:42.061	KPMG Lower Gulf		Emirates NBD	[]	b2c	Mail@synet.com.pk	Fatima Noor	[]	series_b	t	t	Office No. 1204, Al Fahidi Business Center, Bur Dubai, Dubai, United Arab Emirates	\N	\N	0025-12-31 00:00:00	llc	2026-03-04 00:00:00	https://linkedin.com/company/uae-gem	[]	shared_coworking	[]		testing soni	Emirati	\N		United Arab Emirates	727161	[]	soniarabbani2166@gmail.com	Soniya Rabbani	+923363007224	[]	{}	VAT-TRN-123456789000001
408e663e-b698-4500-9372-b1419b00b9fe	5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	pasho	73836	testing emails 	hospitality	2026-04-07 00:00:00	75	\N	https://example.com	testing testing	{"companyLogo": "/uploads/5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d/1770200853714-778951403-5c8c4370299b453f7d56029b15c13e72.jpg", "contactName": "soni", "contactEmail": "sonia@theredstone.ai", "contactPhone": "+923009842041", "revenueRange": "", "revenueGrowth": "", "uploadedFiles": [{"id": "doc_1770200825280_1ekciyo3p", "name": "1770200825277-326803809-5G_JOBS.pdf", "path": "/uploads/5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d/1770200825277-326803809-5G_JOBS.pdf", "size": 101099, "type": "certificate_of_incorporation", "mimeType": "application/pdf", "uploadedAt": "2026-02-04T10:27:05.280Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770200828524_rk33t4t6a", "name": "1770200828522-954002700-5G_JOBS.pdf", "path": "/uploads/5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d/1770200828522-954002700-5G_JOBS.pdf", "size": 101099, "type": "financial_statements", "mimeType": "application/pdf", "uploadedAt": "2026-02-04T10:27:08.524Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770200831279_qfh13vlt6", "name": "1770200831276-906317577-5G_JOBS.pdf", "path": "/uploads/5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d/1770200831276-906317577-5G_JOBS.pdf", "size": 101099, "type": "company_profile", "mimeType": "application/pdf", "uploadedAt": "2026-02-04T10:27:11.279Z", "originalName": "5G JOBS.pdf"}, {"id": "doc_1770200835314_gocl98w94", "name": "1770200835312-274946342-5G_JOBS.pdf", "path": "/uploads/5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d/1770200835312-274946342-5G_JOBS.pdf", "size": 101099, "type": "trade_license", "mimeType": "application/pdf", "uploadedAt": "2026-02-04T10:27:15.314Z", "originalName": "5G JOBS.pdf"}], "contactPosition": "Managing Director"}	rejected	2026-02-04 10:29:48.571	674d623b-c2d4-4648-8115-5d0b1d164865	sorry	f	2026-02-04 10:20:45.447	2026-02-04 10:30:43.896	ABC Auditing & Consulting LLC		Emirates NBD	[]	b2b	parisaumerkhalil@gmail.com	Fatima Noor	[]	bootstrapped	t	t	Office No. 1204, Al Fahidi Business Center, Bur Dubai, Dubai, United Arab Emirates	\N	\N	2025-03-05 00:00:00	partnership	2026-09-09 00:00:00	https://linkedin.com/company/uae-gem	[]	own_premises	[]	784-1990-1234567-1	testing soni	Emirati	\N	Dubai	United Arab Emirates	727161	[]	soniarabbani2166@gmail.com	Haniya Khan	+923353861375	[]	{}	100000000000003
\.


--
-- Data for Name: support_messages; Type: TABLE DATA; Schema: public; Owner: smeuser
--

COPY public.support_messages (id, "ticketId", "senderId", content, "isRead", "createdAt") FROM stdin;
8c301fe0-bedd-40de-be54-ac0f5370e583	882e0107-098a-4456-89e3-e9a6d2362b1d	eb13f924-6e62-47a6-a3c2-7708e677861c	help about registration	t	2026-01-31 18:36:22.606
c5ed4008-50b9-4144-b00e-310d0743d956	882e0107-098a-4456-89e3-e9a6d2362b1d	674d623b-c2d4-4648-8115-5d0b1d164865	hlo	t	2026-01-31 18:36:40.605
68df5fe1-22b3-4d72-8690-fe5341702708	9acc5f83-0126-4770-86ac-c2c2df02cf37	eb13f924-6e62-47a6-a3c2-7708e677861c	hello how r u ?	t	2026-02-02 12:28:23.834
6243d330-345c-4e84-9f0f-f48e1324096f	cea61170-97a5-4d84-991c-4051669e5d59	eb13f924-6e62-47a6-a3c2-7708e677861c	testing issues 	t	2026-02-02 12:22:12.125
5aa3f2f8-c75d-4ec3-bb54-5b2bef28b467	cea61170-97a5-4d84-991c-4051669e5d59	eb13f924-6e62-47a6-a3c2-7708e677861c	hello	t	2026-02-02 12:23:55.761
2df438cd-91a8-4f6b-a4bc-927b087c9441	cea61170-97a5-4d84-991c-4051669e5d59	674d623b-c2d4-4648-8115-5d0b1d164865	hi	f	2026-02-02 12:47:49.053
4d701b91-d70f-42f7-8c33-47acb00e1d59	cea61170-97a5-4d84-991c-4051669e5d59	674d623b-c2d4-4648-8115-5d0b1d164865	how can i help u?	f	2026-02-02 12:48:02.381
d8f0544c-6dec-4542-863c-0e021dc423a4	ccc854ba-5bd5-49b4-9061-81eeb6f2ee2a	eb13f924-6e62-47a6-a3c2-7708e677861c	testing testing testing	t	2026-02-02 12:19:53.22
b42e3743-7101-4f36-9ef8-009bce4cfa2e	ccc854ba-5bd5-49b4-9061-81eeb6f2ee2a	eb13f924-6e62-47a6-a3c2-7708e677861c	hello	t	2026-02-02 12:20:35.522
e89c7ea5-cbdc-4029-9e06-b5e78dbd902a	832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	hlo	t	2026-02-01 18:52:03.14
c9aeb0ac-732b-4b9a-9f00-fe6f8cefd44d	7bd390f4-17b2-44f1-a284-1c87343cf7aa	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	Hello Team,\nThis is a test support request submitted to verify the support form functionality. Please ignore this message as it is for testing purposes only.\nThank you.	t	2026-02-02 14:50:19.682
db28544c-29db-45b7-820d-bd978f10fde4	832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	[ATTACHMENT]{"type":"attachment","fileName":"1770048857856-998708406.png","originalName":"Screenshot 2026-02-01 at 9.43.08aÌ_Â¯PM (1).png","mimeType":"image/png","size":316935,"path":"/api/support/tickets/832bd7c1-3926-4750-80c8-d964da4ae3d6/download/1770048857856-998708406.png"}	t	2026-02-02 16:14:17.862
3e77298d-5339-4387-8ea3-bce551590f10	7bd390f4-17b2-44f1-a284-1c87343cf7aa	674d623b-c2d4-4648-8115-5d0b1d164865	hlo	f	2026-02-03 06:53:44.464
ffe746fd-67af-4fd8-b38c-ebed6d1801aa	832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	hlo	t	2026-02-03 06:56:47.128
3671c1fc-0044-4e4b-b078-b856d746868c	7bd390f4-17b2-44f1-a284-1c87343cf7aa	674d623b-c2d4-4648-8115-5d0b1d164865	hi	f	2026-02-03 07:01:08.49
afea2bf9-49a1-419e-889e-47dea22c2ffb	7bd390f4-17b2-44f1-a284-1c87343cf7aa	674d623b-c2d4-4648-8115-5d0b1d164865	hlo	f	2026-02-03 07:01:15.069
31b8f76e-1089-4552-a31e-a2b0125c2549	7bd390f4-17b2-44f1-a284-1c87343cf7aa	674d623b-c2d4-4648-8115-5d0b1d164865	[ATTACHMENT]{"type":"attachment","fileName":"1770102266605-350796756.png","originalName":"Screenshot 2026-02-03 at 2.32.57â¯AM.png","mimeType":"image/png","size":423653,"path":"/api/support/tickets/7bd390f4-17b2-44f1-a284-1c87343cf7aa/download/1770102266605-350796756.png"}	f	2026-02-03 07:04:26.608
6364cd31-31e4-4b09-b818-c049201b984a	832bd7c1-3926-4750-80c8-d964da4ae3d6	674d623b-c2d4-4648-8115-5d0b1d164865	[ATTACHMENT]{"type":"attachment","fileName":"1770102053524-872806617.png","originalName":"Screenshot 2026-02-03 at 12.00.42â¯AM.png","mimeType":"image/png","size":442034,"path":"/api/support/tickets/832bd7c1-3926-4750-80c8-d964da4ae3d6/download/1770102053524-872806617.png"}	t	2026-02-03 07:00:53.527
549310db-1450-4618-814d-a773516c8674	832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	hlo	t	2026-02-03 07:05:52.303
00bbdf9c-e095-46bc-b49f-e8d4b803a321	832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	hlo	t	2026-02-03 07:52:29.587
1e1c83d0-47d4-488d-a520-2b8898bcc314	c9a0b980-660b-4549-ab49-2495d69601b3	d20849a8-e976-4711-8e27-bc530aed0c4a	I am currently completing the company profile and certification process. I would appreciate your assistance in reviewing the required fields and confirming if all provided information meets the submission requirements.\n\nPlease let me know if any additional details or documents are needed from my side.\n\nThank you for your support.	t	2026-02-03 10:04:57.489
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: smeuser
--

COPY public.support_tickets (id, "userId", subject, status, priority, "createdAt", "updatedAt", "closedAt") FROM stdin;
882e0107-098a-4456-89e3-e9a6d2362b1d	eb13f924-6e62-47a6-a3c2-7708e677861c	help about registration	closed	medium	2026-01-31 18:36:22.606	2026-01-31 18:37:08.981	2026-01-31 18:37:08.98
9acc5f83-0126-4770-86ac-c2c2df02cf37	eb13f924-6e62-47a6-a3c2-7708e677861c	testing	open	medium	2026-02-02 12:28:23.834	2026-02-02 12:28:23.834	\N
cea61170-97a5-4d84-991c-4051669e5d59	eb13f924-6e62-47a6-a3c2-7708e677861c	testing request	resolved	medium	2026-02-02 12:22:12.125	2026-02-02 12:48:13.418	2026-02-02 12:48:13.418
ccc854ba-5bd5-49b4-9061-81eeb6f2ee2a	eb13f924-6e62-47a6-a3c2-7708e677861c	testing	in_progress	medium	2026-02-02 12:19:53.22	2026-02-02 12:48:57.926	\N
7bd390f4-17b2-44f1-a284-1c87343cf7aa	701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	hi	resolved	medium	2026-02-02 14:50:19.682	2026-02-03 07:04:26.612	2026-02-03 06:53:39.22
832bd7c1-3926-4750-80c8-d964da4ae3d6	258cb6d6-85be-4e4f-9830-107bac843987	hlo	open	medium	2026-02-01 18:52:03.14	2026-02-03 07:52:29.591	\N
c9a0b980-660b-4549-ab49-2495d69601b3	d20849a8-e976-4711-8e27-bc530aed0c4a	Assistance with Company Profile Submission	open	medium	2026-02-03 10:04:57.489	2026-02-03 10:04:57.489	\N
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: smeuser
--

COPY public.user_profiles (id, "userId", company, "jobTitle", "createdAt", "updatedAt", "annualIncome", "authRepEmail", "authRepEmiratesId", "authRepName", "authRepPhone", "authRepPosition", "beneficialOwners", city, "companyAddress", "companyAnnualRevenue", "companyCity", "companyCountry", "companyEmployeeCount", "companyName", "companyPoBox", "companyType", country, "dateOfBirth", "emiratesId", "emiratesIdExpiry", "employerName", "employmentStatus", gender, "investmentBudget", "investmentInterests", "investorType", "kycDocuments", "kycRejectionReason", "kycReviewedAt", "kycReviewedBy", "kycRevisionNotes", "kycStatus", "kycSubmittedAt", nationality, occupation, "passportCountry", "passportExpiry", "passportNumber", "poBox", "registrationAuthority", "registrationDate", "registrationNumber", "residencyStatus", "residentialAddress", "riskTolerance", "sourceOfFunds", "tradeLicenseExpiry", "tradeLicenseNumber") FROM stdin;
568414a6-8bc5-400c-ab6d-b1b0e5bf5f11	17f046a0-8c7f-45e7-84b2-5941c5189375	Dubai Investment Partners	Business Development Manager	2026-01-30 15:24:46.721	2026-01-30 15:24:46.721	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	not_submitted	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
c46be5b7-5191-4646-b2f4-a65b7453d2be	3bd38396-3d04-4b86-812c-4958e6cff136	Abu Dhabi Ventures	Investment Analyst	2026-01-30 15:24:46.738	2026-01-30 15:24:46.738	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	not_submitted	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32b17582-71e2-4c85-bf62-2d50f89655db	258cb6d6-85be-4e4f-9830-107bac843987	123	\N	2026-01-31 08:33:53.821	2026-02-02 11:50:37.336	100k_250k	\N	\N	\N	\N	\N	\N	pakistan	\N	\N	\N	\N	\N	\N	\N	\N	pakistan	2026-02-03 00:00:00	Y45788	2046-03-20 00:00:00	\N	employed	female	\N	\N	individual	[{"name": "Screenshot 2026-02-02 at 3.49.59â¯PM.png", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021800137-42029610-Screenshot_2026_02_02_at_3_49_59___PM.png", "type": "emirates_id_front", "uploadedAt": "2026-02-02T08:43:20.141Z"}, {"name": "Screenshot 2026-02-02 at 3.49.59â¯PM.png", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021840868-302677117-Screenshot_2026_02_02_at_3_49_59___PM.png", "type": "emirates_id_back", "uploadedAt": "2026-02-02T08:44:00.870Z"}, {"name": "Screenshot 2026-02-02 at 3.49.59â¯PM.png", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021849377-26333005-Screenshot_2026_02_02_at_3_49_59___PM.png", "type": "passport", "uploadedAt": "2026-02-02T08:44:09.379Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1770021877502-772281117-5G_JOBS.pdf", "type": "proof_of_address", "uploadedAt": "2026-02-02T08:44:37.503Z"}]	\N	2026-02-02 10:11:40.614	674d623b-c2d4-4648-8115-5d0b1d164865	\N	approved	2026-02-02 08:44:39.765	UAE	pakistan	pakistan	2036-02-20 00:00:00	76347578	\N	\N	\N	\N	resident	pakistan	\N	business	\N	\N
049cabf6-2690-4864-a7f0-103b6ebba063	b94da295-129a-49d5-9589-380bd25c59ef	\N	\N	2026-02-02 15:00:45.308	2026-02-02 15:09:54.711	100k_250k	\N	\N	\N	\N	\N	\N	Dubai	\N	\N	\N	\N	\N	\N	\N	\N	United Arab Emirates	1993-08-12 00:00:00	784-1992-4567890-1	2028-09-30 00:00:00	\N	employed	male	\N	\N	individual	[{"name": "5G JOBS.pdf", "path": "/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770044445305-65736314-5G_JOBS.pdf", "type": "emirates_id_front", "uploadedAt": "2026-02-02T15:00:45.305Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770044454585-582670561-5G_JOBS.pdf", "type": "emirates_id_back", "uploadedAt": "2026-02-02T15:00:54.586Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770044458382-231151908-5G_JOBS.pdf", "type": "passport", "uploadedAt": "2026-02-02T15:00:58.382Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770044462865-400648210-5G_JOBS.pdf", "type": "proof_of_address", "uploadedAt": "2026-02-02T15:01:02.866Z"}, {"name": "5G JOBS.pdf", "path": "/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770044465758-237162635-5G_JOBS.pdf", "type": "source_of_funds", "uploadedAt": "2026-02-02T15:01:05.759Z"}]	\N	2026-02-02 15:09:54.71	674d623b-c2d4-4648-8115-5d0b1d164865	\N	approved	2026-02-02 15:01:06.593	UAE	Business Analyst	United Arab Emirates	2030-07-15 00:00:00	A12345678	\N	\N	\N	\N	resident	Apartment 1204, Al Nahda Tower	\N	salary	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: smeuser
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
38a32b2d-d33e-479f-89de-e631c9ddc331	laibagull0602@gmail.com	$2b$10$VAtA4FW/l/8IYNV.1PkPAuMUju5yGlsQbRJXrwQCeyw/lac5kZwjK	user	sonia soni	\N	t	\N	\N	\N	2026-02-03 15:15:06.738	2026-02-03 15:47:23.799	2026-02-03 15:47:23.798	\N
d20849a8-e976-4711-8e27-bc530aed0c4a	parisapari4u53@gmail.com	$2b$10$zlgphXpKXv8wGS/lQamJPebOu4pk3ubF8EJft1EVxhpW31NNoahXa	sme	sonia soni	\N	t	\N	\N	\N	2026-02-02 13:30:46.759	2026-02-04 10:14:14.452	2026-02-04 10:14:14.451	\N
da65cb66-0593-4ab3-a690-82396bdf80d4	elishagill057@gmail.com	$2b$10$rXbZ95t/SC87RHJPOL5swe6YV3sbAWkA/Xo4qA6Er.n6hXbNh43dK	user	Elisha Gill	\N	f	Nran3mYzA7NnCl69O9cqdL8ZSk2xVNO22n1H4eQELH3ppDARqFgJ7vkKhKQeNhr2	\N	\N	2026-02-02 12:19:08.173	2026-02-02 12:19:08.173	\N	\N
b628b909-9328-4062-8648-bc243eb086aa	soniarabbani2166@gmail.com	$2b$10$zyYDGk9L3rTYzqU6owQt9uITuv7BKCBOIBGfX8oTnXkvoLwJEgfGC	sme	Soniya Rabbani	\N	t	\N	\N	\N	2026-02-02 11:51:11.804	2026-02-04 10:14:24.087	2026-02-04 10:14:24.086	\N
22186bc1-e5d5-4554-9d30-472e6f103956	saadlhaan19@gmail.com	$2b$10$LK7EaaJgmnCWUCqtQltApuPd/jE1PvJ9Wq3UtAg3ospSghavxLjlG	sme	sonia soni	\N	t	\N	\N	\N	2026-02-03 15:11:36.909	2026-02-03 16:02:15.978	2026-02-03 16:02:15.978	\N
b94da295-129a-49d5-9589-380bd25c59ef	parisaumerkhalil@gmail.com	$2b$10$8usZUTvl8HJ/d.stutRFn.J2cY1ld1ac9Ld3.hGmVLwySzVS4NvP6	user	Soniya Rabbani	\N	t	\N	\N	\N	2026-02-02 13:05:46.036	2026-02-04 10:16:22.583	2026-02-04 10:16:22.582	/uploads/b94da295-129a-49d5-9589-380bd25c59ef/1770045566681-16122301-f5e1b56bc4764ec5442481b9ff4171b7.jpg
258cb6d6-85be-4e4f-9830-107bac843987	rayasatmuhammad64@gmail.com	$2b$10$wJ6AXgagSmrlFLPjeKn6n.G8LPWcsuvQhklmaklMwD0df6o.kb/Yq	user	Aqsa Aqsa	0342096643	t	\N	\N	\N	2026-01-30 17:05:23.182	2026-02-04 15:29:34.401	2026-02-04 15:29:34.4	/uploads/258cb6d6-85be-4e4f-9830-107bac843987/1769872268928-679900289-4784e97d99d60fbbc4723864e3f57281.jpg
5ba0ea50-4b5f-427a-a4e1-00b0bdf9724d	pashminakazi@gmail.com	$2b$10$GcJHL1O8KHpTvKvtLlaDLODD4C76SwXYYxIGfrlz8/sczOAcVQ/1C	sme	sonu soni	\N	t	\N	\N	\N	2026-02-04 10:20:45.442	2026-02-04 10:30:52.89	2026-02-04 10:30:52.889	\N
701db0a1-7c0c-4b8a-94e4-72a8bd4c9004	elishagill166@gmail.com	$2b$10$KQbm9EtTt6k1Pxmm4Ebvu.4c7b6J7r65o93lv2n9J4R0Jc9xql6Mu	sme	ELISHA eli	\N	t	\N	\N	\N	2026-02-02 14:19:21.145	2026-02-02 15:03:01.461	2026-02-02 15:03:01.461	\N
0aa46452-b94e-481e-87c6-390d50c821b2	catalyst@theredstone.ai	$2b$10$ck54V15Kc0Ju.tfoRl3/VumKbKfE8hKiXXZpTaDtFYJHpyNNnKeyW	user	Sajid Usman	\N	t	\N	\N	\N	2026-02-02 14:16:36.107	2026-02-03 06:46:56.729	2026-02-03 06:46:56.728	\N
674d623b-c2d4-4648-8115-5d0b1d164865	admin@smecert.ae	$2b$10$Ych8nNd1Vkcn6i.sLS5iEOJcFNA/4ShdpGAa9ohjhzuaVmamNeQ5C	admin	System Administrator	+971501234567	t	\N	\N	\N	2026-01-30 15:24:46.706	2026-02-04 10:31:54.84	2026-02-04 10:31:54.839	\N
1d3e7a64-f32c-41fb-b4a9-0e12816ea89a	arbazkhan164598@gmail.com	$2b$10$lGhUkR8bNSvAnKN7ZWru2ugodd45lGwu95nEuIwi.Q9Tq1yrje1Ma	sme	Redstone Catalyst	\N	t	\N	\N	\N	2026-02-04 08:42:45.113	2026-02-04 08:43:48.075	2026-02-04 08:43:48.074	\N
eb13f924-6e62-47a6-a3c2-7708e677861c	email@theredstone.ai	$2b$10$knhSLwhUqTtxUbDhVcGzTOonu96HPT5uH34UzeFCcm4XhP1jMgJii	sme	Ali Hussain	\N	t	\N	\N	\N	2026-01-30 18:41:16.253	2026-02-03 19:38:58.585	2026-02-03 19:38:58.584	\N
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: chat_attachments chat_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.chat_attachments
    ADD CONSTRAINT chat_attachments_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: introduction_requests introduction_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.introduction_requests
    ADD CONSTRAINT introduction_requests_pkey PRIMARY KEY (id);


--
-- Name: sme_profiles sme_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.sme_profiles
    ADD CONSTRAINT sme_profiles_pkey PRIMARY KEY (id);


--
-- Name: support_messages support_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT support_messages_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_actionType_idx; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE INDEX "audit_logs_actionType_idx" ON public.audit_logs USING btree ("actionType");


--
-- Name: audit_logs_timestamp_idx; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE INDEX audit_logs_timestamp_idx ON public.audit_logs USING btree ("timestamp");


--
-- Name: audit_logs_userId_idx; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE INDEX "audit_logs_userId_idx" ON public.audit_logs USING btree ("userId");


--
-- Name: chat_messages_introductionRequestId_idx; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE INDEX "chat_messages_introductionRequestId_idx" ON public.chat_messages USING btree ("introductionRequestId");


--
-- Name: chat_messages_senderId_idx; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE INDEX "chat_messages_senderId_idx" ON public.chat_messages USING btree ("senderId");


--
-- Name: sme_profiles_userId_key; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE UNIQUE INDEX "sme_profiles_userId_key" ON public.sme_profiles USING btree ("userId");


--
-- Name: support_messages_senderId_idx; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE INDEX "support_messages_senderId_idx" ON public.support_messages USING btree ("senderId");


--
-- Name: support_messages_ticketId_idx; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE INDEX "support_messages_ticketId_idx" ON public.support_messages USING btree ("ticketId");


--
-- Name: support_tickets_status_idx; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE INDEX support_tickets_status_idx ON public.support_tickets USING btree (status);


--
-- Name: support_tickets_userId_idx; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE INDEX "support_tickets_userId_idx" ON public.support_tickets USING btree ("userId");


--
-- Name: user_profiles_userId_key; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE UNIQUE INDEX "user_profiles_userId_key" ON public.user_profiles USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: smeuser
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: audit_logs audit_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: chat_attachments chat_attachments_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.chat_attachments
    ADD CONSTRAINT "chat_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public.chat_messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_introductionRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "chat_messages_introductionRequestId_fkey" FOREIGN KEY ("introductionRequestId") REFERENCES public.introduction_requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "chat_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: introduction_requests introduction_requests_requesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.introduction_requests
    ADD CONSTRAINT "introduction_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: introduction_requests introduction_requests_smeProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.introduction_requests
    ADD CONSTRAINT "introduction_requests_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES public.sme_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sme_profiles sme_profiles_reviewedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.sme_profiles
    ADD CONSTRAINT "sme_profiles_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sme_profiles sme_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.sme_profiles
    ADD CONSTRAINT "sme_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: support_messages support_messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT "support_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: support_messages support_messages_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public.support_tickets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: support_tickets support_tickets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT "support_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smeuser
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: smeuser
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO smeuser;


--
-- PostgreSQL database dump complete
--

\unrestrict Fs4zeMgfS8dgdiVafhJ7DZUPxcYvOOboXxVXuicjScCgH2Xfppb7wDcntYphcTS

