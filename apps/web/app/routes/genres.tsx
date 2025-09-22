import { Music, User, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { Link, useRevalidator } from 'react-router';
import { toast } from 'sonner';

import apiClient from '@/web/lib/api-client';
import { useSession } from '@/web/lib/auth';

import type { Route } from './+types/genres';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Genres - Lyriko' },
    { name: 'description', content: 'Browse all genres' },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const response = await apiClient.genres.$get({
    query: { page: 1, limit: 10 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }

  return response.json();
}

export default function Genres({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;
  const { data: session } = useSession();
  const revalidator = useRevalidator();

  const handleDelete = async (genreId: string, genreName: string) => {
    toast(`Delete "${genreName}"?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const response = await apiClient.genres[':id'].$delete({
              param: { id: genreId },
            });

            if (response.ok) {
              toast.success('Genre deleted successfully');
              revalidator.revalidate();
            } else {
              const errorData = await response.json();
              toast.error(
                errorData.error || 'Failed to delete genre. Please try again.',
              );
            }
          } catch (error) {
            toast.error('An error occurred while deleting the genre.');
          }
        },
      },
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Genres
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Discover your next favorite sound across{' '}
            <span className="text-primary font-semibold">
              {data.pagination.total}
            </span>{' '}
            carefully curated genres
          </p>

          {/* Create Genre Button - Only show for authenticated users */}
          {session?.user && (
            <div className="mt-8">
              <Link
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                to="/genres/create"
              >
                <Plus className="w-5 h-5" />
                Create New Genre
              </Link>
            </div>
          )}
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.genres.map((genre, index) => (
            <div
              className="group relative"
              key={genre.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link className="block" to={`/genres/${genre.slug}`}>
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card hover:border-border hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden group">
                  {/* Gradient Background Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background: genre.color
                        ? `linear-gradient(135deg, ${genre.color}20, ${genre.color}05)`
                        : 'linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--primary)/0.05))',
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {genre.color ? (
                          <div className="relative">
                            <div
                              className="w-6 h-6 rounded-full shadow-lg ring-2 ring-background"
                              style={{ backgroundColor: genre.color }}
                            />
                            <div
                              className="absolute inset-0 w-6 h-6 rounded-full animate-pulse opacity-30"
                              style={{ backgroundColor: genre.color }}
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary/60 shadow-lg ring-2 ring-background" />
                        )}
                      </div>
                      <Music className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors duration-300" />
                    </div>

                    {/* Genre Name */}
                    <h3 className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300 mb-4 leading-tight">
                      {genre.name}
                    </h3>

                    {/* Description */}
                    {genre.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">
                        {genre.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>{genre.creator.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(genre.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Edit and Delete buttons - Only show for authenticated users */}
              {session?.user && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <Link
                    className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                    to={`/genres/${genre.slug}/edit`}
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(genre.id, genre.name);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data.genres.length === 0 && (
          <div className="text-center py-24">
            <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-8">
              <Music className="w-12 h-12 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No genres found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              It looks like there are no genres available right now. Check back
              later for new musical discoveries.
            </p>
            {session?.user && (
              <div className="mt-6">
                <Link
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                  to="/genres/create"
                >
                  <Plus className="w-5 h-5" />
                  Create the First Genre
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
