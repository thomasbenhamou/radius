# Feature: User Sign‑Up

## User Story

*As a visitor I want to sign up using Google, provide my fixed location, and choose a username so I can participate in local conversations within 1 mile of my location.*

## Problem Statement

Users must complete a simple, three‑step sign‑up flow to enter the system with a verified identity, fixed geolocation, and chosen username.

## Scope

* In scope: Google OAuth connection, manual location entry, username selection.
* Out of scope: Multi‑IDP, social login providers other than Google, location change after sign‑up.

## Dependencies

* Google OAuth 2.0 / OIDC integration.
* Database tables for `users` with fields for googleSub, locationLat, locationLon, username, signupCompleted.
* Home page feature (see spec/features/B1-home-page/home-page.spec.md).

## UX Notes

* Step 1: Button labeled **Sign In with Google**. Redirects to Google OAuth, returns profile info (sub, email).
* Step 2: Input fields for `latitude` and `longitude` with validation (later replaced with map picker or geolocation).
* Step 3: Input field for `username` with validation and button labeled **Complete Signup**.
* Progress stepper shows current step and allows navigation between steps.
* After successful signup, user is redirected to the home page (see spec/features/B1-home-page/home-page.spec.md).

## Business Rules

* `username` must be unique (case insensitive), 3–20 characters, alphanumeric + underscore.
* `location_lat` and `location_lon` must be provided once; immutable thereafter.
* Google identity must be unique.

## Data Impact

* Insert into `users`: {id, googleSub, email, username, locationLat, locationLon, signupCompleted, createdAt}.

## API/Interface Changes

* `GET /api/auth/google` — redirect to Google OAuth.
* `GET /api/auth/google/callback` — return session cookie and redirect to signup or home.
* After signup completion, user is redirected to the home page.
* `POST /api/signup/location` — body `{lat, lon}`; store in user record.
* `POST /api/signup/username` — body `{username}`; finalize user.

## Authorization & Permissions

* Step 1 (Google OAuth) requires no prior account (public access).
* Steps 2 & 3 require a valid session cookie from Google login.

## Session Management

* Uses HTTP-only cookies for session management (not JWT).
* Session includes user ID, name, email, image, emailVerified, and signupCompleted status.
* Sessions expire after 24 hours.

## Observability

* Log sign‑up flow steps (google\_connected, location\_saved, username\_chosen).
* Metric: `signup.success_count` and `signup.error_count{step}`.

## Acceptance Criteria (Gherkin)

```gherkin
Scenario: Successful sign‑up
  Given I am a new visitor
  When I click "Sign In with Google" and grant consent
  Then I am authenticated and redirected to signup step 1 (location)
  When I submit latitude and longitude
  Then my location is saved and I proceed to step 2
  When I enter a valid unique username and click "Complete Signup"
  Then my account is created and signup is marked complete
  And I am redirected to the home page

Scenario: Duplicate username
  Given I have completed Google connection and location step
  When I enter a username that already exists
  Then I receive a 409 response with message "Username is already taken"

Scenario: Invalid location coordinates
  Given I have connected with Google
  When I enter invalid latitude or longitude values
  Then I receive a 400 response with appropriate validation message

Scenario: Username format validation
  Given I have completed Google connection and location step
  When I enter a username with invalid format (too short, too long, or invalid characters)
  Then I receive a 400 response with appropriate validation message

Scenario: Returning user with incomplete signup
  Given I have connected with Google but not completed signup
  When I visit the home page
  Then I see a "Signup Incomplete" message
  And I can click "Complete Signup" to continue the flow
```

## Test Specification

**Unit Tests**

* Validate username uniqueness and format.
* Validate lat/lon within valid ranges.

**Integration Tests**

* Google OAuth callback populates `googleSub` and `email`.
* Location API persists `locationLat` and `locationLon`.
* Username API finalizes user row, sets `signupCompleted`, and enforces uniqueness.

**E2E Tests**

* Full flow: Sign In with Google → set location → choose username → home page.
* Error flow: enter duplicate username → error message shown.
* Navigation: home page shows signup status and allows continuing incomplete signup.

**Test Data**

* Valid: lat=48.8566, lon=2.3522, username="localuser1".
* Invalid: username="a" (too short), username="verylongusername123" (too long), username="user-name" (invalid chars), lat=200 (out of range).

## Rollout Plan

* None

## Definition of Done

* All acceptance criteria implemented and working.
* 3-step signup flow functional: Google OAuth → Location → Username.
* Database schema updated with required fields.
* API endpoints implemented and tested.
* Frontend signup page with step navigation.
* Home page shows signup completion status and serves as the destination after successful signup.
* Metrics and logs active.
* Documentation updated to match implementation.
