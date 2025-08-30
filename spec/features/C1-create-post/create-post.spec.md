# Feature: Create Post

## User Story

*As an authenticated user I want to create a new post with a title and content so I can share my thoughts and experiences with the Radius community.*

## Problem Statement

Users need a simple and intuitive way to create posts that allows them to contribute to local conversations. The form should be straightforward with clear validation and feedback.

## Scope

* In scope: Simple post creation form with title and content fields, form validation, database storage, user authentication check, success/error handling.
* Out of scope: Rich text editing, image uploads, post categories, post moderation, post editing/deletion.

## Dependencies

* User authentication system.
* Database schema with User and Post models.
* Form validation and error handling.

## UX Notes

* Clean, minimal form design with clear visual hierarchy.
* Form fields should have appropriate character limits displayed.
* Clear validation messages for form errors.
* Success feedback after post creation.
* Form should be responsive and accessible.
* Loading states during form submission.

## Business Rules

* Only authenticated users can create posts.
* Title is required and limited to 255 characters.
* Content is required and limited to 10,000 characters.
* Each post must be associated with a user.
* Posts are created with current timestamp.

## Data Impact

* New Post model in database.
* User-Post relationship (one-to-many).
* Post creation timestamp tracking.

## API/Interface Changes

* `POST /api/posts` — creates a new post.
* `GET /create-post` — serves the post creation form (protected route).

## Authorization & Permissions

* Create post form requires valid authentication session.
* Only authenticated users can access the create post page.
* Users can only create posts for themselves.

## Session Management

* Uses existing HTTP-only cookie session management.
* Verifies user authentication before allowing access to create post form.
* Redirects unauthenticated users to sign-in.

## Observability

* Log post creation attempts and successes.
* Metric: `post.creation_count`.
* Metric: `post.creation_error_count`.

## Acceptance Criteria (Gherkin)

```gherkin
Scenario: Authenticated user creates a post successfully
  Given I am authenticated and on the create post page
  When I fill in the title field with "My First Post"
  And I fill in the content field with "This is the content of my post"
  And I click the "Create Post" button
  Then the post is saved to the database
  And I see a success message
  And I am redirected to the home page

Scenario: User tries to create post without title
  Given I am authenticated and on the create post page
  When I leave the title field empty
  And I fill in the content field with "Some content"
  And I click the "Create Post" button
  Then I see a validation error for the title field
  And the post is not saved

Scenario: User tries to create post without content
  Given I am authenticated and on the create post page
  When I fill in the title field with "My Post"
  And I leave the content field empty
  And I click the "Create Post" button
  Then I see a validation error for the content field
  And the post is not saved

Scenario: User tries to create post with title exceeding character limit
  Given I am authenticated and on the create post page
  When I fill in the title field with more than 255 characters
  And I fill in the content field with "Some content"
  And I click the "Create Post" button
  Then I see a validation error for the title field
  And the post is not saved

Scenario: User tries to create post with content exceeding character limit
  Given I am authenticated and on the create post page
  When I fill in the title field with "My Post"
  And I fill in the content field with more than 10,000 characters
  And I click the "Create Post" button
  Then I see a validation error for the content field
  And the post is not saved

Scenario: Unauthenticated user tries to access create post page
  Given I am not authenticated
  When I try to visit the create post page
  Then I am redirected to the sign-in page
  And I cannot create a post

Scenario: Form displays character limits
  Given I am authenticated and on the create post page
  Then I can see the title field with "255 characters max" indicator
  And I can see the content field with "10,000 characters max" indicator
```

## Test Specification

**Unit Tests**

* Form validation logic for title and content fields.
* Character limit validation.
* Form submission handling.

**Integration Tests**

* Post creation API endpoint functionality.
* Database operations for post creation.
* User authentication middleware.

**E2E Tests**

* Full post creation flow: Form fill → Submit → Success → Redirect.
* Validation error scenarios for empty fields and character limits.
* Authentication check for unauthenticated users.

**Test Data**

* Valid: Authenticated user, valid title (1-255 chars), valid content (1-10,000 chars).
* Invalid: Empty fields, oversized fields, unauthenticated user.

## Database Schema Changes

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(255)
  content   String   @db.Text
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  // ... existing fields ...
  posts     Post[]
}
```

## Rollout Plan

* Deploy database schema changes first.
* Deploy create post form and API endpoint.
* Monitor post creation metrics and error rates.

## Definition of Done

* Create post form renders correctly with title and content fields.
* Form validation works for required fields and character limits.
* Post creation API endpoint functions correctly.
* Database schema includes Post model with User relationship.
* Authentication middleware protects the create post route.
* Success and error states are handled appropriately.
* Form redirects to home page after successful post creation.
* Character limit indicators are displayed on form fields.
* Metrics and logs are active for post creation.
* Documentation matches implementation.
