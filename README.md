# MDS Rebar Engineering Services — Data Architecture Reference

**Version:** 1.0  
**Last Updated:** 2026-05-12  
**Purpose:** Single source of truth for all data collections powering the MDS website and Directus CMS.  
**Scope:** Public‑facing website, client portal, and internal content management.

---

## About This Document

This reference defines every data collection in the MDS Rebar Engineering Services digital ecosystem. It serves as the authoritative specification for developers, content editors, and stakeholders to understand what each collection stores, why it exists, and how it relates to the rest of the system.

### Guiding Principles

- **No Duplication** — Every piece of content has exactly one home. If information appears in two places, one of them is the canonical source and the other is a reference.
- **Clear Boundaries** — Each collection has a single, well‑defined responsibility. Collections never overlap in purpose even if their names sound similar.
- **Separation of Concerns** — Content (what you say), presentation (how it looks), and configuration (how the system behaves) are stored in distinct collections and groups.
- **Public‑First Design** — All collections are designed to serve public‑facing content first. Internal‑only collections are explicitly noted.

### How to Read This Document

Each collection is defined with:

- **Purpose** — What it stores and why it exists.
- **Contents** — The key fields and data it holds.
- **Relationships** — How it connects to other collections.
- **Examples** — Concrete, real‑world examples relevant to a rebar detailing company.

Groups (shown in **bold**) are organizational containers for navigation within Directus. They hold no data themselves and exist only to group related collections.

### Document Conventions

- **Bold titles** denote group folders in Directus
- `monospace` denotes collection names, field names, or Directus system terms
- *Italics* denote internal notes or editor‑facing comments
- Examples are illustrative, not exhaustive

---

# MDS Rebar Engineering Services — Website Data Architecture

## Overview

This document defines every data collection used to build the public‑facing website for **MDS Rebar Engineering Services**.  
Each collection has a single, non‑overlapping responsibility, ensuring no content is duplicated across the system.  
Groups are used for navigation only and hold no data themselves.

---

## Structure

Physical and organizational makeup of the company.

### branches
Physical office locations. Stores address, geo‑coordinates, phone numbers, email aliases, operating hours, and a cover photo. Each branch can have multiple facilities linked to it. One branch typically serves as the registered headquarters.

### facilities
Individual buildings, floors, workspaces, labs, or yards within a branch. Tracks room numbers, floor plans, capacity, and assigned teams. A single branch may contain many facilities, and a facility belongs to exactly one branch.

### designations
Standardized job titles and role names used across the organization. Each designation includes a title, department tag, seniority level, and a brief role summary. Members are assigned a designation to maintain consistent naming in profiles and org charts.

### teams
Functional or project‑based groups of members. Stores the team name, purpose, team lead reference, member list, and parent department. Teams can be permanent (e.g., “BIM Team”) or temporary (e.g., “Metro Project Task Force”).

---

## Entities

People and groups connected to the company, both internal and external.

### members
Individual employees with full public‑facing profiles. Contains name, professional photo, biography, email, phone, current designation, team membership, assigned branch, and links to social profiles. Does not include login credentials or HR‑sensitive data.

### leaders
A curated subset of members who hold director, founder, or senior management positions. Stores the same base profile fields as members, plus an executive summary, board‑level title, leadership order for display sorting, and a featured flag for homepage or about‑page highlights.

### individuals
External persons who are neither employees nor part of an organization. Used for independent consultants, advisors, freelance inspectors, or subject‑matter experts. Stores name, title, affiliation notes, contact information, and a photo. Never used for internal staff.

### organizations
External companies, institutions, or groups. Covers clients, partners, investors, suppliers, and industry bodies. Contains organization name, logo, website URL, industry classification, relationship type (client / partner / supplier), and a short description. An organization can be linked to multiple projects or testimonials.

---

## Distribution

How the company categorises the markets it serves.

