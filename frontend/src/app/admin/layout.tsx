import type { Metadata } from 'next';
import DashboardWrapper from './dashboard-wrapper';

export const metadata: Metadata = {
  title: 'TAMA Farmers Trust',
  description: 'Leading farmers to prosperity',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
  );
}
