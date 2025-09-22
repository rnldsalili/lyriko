import {
  Music,
  Users,
  Disc,
  Mic,
  Play,
  ArrowRight,
  Star,
  Headphones,
} from 'lucide-react';
import { Link } from 'react-router';

import { useSession } from '@/web/lib/auth';

import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Lyriko - Your Music Universe' },
    {
      name: 'description',
      content:
        'Discover, organize, and explore your music collection with Lyriko - the ultimate lyrics and music management platform',
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              Welcome to the Future of Music
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              Lyriko
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Your comprehensive music universe where every lyric tells a story,
              every artist has a voice, and every genre opens a new world of
              discovery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                to="/genres"
              >
                <Music className="w-5 h-5" />
                Explore Genres
                <ArrowRight className="w-4 h-4" />
              </Link>

              {!session?.user && (
                <Link
                  className="inline-flex items-center gap-2 bg-background border border-border text-foreground px-8 py-4 rounded-full font-semibold hover:bg-accent transition-all duration-300"
                  to="/signup"
                >
                  Get Started Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything Music in One Place
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Organize, discover, and immerse yourself in the world of music
              like never before
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Artists */}
            <Link className="group" to="/artists">
              <div className="bg-card border border-border rounded-2xl p-8 hover:bg-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-64 lg:h-80 flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Artists</h3>
                <p className="text-muted-foreground mb-4 flex-1">
                  Discover talented artists and explore their musical journeys
                </p>
                <div className="flex items-center gap-2 text-primary font-medium mt-auto">
                  Explore Artists
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Albums */}
            <Link className="group" to="/albums">
              <div className="bg-card border border-border rounded-2xl p-8 hover:bg-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-64 lg:h-80 flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Disc className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Albums</h3>
                <p className="text-muted-foreground mb-4 flex-1">
                  Browse through collections of musical masterpieces
                </p>
                <div className="flex items-center gap-2 text-primary font-medium mt-auto">
                  View Albums
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Songs */}
            <Link className="group" to="/songs">
              <div className="bg-card border border-border rounded-2xl p-8 hover:bg-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-64 lg:h-80 flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Songs</h3>
                <p className="text-muted-foreground mb-4 flex-1">
                  Dive into individual tracks and their stories
                </p>
                <div className="flex items-center gap-2 text-primary font-medium mt-auto">
                  Browse Songs
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Genres */}
            <Link className="group" to="/genres">
              <div className="bg-card border border-border rounded-2xl p-8 hover:bg-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-64 lg:h-80 flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Genres</h3>
                <p className="text-muted-foreground mb-4 flex-1">
                  Explore different musical styles and categories
                </p>
                <div className="flex items-center gap-2 text-primary font-medium mt-auto">
                  Discover Genres
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                1000+
              </div>
              <div className="text-muted-foreground">Artists</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Disc className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                5000+
              </div>
              <div className="text-muted-foreground">Albums</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                50K+
              </div>
              <div className="text-muted-foreground">Songs</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                100+
              </div>
              <div className="text-muted-foreground">Genres</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Musical Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of music lovers who have already discovered their
            perfect soundtrack
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session?.user ? (
              <Link
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                to="/genres"
              >
                <Music className="w-5 h-5" />
                Continue Exploring
              </Link>
            ) : (
              <>
                <Link
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  to="/signup"
                >
                  Join Lyriko Today
                </Link>
                <Link
                  className="inline-flex items-center gap-2 bg-background border border-border text-foreground px-8 py-4 rounded-full font-semibold hover:bg-accent transition-all duration-300"
                  to="/login"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
