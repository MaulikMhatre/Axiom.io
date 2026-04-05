// frontend/app/recruiter/register/page.tsx
import { redirect } from 'next/navigation';

export default function RecruiterRegisterRedirect() {
  redirect('/login');
}
