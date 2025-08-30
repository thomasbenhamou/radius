# Radius App

A Nuxt 4 application with PostgreSQL (PostGIS), Google authentication, and Vuetify UI.

## Features

- **Nuxt 4** - Modern Vue.js framework
- **PostgreSQL** - Database with PostGIS extension for geospatial data
- **Google OAuth** - User authentication via Google
- **Vuetify 3** - Material Design component library
- **Prisma** - Type-safe database ORM

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Google OAuth credentials

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your actual values:
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from Google Cloud Console
   - `AUTH_SECRET` - generate a random string
   - `DATABASE_URL` - will be set automatically when using Docker

3. **Start PostgreSQL with PostGIS:**
   ```bash
   docker-compose up -d
   ```

4. **Set up the database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set authorized redirect URIs to `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

## Database Schema

The app includes basic authentication models:
- `User` - User accounts
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

## Development

- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Database Studio:** `npx prisma studio`

## Project Structure

```
app/
├── prisma/          # Database schema and migrations
├── server/          # Server-side API routes
├── pages/           # Application pages
├── components/      # Vue components
├── public/          # Static assets
└── nuxt.config.ts   # Nuxt configuration
```
