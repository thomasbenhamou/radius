# Radius — Project Overview

Short description: **Radius** is a hyperlocal messaging app where users can post, read, and reply to threads visible only within a **1‑mile radius** of each user’s fixed sign‑up location.

## Goals

* Enable quick, place‑based conversations among nearby users.
* Keep discovery scoped to a strict 1‑mile radius from a user’s registered location.
* Provide simple, low‑friction onboarding via Google sign‑in.

## Non‑Goals / Out of Scope

* Changing a user’s location after sign‑up (admins may do it manually in DB if needed; product‑level flow out of scope).
* Private DMs (not in the first release).
* Moderation automation (basic report/remove only, full system later).

## Personas & Roles

* **Visitor**: unauthenticated user; sees marketing/landing only.
* **Registered User**: can create posts and replies; post creation is available after signup completion.
* **Admin** (internal): moderation and user/content management (basic tools).

## High‑Level Requirements

* **Platforms**: Web app built with **Nuxt** (SSR/SPA as needed).
* **Backend & DB**: Regular **PostgreSQL** (geospatial queries via `earthdistance`/`cube` or `ST_DWithin` if PostGIS later). Simple REST API or Nuxt server routes.
* **Auth**: External IdP — **Google** only (OAuth 2.0 / OpenID Connect). No password flow.
* **Location Model**: User location captured once at sign‑up and stored; post location filtering will be implemented in future iterations.
* **Content Model**: Top‑level **Posts**; **Messages** are replies within a thread under a Post.
* **Radius Rules**: Only display/create interactions with Posts inside **1 mile** of the current user’s fixed location.
* **Assumptions & Constraints**:

  * Timezone handling: store server times in UTC.
  * Soft‑delete content for moderation reversibility.
  * Pagination for feed and thread views.

## Non‑Functional Requirements (NFR)

* **None for now.**

## Tech Stack

* **Frontend**: Nuxt (Vue 3, TypeScript recommended), Pinia for state, Vue Router.
* **Backend**: Nuxt server routes (Nitro) or a separate Node service.
* **Database**: PostgreSQL.
* **Auth**: Google OAuth/OIDC via a Nuxt auth module or custom middleware.
* **Hosting**: TBD.
* **Observability**: Basic request logging; TBD for metrics/traces.

## Data Model (Draft)

> Minimal initial model; may evolve. User location is immutable after sign‑up.

### Entity: `User`

* `id` (string, pk, cuid)
* `google_sub` (string, unique) — stable Google OIDC subject
* `email` (string, unique)
* `name` (string)
* `email_verified` (timestamptz)
* `image` (string)
* `username` (string, unique)
* `location_lat` (float) — fixed at sign‑up
* `location_lon` (float) — fixed at sign‑up
* `signup_completed` (boolean, default false)
* `created_at` (timestamptz)
* `updated_at` (timestamptz)

**Indexes**

* unique(`google_sub`), unique(`email`)

### Entity: `Post`

* `id` (uuid, pk)
* `user_id` (uuid, fk → User.id)
* `title` (string, 140)
* `body` (text)
* `created_at` (timestamptz)
* `is_deleted` (bool, default false)
* `lat` (numeric(9,6)) — location of the post (defaults to author’s fixed location)
* `lon` (numeric(9,6))

**Indexes**

* btree(`created_at`)

### Entity: `Message` (reply within a Post thread)

* `id` (uuid, pk)
* `post_id` (uuid, fk → Post.id)
* `user_id` (uuid, fk → User.id)
* `body` (text)
* `created_at` (timestamptz)
* `is_deleted` (bool, default false)

**Indexes**

* btree(`post_id`, `created_at`)

### Relationships

* `User` 1—N `Post`
* `User` 1—N `Message`
* `Post` 1—N `Message`

## API Surface (Draft)

> Exact shapes finalized per feature files. Example rough outline:

* **Auth**

  * `GET /auth/google/start` → redirect to Google
  * `GET /auth/google/callback` → create session (uses `google_sub`)
  * `POST /auth/logout`

* **Posts** (visible within 1 mile of requester’s fixed location)

  * `GET /posts?cursor=...` — list posts
  * `POST /posts` — create post (server sets `lat/lon` from author’s fixed location unless overridden by policy)
  * `GET /posts/{postId}` — fetch post + message count
  * `DELETE /posts/{postId}` — soft delete (author or admin)

* **Messages**

  * `GET /posts/{postId}/messages?cursor=...` — list messages
  * `POST /posts/{postId}/messages` — add reply
  * `DELETE /messages/{messageId}` — soft delete (author or admin)

## Radius Logic (Informative)

* **Note**: The current implementation focuses on user location at signup rather than post location filtering.
* User location is captured at signup and stored as fixed coordinates.
* Post visibility and radius filtering will be implemented in future iterations.
* Replies (`Message`) inherit visibility from the parent `Post`.
