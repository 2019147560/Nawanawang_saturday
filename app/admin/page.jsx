import AdminDashboard from './admin-dashboard';

export const metadata = {
  title: '운영 대시보드 | 나와, 나왕',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
