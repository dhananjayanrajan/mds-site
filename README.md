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