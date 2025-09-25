import { DetailedError, parseResponse } from '@workspace/api-client';
import { ALBUM_TYPE_LABELS } from '@workspace/constants/album';
import { ConfirmationDialog } from '@workspace/ui/components/confirmation-dialog';
import { Calendar, Disc, Edit, Music, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { BackNavigation } from '@/web/components/back-navigation';
import apiClient from '@/web/lib/api-client';
import { useSession } from '@/web/lib/auth';

import type { Route } from './+types/albums.detail';
import type { AlbumType } from '@workspace/constants/album';

export function meta({ params, loaderData: { data } }: Route.MetaArgs) {
  return [
    { title: `${data.title || params.slug} - Lyriko` },
    {
      name: 'description',
      content: `Explore the ${params.slug} album and discover amazing music`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  return await parseResponse(
    apiClient.albums[':slug'].$get({
      param: { slug: params.slug },
    }),
  );
}

export default function AlbumDetail({ loaderData }: Route.ComponentProps) {
  const { data: album } = loaderData;
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await parseResponse(
        apiClient.albums[':id'].$delete({
          param: { id: album.id },
        }),
      );

      toast.success(`"${album.title}" deleted successfully!`);
      navigate('/albums');
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
        return;
      }

      toast.error('An error occurred while deleting the album.');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const formatReleaseDate = (releaseDate: string | null) => {
    if (!releaseDate) return null;
    try {
      return new Date(releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <BackNavigation label="Back to Albums" to="/albums" />

        {/* Album Header */}
        <div className="relative bg-card border border-border rounded-xl p-6 mb-6 overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 opacity-5 rounded-xl bg-gradient-to-r from-primary to-primary/60" />

          <div className="relative z-10">
            <div className="flex items-start gap-6 mb-6">
              {/* Album Cover */}
              <div className="flex-shrink-0">
                {album.coverImage ? (
                  <img
                    alt={`${album.title} cover`}
                    className="w-32 h-32 rounded-lg object-cover shadow-lg ring-2 ring-background"
                    src={album.coverImage}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const fallback = img.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-32 h-32 bg-gradient-to-r from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-background ${album.coverImage ? 'hidden' : 'flex'}`}
                  style={{ display: album.coverImage ? 'none' : 'flex' }}
                >
                  <Disc className="w-16 h-16 text-primary-foreground" />
                </div>
              </div>

              {/* Album Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2 break-words">
                      {album.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                        <Music className="w-3 h-3" />
                        {ALBUM_TYPE_LABELS[album.albumType as AlbumType] ||
                          album.albumType}
                      </span>
                      {album.totalTracks && (
                        <span className="text-sm">
                          {album.totalTracks} track
                          {album.totalTracks !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons - Only show for authenticated users */}
                  {session?.user && (
                    <div className="flex gap-2">
                      <Link
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        to={`/albums/${album.slug}/edit`}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Album Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {formatReleaseDate(album.releaseDate) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Released {formatReleaseDate(album.releaseDate)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Created by {album.creator.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Album Description */}
            {album.description && (
              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  About this Album
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {album.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Placeholder for future track listing */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Track Listing
          </h2>
          <div className="text-center py-8">
            <Music className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Track listing will be available when songs are added to this
              album.
            </p>
          </div>
        </div>

        <ConfirmationDialog
          cancelText="Cancel"
          confirmButtonClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          confirmText="Delete"
          description={`Are you sure you want to delete "${album.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onOpenChange={setShowDeleteDialog}
          open={showDeleteDialog}
          title="Delete Album"
        />
      </div>
    </div>
  );
}
