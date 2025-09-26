import { DetailedError, parseResponse } from '@workspace/api-client';
import { Save, Music } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { BackNavigation } from '@/web/components/back-navigation';
import { ProtectedRoute } from '@/web/components/protected-route';
import apiClient from '@/web/lib/api-client';
import { SongForm, type SongFormData } from '@/web/songs/song-form';

import type { Route } from './+types/songs.edit';

export function meta({ params, loaderData: { data } }: Route.MetaArgs) {
  return [
    { title: `Edit ${data.title || params.slug} - Lyriko` },
    {
      name: 'description',
      content: `Edit ${params.slug} song details`,
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

export default function EditSong({ loaderData }: Route.ComponentProps) {
  const { data: song } = loaderData;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: SongFormData) => {
    setIsSubmitting(true);
    try {
      // Convert form data to API format
      const songData = {
        title: values.title.trim(),
        lyrics: values.lyrics.trim(),
        duration: values.duration ? parseInt(values.duration, 10) : undefined,
        trackNumber: values.trackNumber
          ? parseInt(values.trackNumber, 10)
          : undefined,
        albumId: values.albumId?.trim() || undefined,
        releaseDate: values.releaseDate
          ? new Date(values.releaseDate).toISOString()
          : undefined,
        language: values.language?.trim() || undefined,
        isExplicit: values.isExplicit,
        isPublished: values.isPublished,
        lyricsSource: values.lyricsSource?.trim() || undefined,
        spotifyUrl: values.spotifyUrl?.trim() || undefined,
        youtubeUrl: values.youtubeUrl?.trim() || undefined,
        appleMusicUrl: values.appleMusicUrl?.trim() || undefined,
      };

      const result = await parseResponse(
        apiClient.songs[':slug'].$put({
          param: { slug: song.slug },
          json: songData,
        }),
      );

      toast.success('Song updated successfully!');
      // Navigate to the updated song page
      navigate(`/songs/${result.data.slug}`);
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
        return;
      }

      toast.error('An error occurred while updating the song.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <BackNavigation
          label={`Back to ${song.title}`}
          to={`/songs/${song.slug}`}
        />

        {/* Page Header */}
        <div className="relative bg-card border border-border rounded-xl p-6 mb-6 overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 opacity-5 rounded-xl bg-gradient-to-r from-primary to-primary/60" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-muted/20 flex items-center justify-center ring-2 ring-background">
                <Music className="w-6 h-6 text-muted-foreground/40" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Edit {song.title}
                </h1>
                <p className="text-muted-foreground">Update song details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reusable Form Component */}
        <SongForm
          cancelButtonText="Cancel"
          cancelTo={`/songs/${song.slug}`}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitButtonIcon={<Save className="w-4 h-4" />}
          submitButtonText="Save Changes"
          defaultValues={{
            title: song.title,
            lyrics: song.lyrics,
            duration: song.duration ? song.duration.toString() : '',
            trackNumber: song.trackNumber ? song.trackNumber.toString() : '',
            albumId: song.albumId || '',
            releaseDate: song.releaseDate ? song.releaseDate.split('T')[0] : '',
            language: song.language || '',
            isExplicit: song.isExplicit,
            isPublished: song.isPublished,
            lyricsSource: song.lyricsSource || '',
            spotifyUrl: song.spotifyUrl || '',
            youtubeUrl: song.youtubeUrl || '',
            appleMusicUrl: song.appleMusicUrl || '',
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
