import { DetailedError, parseResponse } from '@workspace/api-client';
import { ConfirmationDialog } from '@workspace/ui/components/confirmation-dialog';
import {
  Music,
  User,
  Calendar,
  Edit,
  Trash2,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { BackNavigation } from '@/web/components/back-navigation';
import apiClient from '@/web/lib/api-client';
import { useSession } from '@/web/lib/auth';

import type { Route } from './+types/artists.detail';

export function meta({ params, loaderData: { data } }: Route.MetaArgs) {
  return [
    { title: `${data.name || params.slug} - Lyriko` },
    {
      name: 'description',
      content: `Explore ${params.slug} and discover their music`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  return await parseResponse(
    apiClient.artists[':slug'].$get({
      param: { slug: params.slug },
    }),
  );
}

export default function Artist({ loaderData }: Route.ComponentProps) {
  const { data: artist } = loaderData;
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await parseResponse(
        apiClient.artists[':id'].$delete({
          param: { id: artist.id },
        }),
      );

      toast.success(`"${artist.name}" deleted successfully!`);
      navigate('/artists');
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
        return;
      }

      toast.error('An error occurred while deleting the artist.');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <BackNavigation label="Back to Artists" to="/artists" />

      {/* Header Section */}
      <div className="relative bg-card border border-border rounded-xl p-6 mb-6 overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 opacity-5 rounded-xl bg-gradient-to-r from-primary to-primary/60" />

        <div className="relative z-10">
          {/* Artist Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Artist Image or Placeholder */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center ring-2 ring-background">
                {artist.image ? (
                  <img
                    alt={artist.name}
                    className="w-full h-full object-cover"
                    src={artist.image}
                  />
                ) : (
                  <Music className="w-8 h-8 text-muted-foreground/40" />
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {artist.name}
                </h1>
                <p className="text-muted-foreground">Artist</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  {artist.country && <span>{artist.country}</span>}
                  {artist.debutYear && <span>Since {artist.debutYear}</span>}
                </div>
              </div>
            </div>

            {/* Action buttons for authenticated users */}
            {session?.user && (
              <div className="flex gap-2">
                <Link
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 text-sm rounded-lg hover:bg-primary/90 transition-colors"
                  to={`/artists/${artist.slug}/edit`}
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

          {/* Biography */}
          {artist.bio && (
            <p className="text-muted-foreground leading-relaxed mb-4">
              {artist.bio}
            </p>
          )}

          {/* External Links */}
          {(artist.website || artist.spotifyUrl) && (
            <div className="flex flex-wrap gap-3 mb-4">
              {artist.website && (
                <a
                  className="inline-flex items-center gap-2 bg-muted hover:bg-accent text-foreground px-3 py-1.5 text-sm rounded-lg transition-colors"
                  href={artist.website}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Globe className="w-3 h-3" />
                  Official Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {artist.spotifyUrl && (
                <a
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-sm rounded-lg transition-colors"
                  href={artist.spotifyUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Music className="w-3 h-3" />
                  Listen on Spotify
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
              <span className="font-medium">{artist.creator.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {new Date(artist.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Updated</span>
              <span className="font-medium">
                {new Date(artist.updatedAt).toLocaleDateString()}
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
              Explore {artist.name}
            </h2>
            <p className="text-muted-foreground mb-6">
              Discover albums and songs by {artist.name}.
            </p>

            {/* Placeholder for songs/albums */}
            <div className="text-center py-8 bg-muted/20 rounded-lg flex-1 flex flex-col justify-center">
              <Music className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-1">Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Albums and songs will be displayed here
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
                  {artist.slug}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">ID</p>
                <p className="font-mono bg-muted/50 px-2 py-1 rounded text-xs">
                  {artist.id}
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
                  to="/artists/create"
                >
                  Create New Artist
                </Link>
              )}
              <Link
                className="block w-full text-center bg-muted hover:bg-accent text-foreground py-2 px-3 text-sm rounded-lg transition-colors"
                to="/artists"
              >
                Browse All Artists
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        cancelText="Cancel"
        confirmButtonClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        confirmText="Delete"
        description={`Are you sure you want to delete "${artist.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onOpenChange={setShowDeleteDialog}
        open={showDeleteDialog}
        title="Delete Artist"
      />
    </div>
  );
}
