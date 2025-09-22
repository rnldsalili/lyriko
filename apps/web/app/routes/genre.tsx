import { Music, User, Calendar, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import apiClient from '@/web/lib/api-client';
import { useSession } from '@/web/lib/auth';

import type { Route } from './+types/genre';
export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `${params.slug} - Lyriko` },
    {
      name: 'description',
      content: `Explore the ${params.slug} genre and discover amazing music`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  // For now, we'll need to find the genre by slug from the genres list
  // This is a temporary solution until we have a slug-based API endpoint
  const genresResponse = await apiClient.genres.$get({
    query: { page: 1, limit: 100 }, // Get a large list to find the genre
  });

  if (!genresResponse.ok) {
    throw new Error('Failed to fetch genres');
  }

  const genresData = await genresResponse.json();
  const genre = genresData.data.genres.find((g) => g.slug === params.slug);

  if (!genre) {
    throw new Response('Genre not found', { status: 404 });
  }

  // Fetch the full genre details using the ID
  const genreResponse = await apiClient.genres[':id'].$get({
    param: { id: genre.id },
  });

  if (!genreResponse.ok) {
    throw new Error('Failed to fetch genre details');
  }

  return genreResponse.json();
}

export default function Genre({ loaderData }: Route.ComponentProps) {
  const { data: genre } = loaderData;
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${genre.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const response = await apiClient.genres[':id'].$delete({
        param: { id: genre.id },
      });

      if (response.ok) {
        // Navigate to genres list after successful deletion
        navigate('/genres');
      } else {
        alert('Failed to delete genre. Please try again.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('An error occurred while deleting the genre.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          to="/genres"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Genres
        </Link>
      </div>

      {/* Header Section */}
      <div className="relative bg-card border border-border rounded-xl p-6 mb-6 overflow-hidden">
        {/* Background gradient effect */}
        <div
          className="absolute inset-0 opacity-5 rounded-xl"
          style={{
            background: genre.color
              ? `linear-gradient(135deg, ${genre.color}, ${genre.color}50)`
              : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.5))',
          }}
        />

        <div className="relative z-10">
          {/* Genre Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Color indicator */}
              {genre.color ? (
                <div
                  className="w-12 h-12 rounded-lg shadow-md ring-2 ring-background"
                  style={{ backgroundColor: genre.color }}
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-primary/60 shadow-md ring-2 ring-background" />
              )}

              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {genre.name}
                </h1>
                <p className="text-muted-foreground">Musical Genre</p>
              </div>
            </div>

            {/* Action buttons for authenticated users */}
            {session?.user && (
              <div className="flex gap-2">
                <Link
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 text-sm rounded-lg hover:bg-primary/90 transition-colors"
                  to={`/genres/${genre.slug}/edit`}
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Link>
                <button
                  className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1.5 text-sm rounded-lg hover:bg-destructive/90 transition-colors"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          {genre.description && (
            <p className="text-muted-foreground leading-relaxed mb-4">
              {genre.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 pt-4 border-t border-border/50 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created by</span>
              <span className="font-medium">{genre.creator.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {new Date(genre.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Updated</span>
              <span className="font-medium">
                {new Date(genre.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Explore {genre.name}
            </h2>
            <p className="text-muted-foreground mb-6">
              Discover artists, albums, and songs in the {genre.name} genre.
            </p>

            {/* Placeholder for songs/albums */}
            <div className="text-center py-8 bg-muted/20 rounded-lg flex-1 flex flex-col justify-center">
              <Music className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-1">Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Related content will be displayed here
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3">Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Slug</p>
                <p className="font-mono bg-muted/50 px-2 py-1 rounded text-xs">
                  {genre.slug}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">ID</p>
                <p className="font-mono bg-muted/50 px-2 py-1 rounded text-xs">
                  {genre.id}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3">Actions</h3>
            <div className="space-y-2">
              {session?.user && (
                <Link
                  className="block w-full text-center bg-primary text-primary-foreground py-2 px-3 text-sm rounded-lg hover:bg-primary/90 transition-colors"
                  to="/genres/create"
                >
                  Create New Genre
                </Link>
              )}
              <Link
                className="block w-full text-center bg-muted hover:bg-accent text-foreground py-2 px-3 text-sm rounded-lg transition-colors"
                to="/genres"
              >
                Browse All Genres
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
