import { DetailedError, parseResponse } from '@workspace/api-client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { BackNavigation } from '@/web/components/back-navigation';
import { ProtectedRoute } from '@/web/components/protected-route';
import { GenreForm, type GenreFormData } from '@/web/genres/genre-form';
import apiClient from '@/web/lib/api-client';

import type { Route } from './+types/genres.create';

export function meta(): ReturnType<Route.MetaFunction> {
  return [
    { title: 'Create Genre - Lyriko' },
    {
      name: 'description',
      content: 'Create a new music genre',
    },
  ];
}

export default function CreateGenre() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: GenreFormData) => {
    setIsSubmitting(true);
    try {
      const result = await parseResponse(
        apiClient.genres.$post({
          json: {
            name: values.name.trim(),
            description: values.description?.trim() || undefined,
            color: values.color || undefined,
          },
        }),
      );

      toast.success('Genre created successfully!');
      // Navigate to the created genre page
      navigate(`/genres/${result.data.slug}`);
    } catch (error) {
      if (error instanceof DetailedError) {
        toast.error(error.message);
        return;
      }

      toast.error('An error occurred while creating the genre.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <BackNavigation label="Back to Genres" to="/genres" />

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
                  Create Genre
                </h1>
                <p className="text-muted-foreground">Add a new music genre</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reusable Form Component */}
        <GenreForm
          cancelButtonText="Cancel"
          cancelTo="/genres"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitButtonIcon={<Plus className="w-4 h-4" />}
          submitButtonText="Create Genre"
        />
      </div>
    </ProtectedRoute>
  );
}
