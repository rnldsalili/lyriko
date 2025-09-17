import { Sheet, SheetContent, SheetTrigger } from '@workspace/ui/base/sheet';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

import ThemeToggle from '@/web/components/theme-toggle';
import { signOut, useSession } from '@/web/lib/auth';

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isLoading } = useSession();

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Artists', path: '/artists' },
    { name: 'Albums', path: '/albums' },
    { name: 'Songs', path: '/songs' },
    { name: 'Genres', path: '/genres' },
    { name: 'Playlists', path: '/playlists' },
    { name: 'Search', path: '/search' },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
              onClick={closeMobileMenu}
              to="/"
            >
              Lyriko
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-1">
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
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {session ? (
                <button
                  className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    to="/login"
                  >
                    Sign in
                  </Link>
                  <Link
                    className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    to="/signup"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet onOpenChange={setIsMobileMenuOpen} open={isMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Open navigation menu"
                  className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6h16M4 12h16M4 18h16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent className="w-[320px] sm:w-[400px] p-0" side="right">
                <div className="flex flex-col h-full">
                  {/* Brand/Logo section */}
                  <div className="flex items-center justify-between p-6 pb-4 border-b border-border/60">
                    <Link
                      className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                      onClick={closeMobileMenu}
                      to="/"
                    >
                      Lyriko
                    </Link>
                  </div>

                  {/* Navigation section */}
                  <div className="flex-1 px-6 py-6">
                    <nav className="flex flex-col space-y-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.path}
                          onClick={closeMobileMenu}
                          to={item.path}
                          className={`group flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            location.pathname === item.path
                              ? 'text-primary bg-primary/10 border border-primary/20 shadow-sm'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/70 hover:border hover:border-accent-foreground/10'
                          }`}
                        >
                          <span className="flex-1">{item.name}</span>
                          {location.pathname === item.path && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Footer section with auth actions */}
                  <div className="p-6 pt-4 border-t border-border/60 bg-muted/20">
                    {session ? (
                      <button
                        className="group flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:border hover:border-destructive/20 transition-all duration-200"
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                      >
                        <svg
                          className="mr-3 h-4 w-4 transition-transform group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                        <span>Sign out</span>
                      </button>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Link
                          className="group flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-all duration-200"
                          onClick={closeMobileMenu}
                          to="/login"
                        >
                          <svg
                            className="mr-3 h-4 w-4 transition-transform group-hover:scale-110"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          <span>Sign in</span>
                        </Link>
                        <Link
                          className="group flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200"
                          onClick={closeMobileMenu}
                          to="/signup"
                        >
                          <svg
                            className="mr-3 h-4 w-4 transition-transform group-hover:scale-110"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          <span>Sign up</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