### industries
Top‑level market sectors where rebar detailing services are delivered. Each industry has a name, icon, and descriptive overview. Serves as the broadest classification layer; all sectors and verticals fall under an industry. Examples: “Residential”, “Commercial”, “Infrastructure”.

### sectors
Sub‑categories within an industry that target more specific project types. Each sector belongs to one parent industry and includes a name and short definition. Helps clients filter portfolio projects and relevant services. Examples for Residential: “High‑Rise Towers”, “Villa Complexes”.

### verticals
Niche specialisations that cut across multiple industries and sectors. A vertical is a technical focus area rather than a market segment. Linked to relevant services, projects, and capabilities. Examples: “Precast Concrete”, “Post‑Tensioned Slabs”.

---

## Opportunities

Career‑related openings and collaborative ventures.

### vacancies
Advertised job openings for full‑time, part‑time, or contract roles. Stores job title, department, location, required qualifications, experience range, responsibilities, application deadline, and an active/inactive status flag. Each vacancy links to a designation for title consistency.

### internships
Temporary training positions aimed at students or recent graduates. Contains the same fields as vacancies plus course requirements, stipend details, duration in weeks, mentor assignment, and educational institution eligibility. Separate from vacancies to allow dedicated filtering for early‑career candidates.

### collaborations
Joint ventures, research partnerships, or community initiatives with external organizations. Stores partner names, scope of collaboration, start and end dates, outcomes, and a public‑facing summary. Linked to organizations, projects, or press articles for cross‑referencing.

---

## Engagements

Structured interactions that collect data from visitors or employees.

### surveys
Detailed questionnaires with multiple question types (text, rating, multiple choice). Stores the survey title, description, question set, active dates, target audience, and aggregated results. Results are private by default. Used for client satisfaction feedback and internal employee pulse checks.

### quizzes
Scored question sets with right/wrong answers. Tracks quiz title, passing score, time limit, question bank, and completion count. Used for employee knowledge checks, visitor assessments, or quick educational tools. Results are shown to the participant upon completion.

### polls
Single‑question votes displayed on the website. Stores the poll question, answer options, active duration, and live vote counts. Results can be shown publicly after voting. Used for simple engagement like “Which training day works best?” or “Vote for the next webinar topic”.

### rsvps
Event invitation responses that capture attendee details. Stores the event reference, attendee name, email, phone, number of guests, dietary requirements, and attendance status (attending / declined / maybe). Linked to ceremonies, exhibitions, or webinars. Does not handle payment or ticketing.

---

## Interactions

Unstructured or direct communication from visitors.

### testimonials
Approved client quotes that display on the website. Stores the client name, company, job title, quote text, rating (1‑5 stars), headshot, project reference, and a moderation flag. Only published testimonials are visible publicly. Each links to a client organization and optionally a project.

### responses
Submissions that are not testimonials or enquiries. Covers feedback forms, download‑gated form entries, and general contact pickups. Stores the submitter name, email, message body, submission type tag, timestamp, and a read/unread flag. Used when the visitor intent is not explicitly pre‑sales or support.

### enquiries
Pre‑sales, pricing, or information requests. Stores name, email, phone, company, subject, detailed message, preferred contact method, and an assigned follow‑up owner. Typically routed to the sales or business development team. Tracks response status (pending / replied / closed).

### messages
Real‑time or near‑real‑time messages from live chat widgets or direct contact forms. Stores sender name, email, message text, timestamp, channel (WhatsApp / site chat / SMS), and conversation thread reference. Designed for quick, informal communication rather than structured enquiries.

---

## Content

Core public‑facing website pages and dynamic hero sections.

### pages
Static informational pages with a title, slug, rich‑text body, featured image, SEO metadata, and publishing status. Supports nested parent‑child page hierarchies for services or about sections. Each page can be linked from navigation menus. Examples: “About Us”, “Contact”, “Services Overview”.

### slides
Individual images or videos displayed in carousels or hero sections. Stores the media file, headline text, sub‑headline, call‑to‑action button label, destination URL, display order, and active date range. Slides can be assigned to specific pages or site‑wide sliders. Supports mobile and desktop variants.

