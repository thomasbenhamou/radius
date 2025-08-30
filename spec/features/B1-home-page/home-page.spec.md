# Feature: Home Page

## User Story

*As a signed-in user I want to see a simple home page with a button to create a post so I can easily start participating in local conversations.*

## Problem Statement

Users need a landing page that shows either the home page (for authenticated users) or the sign-up screen (for unauthenticated users), providing a seamless experience regardless of authentication status.

## Scope

* In scope: Simple home page layout for authenticated users, post creation button, sign-up screen for unauthenticated users, conditional rendering based on authentication status.
* Out of scope: Post listing, user profile management, complex navigation menus.

## Dependencies

* User authentication and signup completion.
* Post creation feature (see spec/features/C1-create-post/create-post.spec.md).

## UX Notes

* Clean, minimal design with clear visual hierarchy.
* For authenticated users: Prominent "Create Post" button that stands out, simple welcome message.
* For unauthenticated users: Display sign-up screen with Google OAuth button.
* Conditional rendering based on authentication status.
* Button redirects to post creation page/feature.

## Business Rules

* Home page content visible to authenticated users with completed signup.
* Sign-up screen visible to unauthenticated users.
* Post creation button should be the primary call-to-action for authenticated users.

## Data Impact

* No new data storage required.
* Reads user session data to verify authentication status.

## API/Interface Changes

* `GET /` — serves the landing page with conditional content based on authentication status.
* For authenticated users: displays home page with post creation button.
* For unauthenticated users: displays sign-up screen.
* Post creation button links to `/create-post` page.

## Authorization & Permissions

* Landing page accessible to all users.
* Home page content requires valid session cookie from completed signup.
* Sign-up screen visible to unauthenticated users.

## Session Management

* Uses existing HTTP-only cookie session management.
* Verifies `signupCompleted` status to determine which content to display.
* No session required to access the landing page.

## Observability

* Log home page visits.
* Metric: `home_page.visit_count`.

## Acceptance Criteria (Gherkin)

```gherkin
Scenario: Authenticated user visits landing page
  Given I have completed signup and am authenticated
  When I visit the landing page
  Then I see the home page content
  And I see a welcome message
  And I see a prominent "Create Post" button
  And I can click the button to navigate to post creation

Scenario: Unauthenticated user visits landing page
  Given I am not authenticated
  When I visit the landing page
  Then I see the sign-up screen
  And I can click "Sign In with Google" to begin signup

Scenario: User with incomplete signup visits landing page
  Given I have connected with Google but not completed signup
  When I visit the landing page
  Then I see the sign-up screen
  And I can continue completing the signup flow

Scenario: Create Post button functionality
  Given I am on the home page and authenticated
  When I click "Create Post"
  Then I am redirected to the create post page
```

## Test Specification

**Unit Tests**

* Verify home page component renders correctly.
* Verify authentication middleware works properly.

**Integration Tests**

* Landing page serves appropriate content based on authentication status.
* Home page content displays for authenticated users.
* Sign-up screen displays for unauthenticated users.

**E2E Tests**

* Full flow: Signup → Home page → Create Post button → Create post page.
* Authentication flow: Unauthenticated user → sees sign-up screen.
* Incomplete signup flow: Partial signup → sees sign-up screen to continue.

**Test Data**

* Valid: Authenticated user with `signupCompleted: true`.
* Invalid: No session, incomplete signup session.

## Rollout Plan

* None

## Definition of Done

* Landing page renders correctly with conditional content based on authentication status.
* Home page content displays for authenticated users with "Create Post" button.
* Sign-up screen displays for unauthenticated users.
* Authentication middleware properly determines which content to show.
* Users with incomplete signup see the sign-up screen to continue.
* Button navigation to post creation feature works.
* Metrics and logs active.
* Documentation updated to match implementation.
