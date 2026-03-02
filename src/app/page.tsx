/**
 * FILE SUMMARY:
 * Home page that redirects to the dashboard.
 * Path: src/app/page.tsx
 */

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
