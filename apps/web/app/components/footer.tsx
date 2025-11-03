import { Github, MessageCircle, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Artists', href: '/artists' },
      { name: 'Albums', href: '/albums' },
      { name: 'Songs', href: '/songs' },
      { name: 'Genres', href: '/genres' },

      { name: 'Search', href: '/search' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
    social: [
      {
        name: 'Twitter',
        href: '#',
        icon: Twitter,
      },
      {
        name: 'GitHub',
        href: '#',
        icon: Github,
      },
      {
        name: 'YouTube',
        href: '#',
        icon: Youtube,
      },
      {
        name: 'Discord',
        href: '#',
        icon: MessageCircle,
      },
    ],
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link className="flex items-center" to="/">
              <span className="text-2xl font-bold text-foreground">Lyriko</span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm max-w-md">
              Discover, explore, and share your favorite music. From artists to
              albums and songs - find everything you love about music in one
              place.
            </p>
            <div className="mt-6 flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  aria-label={item.name}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  href={item.href}
                  key={item.name}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    to={item.href}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <a
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    href={item.href}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Lyriko. All rights reserved.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">
              Made with{' '}
              <span aria-label="love" className="text-destructive">
                ♥
              </span>{' '}
              for music lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