---

## Portfolio

Showcase of past and current work for prospective clients.

### projects
Large‑scale client deliverables that demonstrate the company’s capabilities. Stores project name, client reference, location, start/end dates, scope description, key challenges, results, cover image, photo gallery, and service tags. Linked to industries, sectors, and verticals for portfolio filtering. Examples: “BIM & Rebar Detailing – Chennai Metro Phase 2”.

### works
Smaller case studies, internal initiatives, or process improvement showcases. Contains the same base fields as projects but presented as secondary portfolio items. Used when the scope is narrower or the work was done internally rather than for a paying client. Examples: “Automated BBS Generation for Precast Factory”.

---

## Offerings

Products and advantages the company provides to clients and employees.

### services
Individual core services that the company sells to clients. Stores service name, icon, short description, detailed description, order of display, and an active flag. Each service can link to relevant projects, solutions, and capabilities. Examples: “Rebar Detailing”, “BIM Modelling”, “Estimation & BBS”.

### solutions
Pre‑packaged bundles that combine multiple services for a specific client problem. Stores solution name, tagline, description, included services, pricing information, target industry, and a featured flag. Designed to help clients understand packaged offerings without needing to pick individual services. Examples: “Design‑Build Detailing Suite”.

### benefits
Perks and advantages offered to employees. Stores benefit name, category (Health / Financial / Lifestyle / Learning), description, eligibility criteria, icon, and display order. Displayed on the careers page to attract prospective hires and on internal portals. Examples: “Health Insurance”, “Annual Learning Stipend”.

---

## Events

Time‑bound happenings managed through the website.

### appointments
Bookable consultation slots for one‑on‑one or small‑group meetings. Stores the appointment title, host reference, duration, available time slots, booking link or calendar integration, attendee limit, and location (physical or virtual). Used for sales consultations, technical demos, or client check‑ins.

### schedules
Timetables for recurring activities such as training batches, inspection rounds, or team rotations. Stores schedule name, description, start date, end date, recurrence rule, linked course or team references, and list of time‑slotted sessions. Different from appointments because schedules represent a series rather than individual bookings.

### webinars
Online seminars with registration, recording links, and downloadable materials. Stores webinar title, presenter name, date/time, registration URL, recording embed link, slide deck attachment, duration, and topic tags. Attendees can register via linked RSVPs. Examples: “Advancements in Rebar Detailing with Tekla”.

---

## Pipelines

Strategic plans, achievements, and memorable moments.

### roadmaps
Forward‑looking strategic plans that show planned milestones over time. Stores roadmap title, description, timeline start/end, milestone entries with target dates and status, linked strategic goals, and a public‑facing flag. Internal roadmaps can remain private while summary versions are published.

### milestones
Significant company or project achievements with a specific completion date. Stores milestone title, description, date achieved, linked project or initiative, category (Revenue / People / Projects / Awards), icon, and a key metric number (e.g., “500th Project”). Displayed on timelines and company history pages.

### moments
Memorable one‑off events, celebrations, or award ceremonies. Stores moment title, date, description, photo gallery, location, and category (Award / Celebration / Milestone Event / Team Event). More informal and visual than milestones; focused on people and culture. Examples: “Best SME Award 2025”, “Annual Day Team Photo”.

---

## Education

Training and professional development content.

### courses
Structured training programs with defined modules and learning outcomes. Stores course title, category, skill level, duration in weeks, description, syllabus outline, enrolment link, instructor reference, course image, and certification awarded on completion. Designed for both internal employee upskilling and external paid courses.

### certifications
Professional credentials earned by employees or issued by the company upon course completion. Stores certification name, issuing body, credential ID, issue date, expiry date, credential image, and linked employee or course reference. Used to demonstrate team qualifications to clients and verify employee training completion.

### programs
Longer or bundled training initiatives that may contain multiple courses. Stores program name, description, included courses, target audience, start/end dates, coordinator reference, and enrolment status. Different from a solution because programs are educational, not service packages. Examples: “Graduate Engineer Training Program 2026”.

