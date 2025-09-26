import { DetailedError, parseResponse } from '@workspace/api-client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/base/tooltip';
import { ConfirmationDialog } from '@workspace/ui/components/confirmation-dialog';
import { Music, Plus, Edit, Trash2, Play, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Link, useRevalidator } from 'react-router';
import { toast } from 'sonner';

import apiClient from '@/web/lib/api-client';
import { useSession } from '@/web/lib/auth';

import type { Route } from './+types/songs.list';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Songs - Lyriko' },
    { name: 'description', content: 'Browse all songs' },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  return await parseResponse(
    apiClient.songs.$get({
      query: { page: 1, limit: 10 },
    }),
  );
}

export default function Songs({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;
  const { data: session } = useSession();
  const revalidator = useRevalidator();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    songId?: string;
    songTitle?: string;
  }>({ open: false });

  const handleDeleteClick = (songId: string, songTitle: string) => {
    setDeleteDialog({ open: true, songId, songTitle });
  };

  const handleDelete = async () => {
    if (!deleteDialog.songId) return;

    try {
      await parseResponse(
        apiClient.songs[':id'].$delete({
          param: { id: deleteDialog.songId },
        }),
      );

      toast.success(`"${deleteDialog.songTitle}" deleted successfully!`);
      revalidator.revalidate();
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred while deleting the song.');
      }
    } finally {
      setDeleteDialog({ open: false });
    }
  };

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Songs</h1>
            <p className="text-muted-foreground text-sm">
              {data.pagination.total} songs available
            </p>
          </div>

          {/* Create Song Button - Only show for authenticated users */}
          {session?.user && (
            <Link
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              to="/songs/create"
            >
              <Plus className="w-4 h-4" />
              Create Song
            </Link>
          )}
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.songs.map((song) => (
            <div className="group relative" key={song.id}>
              <Link className="block" to={`/songs/${song.slug}`}>
                <div className="relative bg-card border border-border rounded-lg p-4 hover:bg-card/80 hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  {/* Song Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate mb-1">
                        {song.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {song.duration && (
                          <span className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            {formatDuration(song.duration)}
                          </span>
                        )}
                        {song.trackNumber && (
                          <span>Track #{song.trackNumber}</span>
                        )}
                        {song.isExplicit && (
                          <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs font-medium">
                            E
                          </span>
                        )}
                        {song.isPublished && (
                          <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium">
                            Published
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lyrics Preview */}
                  {song.lyrics && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-muted-foreground line-clamp-3 cursor-default mb-3">
                          {song.lyrics}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs whitespace-pre-wrap">
                          {song.lyrics}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* External Links */}
                  {(song.spotifyUrl ||
                    song.youtubeUrl ||
                    song.appleMusicUrl) && (
                    <div className="flex gap-2 mt-2">
                      {song.spotifyUrl && (
                        <a
                          className="text-green-600 hover:text-green-700"
                          href={song.spotifyUrl}
                          onClick={(e) => e.stopPropagation()}
                          rel="noopener noreferrer"
                          target="_blank"
                          title="Listen on Spotify"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {song.youtubeUrl && (
                        <a
                          className="text-red-600 hover:text-red-700"
                          href={song.youtubeUrl}
                          onClick={(e) => e.stopPropagation()}
                          rel="noopener noreferrer"
                          target="_blank"
                          title="Watch on YouTube"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {song.appleMusicUrl && (
                        <a
                          className="text-gray-600 hover:text-gray-700"
                          href={song.appleMusicUrl}
                          onClick={(e) => e.stopPropagation()}
                          rel="noopener noreferrer"
                          target="_blank"
                          title="Listen on Apple Music"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span>{song.language || 'Unknown language'}</span>
                      {song.releaseDate && (
                        <span>{new Date(song.releaseDate).getFullYear()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Edit and Delete buttons - Only show for authenticated users */}
              {session?.user && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <Link
                    className="p-1.5 bg-background/90 backdrop-blur-sm border border-border rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    to={`/songs/${song.slug}/edit`}
                  >
                    <Edit className="w-3 h-3" />
                  </Link>
                  <button
                    className="p-1.5 bg-background/90 backdrop-blur-sm border border-border rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(song.id, song.title);
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
        {data.songs.length === 0 && (
          <div className="text-center py-24">
            <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-8">
              <Music className="w-12 h-12 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No songs found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              It looks like there are no songs available right now. Check back
              later for new musical discoveries.
            </p>
            {session?.user && (
              <div className="mt-6">
                <Link
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                  to="/songs/create"
                >
                  <Plus className="w-5 h-5" />
                  Create the First Song
                </Link>
              </div>
            )}
          </div>
        )}

        <ConfirmationDialog
          cancelText="Cancel"
          confirmButtonClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          confirmText="Delete"
          description={`Are you sure you want to delete "${deleteDialog.songTitle}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onOpenChange={(open) => setDeleteDialog({ open })}
          open={deleteDialog.open}
          title="Delete Song"
        />
      </div>
    </div>
  );
}
