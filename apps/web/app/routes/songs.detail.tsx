import { DetailedError, parseResponse } from '@workspace/api-client';
import { ConfirmationDialog } from '@workspace/ui/components/confirmation-dialog';
import {
  Music,
  User,
  Calendar,
  Edit,
  Trash2,
  ExternalLink,
  Play,
  Clock,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { BackNavigation } from '@/web/components/back-navigation';
import apiClient from '@/web/lib/api-client';
import { useSession } from '@/web/lib/auth';

import type { Route } from './+types/songs.detail';

export function meta({ params, loaderData: { data } }: Route.MetaArgs) {
  return [
    { title: `${data.title || params.slug} - Lyriko` },
    {
      name: 'description',
      content: `Listen to ${params.slug} and explore the lyrics`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  return await parseResponse(
    apiClient.songs[':slug'].$get({
      param: { slug: params.slug },
    }),
  );
}

export default function Song({ loaderData }: Route.ComponentProps) {
  const { data: song } = loaderData;
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await parseResponse(
        apiClient.songs[':id'].$delete({
          param: { id: song.id },
        }),
      );

      toast.success(`"${song.title}" deleted successfully!`);
      navigate('/songs');
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
        return;
      }

      toast.error('An error occurred while deleting the song.');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <BackNavigation label="Back to Songs" to="/songs" />

      {/* Header Section */}
      <div className="relative bg-card border border-border rounded-xl p-6 mb-6 overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 opacity-5 rounded-xl bg-gradient-to-r from-primary to-primary/60" />

        <div className="relative z-10">
          {/* Song Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-muted/20 flex items-center justify-center ring-2 ring-background">
                <Music className="w-8 h-8 text-muted-foreground/40" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {song.title}
                </h1>
                <p className="text-muted-foreground">Song</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  {song.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(song.duration)}
                    </span>
                  )}
                  {song.trackNumber && <span>Track #{song.trackNumber}</span>}
                  {song.language && <span>{song.language}</span>}
                  {song.isExplicit && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                      Explicit
                    </span>
                  )}
                  {song.isPublished && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Published
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons for authenticated users */}
            {session?.user && (
              <div className="flex gap-2">
                <Link
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 text-sm rounded-lg hover:bg-primary/90 transition-colors"
                  to={`/songs/${song.slug}/edit`}
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

          {/* External Links */}
          {(song.spotifyUrl || song.youtubeUrl || song.appleMusicUrl) && (
            <div className="flex flex-wrap gap-3 mb-4">
              {song.spotifyUrl && (
                <a
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-sm rounded-lg transition-colors"
                  href={song.spotifyUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Play className="w-3 h-3" />
                  Listen on Spotify
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {song.youtubeUrl && (
                <a
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm rounded-lg transition-colors"
                  href={song.youtubeUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Play className="w-3 h-3" />
                  Watch on YouTube
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {song.appleMusicUrl && (
                <a
                  className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 text-sm rounded-lg transition-colors"
                  href={song.appleMusicUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Play className="w-3 h-3" />
                  Listen on Apple Music
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 pt-4 border-t border-border/50 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created by</span>
              <span className="font-medium">{song.creator.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {new Date(song.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Updated</span>
              <span className="font-medium">
                {new Date(song.updatedAt).toLocaleDateString()}
              </span>
            </div>

            {song.releaseDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Released</span>
                <span className="font-medium">
                  {new Date(song.releaseDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content area - Lyrics */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Lyrics
            </h2>

            {song.lyrics ? (
              <div className="flex-1">
                <pre className="whitespace-pre-wrap text-muted-foreground leading-relaxed font-sans">
                  {song.lyrics}
                </pre>

                {song.lyricsSource && (
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Lyrics source: {song.lyricsSource}
                    </p>
                    {song.lyricsVerified && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Verified lyrics
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/20 rounded-lg flex-1 flex flex-col justify-center">
                <Music className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-1">
                  No lyrics available
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lyrics for this song haven&apos;t been added yet
                </p>
              </div>
            )}
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
                  {song.slug}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">ID</p>
                <p className="font-mono bg-muted/50 px-2 py-1 rounded text-xs">
                  {song.id}
                </p>
              </div>
              {song.viewCount !== undefined && (
                <div>
                  <p className="text-muted-foreground">Views</p>
                  <p className="font-medium">
                    {song.viewCount.toLocaleString()}
                  </p>
                </div>
              )}
              {song.favoriteCount !== undefined && (
                <div>
                  <p className="text-muted-foreground">Favorites</p>
                  <p className="font-medium">
                    {song.favoriteCount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3">Actions</h3>
            <div className="space-y-2">
              {session?.user && (
                <Link
                  className="block w-full text-center bg-primary text-primary-foreground py-2 px-3 text-sm rounded-lg hover:bg-primary/90 transition-colors"
                  to="/songs/create"
                >
                  Create New Song
                </Link>
              )}
              <Link
                className="block w-full text-center bg-muted hover:bg-accent text-foreground py-2 px-3 text-sm rounded-lg transition-colors"
                to="/songs"
              >
                Browse All Songs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        cancelText="Cancel"
        confirmButtonClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        confirmText="Delete"
        description={`Are you sure you want to delete "${song.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onOpenChange={setShowDeleteDialog}
        open={showDeleteDialog}
        title="Delete Song"
      />
    </div>
  );
}