---

## Activities

Company‑led programs and public‑facing events beyond regular operations.

### initiatives
Internal or CSR programs with defined goals, timelines, budgets, and measurable outcomes. Stores initiative name, description, start/end dates, goal statement, progress tracker, photo gallery, partner organization references, and team members involved. Examples: “Rebar Detailing Skill Development for Rural Youth”.

### exhibitions
Trade shows, industry conferences, or expo booths where the company participates. Stores exhibition name, event dates, venue, booth number, participating team members, promotional materials gallery, leads generated count, expense summary, and follow‑up notes. Linked to relevant services, projects, and press coverage.

### ceremonies
Formal events such as award nights, company anniversaries, office inaugurations, and milestone celebrations. Stores ceremony name, date, venue, description, photo gallery, guest list, chief guest information, and linked RSVPs. More formal than moments; often has an attached programme or agenda. Examples: “25th Anniversary Gala Dinner”.

---

## Press

Company news, thought leadership, and editorial content for media and visitors.

### timelines
Year‑by‑year summary of major company achievements presented as a visual timeline. Each entry stores the year, a concise achievement description, an icon or image, and an optional link to a related project, milestone, or press article. Designed for the company history page.

### spotlights
Featured profiles that highlight specific employees, projects, or achievements. Stores spotlight title, subject reference (employee or project), description, cover image, publish date, and display order. Used on the homepage or careers page to showcase company culture and success stories.

### insights
Short, analytical commentary pieces on industry trends, construction technology, or engineering practices. Stores insight title, author reference, short summary (1‑2 paragraphs), publish date, topic tags, estimated read time, and a thumbnail image. More concise than articles; typically 2‑3 minutes of reading.

### articles
Long‑form editorial content, blog posts, and thought‑leadership pieces. Stores article title, author reference, rich‑text body, featured image, publish date, category tags, SEO metadata, and estimated read time. The primary format for in‑depth content marketing, industry education, and company news.

### publications
Formal documents authored by or in partnership with MDS: research papers, whitepapers, e‑books, and journals. Stores publication title, author(s), publication date, publisher or journal name, abstract, download file, DOI or ISBN, and cover image. Distinguished from articles by their formal, often peer‑reviewed nature.

### studies
Technical case studies based on actual project data that analyse challenges, methods, and results. Each study references a completed project, describes the problem, approach, solution, and measurable outcomes. More data‑driven than stories and more project‑specific than articles. Used for technical credibility with engineering clients.

### stories
Narrative success stories told from a client or project perspective in a storytelling format. Stores story title, client reference, project reference, narrative body, featured quote, images, and publish date. More narrative and emotional than studies; focuses on the human impact and client journey rather than technical details.

### notes
Internal editorial notes, drafts, and planning documents visible only to content managers. Stores note title, body, author, created/updated timestamps, linked article or page reference, and a status flag (draft / in review / ready). Never published publicly; serves as the editorial team’s workspace.

---

## Assets

Media files and downloadable resources used across the entire website.

### galleries
Curated collections of images grouped by theme, project, or event for reuse across pages and articles. Stores gallery title, description, cover image, image collection with sort order, photographer credit, and usage rights notes. Linked to projects, events, and articles via relations.

### images
Individual image files with metadata for accessibility and search. Stores file reference, alt‑text, caption, copyright holder, focal point coordinates for responsive cropping, and camera EXIF data. Every image can be reused across multiple contexts without duplication.

### videos
Video files hosted locally or embedded from external platforms. Stores title, description, video file or embed URL, thumbnail image, duration, transcript, and language. Used for project walkthroughs, training content, testimonials, and company overviews.

### audios
Audio clips including podcast episodes, voiceovers, and narration files. Stores title, description, audio file, transcript, duration, episode number (for series), publish date, and speaker reference. Used for technical podcasts, client interview snippets, or accessibility narration.

