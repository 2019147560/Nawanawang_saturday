'use client';

import { useRouter } from 'next/navigation';
import { LoginPage } from '../page';

export default function LoginRoutePage() {
  const router = useRouter();

  return (
    <LoginPage
      onBack={() => router.push('/')}
      onSignup={() => router.push('/signup-info')}
    />
  );
}
