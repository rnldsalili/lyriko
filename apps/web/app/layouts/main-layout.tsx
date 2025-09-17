import { Link, Outlet, useLocation } from 'react-router';

import { ProtectedRoute } from '@/web/components/protected-route';
import ThemeToggle from '@/web/components/theme-toggle';

function MainLayoutContent() {
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/home' },
    { name: 'Artists', path: '/artists' },
    { name: 'Albums', path: '/albums' },
    { name: 'Songs', path: '/songs' },
    { name: 'Genres', path: '/genres' },
    { name: 'Playlists', path: '/playlists' },
    { name: 'Search', path: '/search' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link className="text-xl font-bold text-foreground" to="/home">
                Lyriko
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <nav className="flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default function MainLayout() {
  return (
    <ProtectedRoute>
      <MainLayoutContent />
    </ProtectedRoute>
  );
}