### documents
PDFs, technical drawings, reports, specifications, and other non‑image files. Stores title, file reference, file type, file size, description, version number, document date, and category tags. Linked to projects, services, regulations, or resources. Examples: “IS 456 Code Reference”, “Project Close‑Out Report”.

### resources
Downloadable marketing and sales collateral intended for prospective clients. Stores resource title, description, file reference, category (Brochure / Whitepaper / Capability Statement), cover image, and a gated flag (requires email to download vs. open access). Examples: “MDS Capability Statement – 2026 Edition”.

---

## Meta

Site‑wide configuration, taxonomy, and reusable reference data.

### navigations
Custom menus that control site structure for header, footer, and sidebar locations. Each navigation item stores a label, URL or internal page reference, parent menu reference, display order, icon, and visibility toggle. Supports nested mega‑menus and contextual sidebars for different sections.

### contacts
Department or role‑based contact details for public display. Stores department name, description, email address, phone number, physical address, office hours, and a contact form receiver reference. Multiple contacts can exist for different functions (Sales, Support, HR, Technical). Not individual employee contacts.

### socials
Social media profile links and communication channel information. Stores platform name, profile URL, icon, display order, and a show/hide toggle. Covers both social networks (LinkedIn, YouTube) and messaging channels (WhatsApp Business, Telegram). Used in the site’s global footer and contact page.

### categories
A general‑purpose taxonomy for tagging any content across the site. Stores category name, slug, description, parent category reference for hierarchies, and an icon. Applied to articles, projects, courses, and other collections via junction tables. Examples: “BIM”, “Rebar Detailing”, “Sustainability”.

### priorities
Standardised urgency or importance levels used across projects, tasks, and content. Stores priority name, numeric level for sorting, colour code, and an optional description explaining when each level should be used. Examples: Low, Medium, High, Critical.

### frequencies
Recurrence patterns for events, reviews, reports, and schedules. Stores frequency name, description, and the interval logic or cron rule. Used by schedules, reports, and subscription settings. Examples: Daily, Weekly, Bi‑Weekly, Monthly, Quarterly, Annually.

### cycles
Named time periods for grouping and filtering data by financial or calendar periods. Stores cycle name, start date, end date, and period type (Quarter / Half‑Year / Fiscal Year / Season). Used for financial reports, goal tracking, and content planning. Examples: “Q1 2026”, “FY 2025‑26”, “Summer 2026”.

### risks
Predefined risk assessment levels used in project documentation and compliance records. Stores risk level name, severity score, colour code, description of impact, and recommended response action. Ensures consistent risk language across all projects and reports. Examples: None, Low, Moderate, High, Critical.

---

## Settings

Global configuration values that control site‑wide behaviour and appearance.

### colors
Brand and UI colour definitions with CSS variable names, hex codes, RGB values, and usage descriptions (primary, accent, background, text). Ensures visual consistency across all components. Changes here propagate site‑wide through the theme engine.

### languages
Languages supported by the website with locale codes, native name, English name, flag icon, and a published flag. Controls available translations across all translatable content. Examples: “en‑IN – English (India)”, “ta – தமிழ்”.

### currencies
Currencies available for displaying project values, service prices, or cost estimates. Stores currency code, symbol, decimal precision, exchange rate (if dynamic), and display format. Not a live forex feed; used for consistent formatting. Examples: INR (₹), USD ($), EUR (€).

### units
Standard units of measurement for length, weight, area, and volume used across project specifications and service descriptions. Stores unit name, abbreviation, unit type category, and conversion factor to a base unit. Examples: Metre (m), Foot (ft), Tonne (t), Square Metre (m²).

### libraries
References to third‑party or internal reusable component libraries, design systems, or code packages. Stores library name, version, description, link to documentation, and usage notes. Helps the development team track dependencies and component sources.

---

## Standards

Technical competencies, processes, and philosophies the company follows.

