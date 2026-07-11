# Sightsynch Web Application

This is a Next.js (App Router) + Supabase application.

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in your Supabase project credentials:
   ```bash
   cp .env.example .env.local
   ```
2. Run the migrations on your Supabase project. You can copy the contents of `supabase/migrations/20260711000000_auth_and_features.sql` and run them in the Supabase SQL Editor.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```

## Supabase Database Migrations

The migrations in `supabase/migrations/20260711000000_auth_and_features.sql` will perform the following actions:
- Create a `profiles` table to cache auth user identities.
- Configure triggers to synchronize authentication registrations into profiles.
- Set up RLS (Row Level Security) and CRUD policies on `profiles`.
- Create a `bookmarks` table to cache user-bookmarked articles.
- Create an `article_likes` table to track article likes.
- Create a `subscribers` table for newsletter updates.
- Append a `view_count` column to the existing `articles` table to log views.
