'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { LoginPage } from '../home-client';

export default function LoginRoutePage() {
  const router = useRouter();

  return (
    <LoginPage
      onBack={() => router.push('/')}
      onGoogleLogin={() => signIn('google', { callbackUrl: '/signup-info?p=google' })}
      onKakaoLogin={() => signIn('kakao', { callbackUrl: '/signup-info?p=kakao' })}
    />
  );
}