### capabilities
Specific technical skills and competencies that the company offers or possesses. Each capability includes a name, description, icon, category, proficiency level, and links to related services and projects. Used on the services page and in capability statements. Examples: “3D BIM Modelling”, “Clash Detection”, “Shop Drawing Generation”.

### methodologies
Formal approaches, frameworks, and systematic processes used in project execution. Stores methodology name, description, origin or basis (e.g., Lean, Agile, IPD), key principles, and relevant project examples. Demonstrates structured thinking to prospective clients. Examples: “Lean Detailing Process”, “Integrated Project Delivery”.

### principles
Guiding engineering and design philosophies that underpin the company’s approach to work. Stores principle title, description, icon, order of importance, and a real‑world application example. More philosophical than procedures; communicates why the company works a certain way. Examples: “Design for Constructability”, “Zero‑Waste Detailing”.

### procedures
Step‑by‑step Standard Operating Procedures (SOPs) that document exactly how specific tasks are performed. Stores procedure title, document reference number, version, effective date, step list with checkpoints, responsible role, linked tools and templates, and review cycle. Used for quality assurance, onboarding, and compliance audits. Examples: “SOP‑04: Rebar Detailing Quality Check Process”.

### tools
Software applications, plugins, and technology platforms used in day‑to‑day operations. Stores tool name, vendor, version, description, license type, category, logo, and website link. Linked to capabilities and procedures to show which tools support which skills. Examples: “Autodesk Revit”, “Tekla Structures”, “Bluebeam Revu”.

---

## Compliance

Legal, regulatory, and certification documentation for transparency and governance.

### policies
Internal company policies that govern employee conduct, quality standards, and business operations. Stores policy title, document reference, version, effective date, policy body text, owner department, and review date. Publically visible or internal‑only based on a visibility flag. Examples: “Quality Assurance Policy”, “Data Protection Policy”.

### regulations
External regulatory codes, standards, and statutory requirements the company adheres to. Stores regulation name, issuing body, regulation code, description, applicability region, compliance status, and certificate or reference document. Used in project documentation and pre‑qualification submissions. Examples: “IS 1786:2008”, “ASTM A615”, “Eurocode 2”.

### licenses
Professional certifications, business registrations, and operating licences held by the company. Stores licence name, issuing authority, licence number, issue date, expiry date, scan copy, renewal reminder, and linked regulation or policy. Demonstrates legal and professional standing to clients. Examples: “MSME Registration”, “ISO 9001:2015 Certificate”.

### statements
Public legal documents displayed on the website for transparency and legal protection. Stores statement title, slug, body text, version, effective date, and a mandatory‑acceptance flag (for Terms of Use). Linked in the site footer and during form submissions. Examples: “Privacy Policy”, “Terms & Conditions”, “Non‑Disclosure Agreement”.

---

## Branding

Visual identity, cultural definition, and trust‑building content for public perception.

### identity
Core brand assets that define the company’s visual presence online. Stores the primary logo, alternate logo variants, favicon, default social share image (OG image), brand font stack, and brand style guide document. Changes here affect every page via the global theme. Singleton collection (single record).

### ideologies
Foundational statements that articulate the company’s purpose and direction. Stores vision statement, mission statement, core values list with icons and descriptions, and beliefs about the industry and company’s role. Presented on the About page and in corporate communications.

### culture
Descriptions and visual content that convey the company’s work environment, team dynamics, and values in action. Stores a narrative description of the culture, team photos and videos, employee testimonials, and culture‑related metrics (retention rate, average tenure). Used on the careers page and internal onboarding.

### recognitions
Awards, honours, certifications of merit, and industry accolades received by the company or its employees. Stores recognition title, awarding body, award date, description, award certificate image, category, and linked employees or projects. Builds trust and credibility with prospective clients.

### questions
Frequently Asked Questions organized by topic with clear, concise answers searchable by visitors. Stores the question text, answer body, category tag, display order within category, helpfulness counter, and last‑updated date. Reduces repetitive enquiries and improves SEO for common search terms. Examples: “What file formats do you accept?”, “What is your typical turnaround time?”