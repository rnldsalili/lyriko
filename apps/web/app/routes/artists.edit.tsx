import { DetailedError, parseResponse } from '@workspace/api-client';
import { Save, Music } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { ArtistForm, type ArtistFormData } from '@/web/artists/artist-form';
import { BackNavigation } from '@/web/components/back-navigation';
import { ProtectedRoute } from '@/web/components/protected-route';
import apiClient from '@/web/lib/api-client';

import type { Route } from './+types/artists.edit';

export function meta({ params, loaderData: { data } }: Route.MetaArgs) {
  return [
    { title: `Edit ${data.name || params.slug} - Lyriko` },
    {
      name: 'description',
      content: `Edit ${params.slug} artist details`,
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

export default function EditArtist({ loaderData }: Route.ComponentProps) {
  const { data: artist } = loaderData;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ArtistFormData) => {
    setIsSubmitting(true);
    try {
      const result = await parseResponse(
        apiClient.artists[':slug'].$put({
          param: { slug: artist.slug },
          json: {
            name: values.name.trim(),
            bio: values.bio?.trim() || undefined,
            image: values.image?.trim() || undefined,
            website: values.website?.trim() || undefined,
            spotifyUrl: values.spotifyUrl?.trim() || undefined,
            country: values.country?.trim() || undefined,
            debutYear: values.debutYear
              ? parseInt(values.debutYear, 10)
              : undefined,
          },
        }),
      );

      toast.success('Artist updated successfully!');
      // Navigate to the updated artist page
      navigate(`/artists/${result.data.slug}`);
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
        return;
      }

      toast.error('An error occurred while updating the artist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <BackNavigation
          label={`Back to ${artist.name}`}
          to={`/artists/${artist.slug}`}
        />

        {/* Page Header */}
        <div className="relative bg-card border border-border rounded-xl p-6 mb-6 overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 opacity-5 rounded-xl bg-gradient-to-r from-primary to-primary/60" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              {/* Artist Image or Placeholder */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center ring-2 ring-background">
                {artist.image ? (
                  <img
                    alt={artist.name}
                    className="w-full h-full object-cover"
                    src={artist.image}
                  />
                ) : (
                  <Music className="w-6 h-6 text-muted-foreground/40" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Edit {artist.name}
                </h1>
                <p className="text-muted-foreground">Update artist details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reusable Form Component */}
        <ArtistForm
          cancelButtonText="Cancel"
          cancelTo={`/artists/${artist.slug}`}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitButtonIcon={<Save className="w-4 h-4" />}
          submitButtonText="Save Changes"
          defaultValues={{
            name: artist.name,
            bio: artist.bio || '',
            image: artist.image || '',
            website: artist.website || '',
            spotifyUrl: artist.spotifyUrl || '',
            country: artist.country || '',
            debutYear: artist.debutYear ? artist.debutYear.toString() : '',
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
