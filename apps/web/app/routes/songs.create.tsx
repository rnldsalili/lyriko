import { DetailedError, parseResponse } from '@workspace/api-client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { BackNavigation } from '@/web/components/back-navigation';
import { ProtectedRoute } from '@/web/components/protected-route';
import apiClient from '@/web/lib/api-client';
import { SongForm, type SongFormData } from '@/web/songs/song-form';

import type { Route } from './+types/songs.create';

export function meta(): ReturnType<Route.MetaFunction> {
  return [
    { title: 'Create Song - Lyriko' },
    {
      name: 'description',
      content: 'Create a new song',
    },
  ];
}

export default function CreateSong() {
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
        apiClient.songs.$post({
          json: songData,
        }),
      );

      toast.success('Song created successfully!');
      // Navigate to the created song page
      navigate(`/songs/${result.data.slug}`);
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
        return;
      }

      toast.error('An error occurred while creating the song.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <BackNavigation label="Back to Songs" to="/songs" />

        {/* Page Header */}
        <div className="relative bg-card border border-border rounded-xl p-6 mb-6 overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 opacity-5 rounded-xl bg-gradient-to-r from-primary to-primary/60" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-md ring-2 ring-background">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Create Song
                </h1>
                <p className="text-muted-foreground">Add a new song</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reusable Form Component */}
        <SongForm
          cancelButtonText="Cancel"
          cancelTo="/songs"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitButtonIcon={<Plus className="w-4 h-4" />}
          submitButtonText="Create Song"
        />
      </div>
    </ProtectedRoute>
  );
}
