import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/base/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/base/form';
import { Input } from '@workspace/ui/base/input';
import { Textarea } from '@workspace/ui/base/textarea';
import { ArrowLeft, Plus, Palette } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import apiClient from '@/web/lib/api-client';
import { useSession } from '@/web/lib/auth';

import type { Route } from './+types/genres.create';

const createGenreSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must contain at most 50 characters'),
  description: z
    .string()
    .max(500, 'Description must contain at most 500 characters')
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional(),
});

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
  const { data: session } = useSession();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof createGenreSchema>>({
    resolver: zodResolver(createGenreSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#6366f1',
    },
  });

  const onSubmit = async (values: z.infer<typeof createGenreSchema>) => {
    try {
      const response = await apiClient.genres.$post({
        json: {
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
          color: values.color || undefined,
        },
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Genre created successfully!');
        // Navigate to the created genre page
        navigate(`/genres/${result.data.slug}`);
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || 'Failed to create genre. Please try again.',
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('An error occurred while creating the genre.');
    }
  };

  // Redirect to login if not authenticated
  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Authentication Required
            </h1>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to create a genre.
            </p>
            <Link
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              to="/auth/signin"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          to="/genres"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Genres
        </Link>
      </div>

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

      {/* Form */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter genre name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter genre description (optional)"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Field */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          {...field}
                          className="w-12 h-10 rounded-lg border border-input cursor-pointer disabled:cursor-not-allowed"
                          disabled={form.formState.isSubmitting}
                          type="color"
                        />
                        <Palette className="absolute inset-0 w-4 h-4 m-auto pointer-events-none text-white mix-blend-difference" />
                      </div>
                      <Input
                        {...field}
                        className="flex-1 font-mono text-sm"
                        placeholder="#6366f1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex items-center gap-2"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-current" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Genre
                  </>
                )}
              </Button>
              <Button asChild variant="secondary">
                <Link to="/genres">Cancel</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
