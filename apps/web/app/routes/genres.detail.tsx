import { DetailedError, parseResponse } from '@workspace/api-client';
import { ConfirmationDialog } from '@workspace/ui/components/confirmation-dialog';
import { Music, User, Calendar, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { BackNavigation } from '@/web/components/back-navigation';
import apiClient from '@/web/lib/api-client';
import { useSession } from '@/web/lib/auth';

import type { Route } from './+types/genres.detail';

export function meta({ params, loaderData: { data } }: Route.MetaArgs) {
  return [
    { title: `${data.name || params.slug} - Lyriko` },
    {
      name: 'description',
      content: `Explore the ${params.slug} genre and discover amazing music`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  return await parseResponse(
    apiClient.genres[':slug'].$get({
      param: { slug: params.slug },
    }),
  );
}

export default function Genre({ loaderData }: Route.ComponentProps) {
  const { data: genre } = loaderData;
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await parseResponse(
        apiClient.genres[':id'].$delete({
          param: { id: genre.id },
        }),
      );

      navigate('/genres');
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
        return;
      }

      toast.error('An error occurred while deleting the genre.');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <BackNavigation label="Back to Genres" to="/genres" />

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
                  onClick={() => setShowDeleteDialog(true)}
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

      <ConfirmationDialog
        cancelText="Cancel"
        confirmButtonClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        confirmText="Delete"
        description={`Are you sure you want to delete "${genre.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onOpenChange={setShowDeleteDialog}
        open={showDeleteDialog}
        title="Delete Genre"
      />
    </div>
  );
}
