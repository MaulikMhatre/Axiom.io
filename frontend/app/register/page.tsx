// frontend/app/register/page.tsx
// Redirects to the unified auth page
import { redirect } from 'next/navigation';

export default function RegisterRedirect() {
  redirect('/login');
}