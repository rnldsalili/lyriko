import { DetailedError, parseResponse } from '@workspace/api-client';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { AlbumForm, type AlbumFormData } from '@/web/albums/album-form';
import { BackNavigation } from '@/web/components/back-navigation';
import { ProtectedRoute } from '@/web/components/protected-route';
import apiClient from '@/web/lib/api-client';

import type { Route } from './+types/albums.edit';

export function meta({ params, loaderData: { data } }: Route.MetaArgs) {
  return [
    { title: `Edit ${data.title || params.slug} - Lyriko` },
    {
      name: 'description',
      content: `Edit album information for ${params.slug}`,
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

export default function EditAlbum({ loaderData }: Route.ComponentProps) {
  const { data: album } = loaderData;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: AlbumFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare the data for submission
      const albumData = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        coverImage: values.coverImage?.trim() || undefined,
        releaseDate: values.releaseDate?.toISOString() || undefined,
        albumType: values.albumType,
        totalTracks: values.totalTracks || undefined,
      };

      const result = await parseResponse(
        apiClient.albums[':slug'].$put({
          param: { slug: album.slug },
          json: albumData,
        }),
      );

      toast.success('Album updated successfully!');
      // Navigate to the updated album page
      navigate(`/albums/${result.data.slug}`);
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
        return;
      }

      toast.error('An error occurred while updating the album.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare default values for the form
  const defaultValues: Partial<AlbumFormData> = {
    title: album.title,
    description: album.description || '',
    coverImage: album.coverImage || '',
    releaseDate: album.releaseDate ? new Date(album.releaseDate) : undefined,
    albumType: album.albumType,
    totalTracks: album.totalTracks || undefined,
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <BackNavigation
          label={`Back to ${album.title}`}
          to={`/albums/${album.slug}`}
        />

        {/* Page Header */}
        <div className="relative bg-card border border-border rounded-xl p-6 mb-6 overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 opacity-5 rounded-xl bg-gradient-to-r from-primary to-primary/60" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-md ring-2 ring-background">
                <Edit className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Edit Album
                </h1>
                <p className="text-muted-foreground">
                  Update &quot;{album.title}&quot; information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reusable Form Component */}
        <AlbumForm
          cancelButtonText="Cancel"
          cancelTo={`/albums/${album.slug}`}
          defaultValues={defaultValues}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitButtonIcon={<Edit className="w-4 h-4" />}
          submitButtonText="Update Album"
        />
      </div>
    </ProtectedRoute>
  );
}
