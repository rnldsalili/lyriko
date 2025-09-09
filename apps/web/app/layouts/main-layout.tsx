import { Link, Outlet, useLocation } from 'react-router';

import ThemeToggle from '@/web/components/theme-toggle';

export default function MainLayout() {
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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                className="text-xl font-bold text-gray-900 dark:text-white"
                to="/home"
              >
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
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
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
