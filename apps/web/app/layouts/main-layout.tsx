import { Outlet } from 'react-router';

import Footer from '@/web/components/footer';
import Header from '@/web/components/header';

function MainLayoutContent() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function MainLayout() {
  return <MainLayoutContent />;
}
