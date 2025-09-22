import { Toaster } from '@workspace/ui/base/sonner';
import { useAtomValue } from 'jotai';
import { Outlet } from 'react-router';

import Footer from '@/web/components/footer';
import Header from '@/web/components/header';
import { themeAtom } from '@/web/store/theme';

function MainLayoutContent() {
  const theme = useAtomValue(themeAtom);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster theme={theme} />
    </div>
  );
}

export default function MainLayout() {
  return <MainLayoutContent />;
}
