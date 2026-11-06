import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { getAccountKey, isAdminUser } from '../../lib/admin';
import AdminDashboard from './admin-dashboard';
import AdminGate from './admin-gate';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '운영 대시보드 | 나와, 나왕',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;

  if (!user) {
    return <AdminGate state="signed-out" />;
  }

  if (!isAdminUser(user)) {
    return (
      <AdminGate
        state="forbidden"
        email={user.email || ''}
        accountKey={getAccountKey(user) || ''}
      />
    );
  }

  return <AdminDashboard />;
}
