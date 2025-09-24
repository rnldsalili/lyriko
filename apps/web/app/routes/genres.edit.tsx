import { Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { BackNavigation } from '@/web/components/back-navigation';
import { ProtectedRoute } from '@/web/components/protected-route';
import { GenreForm, type GenreFormData } from '@/web/genres/genre-form';
import apiClient from '@/web/lib/api-client';

import type { Route } from './+types/genres.edit';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Edit ${params.slug} - Lyriko` },
    {
      name: 'description',
      content: `Edit the ${params.slug} genre`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const response = await apiClient.genres[':slug'].$get({
    param: { slug: params.slug },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Response('Genre not found', { status: 404 });
    }
    throw new Error('Failed to fetch genre');
  }

  return response.json();
}

export default function EditGenre({ loaderData }: Route.ComponentProps) {
  const { data: genre } = loaderData;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: GenreFormData) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.genres[':slug'].$put({
        param: { slug: genre.slug },
        json: {
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
          color: values.color || undefined,
        },
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Genre updated successfully!');
        // Navigate to the updated genre page
        navigate(`/genres/${result.data.slug}`);
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || 'Failed to update genre. Please try again.',
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('An error occurred while updating the genre.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <BackNavigation
          label={`Back to ${genre.name}`}
          to={`/genres/${genre.slug}`}
        />

        {/* Page Header */}
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
            <div className="flex items-center gap-4 mb-4">
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
                  Edit {genre.name}
                </h1>
                <p className="text-muted-foreground">Update genre details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reusable Form Component */}
        <GenreForm
          cancelButtonText="Cancel"
          cancelTo={`/genres/${genre.slug}`}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitButtonIcon={<Save className="w-4 h-4" />}
          submitButtonText="Save Changes"
          defaultValues={{
            name: genre.name,
            description: genre.description || '',
            color: genre.color || '#6366f1',
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
