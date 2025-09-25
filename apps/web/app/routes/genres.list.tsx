import { DetailedError, parseResponse } from '@workspace/api-client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/base/tooltip';
import { ConfirmationDialog } from '@workspace/ui/components/confirmation-dialog';
import { Music, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useRevalidator } from 'react-router';
import { toast } from 'sonner';

import apiClient from '@/web/lib/api-client';
import { useSession } from '@/web/lib/auth';

import type { Route } from './+types/genres.list';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Genres - Lyriko' },
    { name: 'description', content: 'Browse all genres' },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  return await parseResponse(
    apiClient.genres.$get({
      query: { page: 1, limit: 10 },
    }),
  );
}

export default function Genres({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;
  const { data: session } = useSession();
  const revalidator = useRevalidator();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    genreId?: string;
    genreName?: string;
  }>({ open: false });

  const handleDeleteClick = (genreId: string, genreName: string) => {
    setDeleteDialog({ open: true, genreId, genreName });
  };

  const handleDelete = async () => {
    if (!deleteDialog.genreId) return;

    try {
      await parseResponse(
        apiClient.genres[':id'].$delete({
          param: { id: deleteDialog.genreId },
        }),
      );

      toast.success(`"${deleteDialog.genreName}" deleted successfully!`);
      revalidator.revalidate();
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred while deleting the genre.');
      }
    } finally {
      setDeleteDialog({ open: false });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Genres</h1>
            <p className="text-muted-foreground text-sm">
              {data.pagination.total} genres available
            </p>
          </div>

          {/* Create Genre Button - Only show for authenticated users */}
          {session?.user && (
            <Link
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              to="/genres/create"
            >
              <Plus className="w-4 h-4" />
              Create Genre
            </Link>
          )}
        </div>

        {/* Compact Genre Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {data.genres.map((genre) => (
            <div className="group relative" key={genre.id}>
              <Link className="block" to={`/genres/${genre.slug}`}>
                <div className="relative bg-card border border-border rounded-lg p-4 hover:bg-card/80 hover:border-primary/50 hover:shadow-md transition-all duration-200 h-20 flex flex-col justify-between overflow-hidden">
                  {/* Background gradient effect */}
                  <div
                    className="absolute inset-0 opacity-5 rounded-lg"
                    style={{
                      background: genre.color
                        ? `linear-gradient(135deg, ${genre.color}, ${genre.color}50)`
                        : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.5))',
                    }}
                  />

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Genre Name */}
                    <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                      {genre.name}
                    </h3>

                    {/* Description */}
                    {genre.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs text-muted-foreground cursor-default">
                            <span className="truncate line-clamp-2">
                              {genre.description}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{genre.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </Link>

              {/* Edit and Delete buttons - Only show for authenticated users */}
              {session?.user && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <Link
                    className="p-1.5 bg-background/90 backdrop-blur-sm border border-border rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    to={`/genres/${genre.slug}/edit`}
                  >
                    <Edit className="w-3 h-3" />
                  </Link>
                  <button
                    className="p-1.5 bg-background/90 backdrop-blur-sm border border-border rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(genre.id, genre.name);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
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

        <ConfirmationDialog
          cancelText="Cancel"
          confirmButtonClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          confirmText="Delete"
          description={`Are you sure you want to delete "${deleteDialog.genreName}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onOpenChange={(open) => setDeleteDialog({ open })}
          open={deleteDialog.open}
          title="Delete Genre"
        />
      </div>
    </div>
  );
}
