import { zodResolver } from '@hookform/resolvers/zod';
import { DetailedError, parseResponse } from '@workspace/api-client';
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
import { ImageUpload } from '@workspace/ui/components/image-upload';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import apiClient from '@/web/lib/api-client';

export const artistFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must contain at most 100 characters'),
  bio: z
    .string()
    .max(1000, 'Bio must contain at most 1000 characters')
    .optional(),
  image: z.string().optional(),
  website: z
    .string()
    .url('Website must be a valid URL')
    .optional()
    .or(z.literal('')),
  spotifyUrl: z
    .string()
    .url('Spotify URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .max(50, 'Country must contain at most 50 characters')
    .optional(),
  debutYear: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const parsed = parseInt(val, 10);
        return (
          !isNaN(parsed) && parsed >= 1900 && parsed <= new Date().getFullYear()
        );
      },
      {
        message: `Debut year must be between 1900 and ${new Date().getFullYear()}`,
      },
    ),
});

export type ArtistFormData = z.infer<typeof artistFormSchema>;

interface ArtistFormProps {
  defaultValues?: Partial<ArtistFormData>;
  onSubmit: (values: ArtistFormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonIcon: React.ReactNode;
  cancelButtonText: string;
  cancelTo: string;
}

export function ArtistForm({
  defaultValues = {
    name: '',
    bio: '',
    image: '',
    website: '',
    spotifyUrl: '',
    country: '',
    debutYear: '',
  },
  onSubmit,
  isSubmitting,
  submitButtonText,
  submitButtonIcon,
  cancelButtonText,
  cancelTo,
}: ArtistFormProps) {
  const form = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema),
    defaultValues,
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const result = await parseResponse(
        apiClient.assets.upload.$post({
          form: {
            file,
          },
        }),
      );

      const fileName = result.data.fileName;

      return fileName.startsWith('/') ? fileName : `/${fileName}`;
    } catch (error) {
      if (error instanceof DetailedError) {
        throw new Error(error.message);
      }

      throw new Error('Failed to upload image');
    }
  };

  return (
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
                  <Input placeholder="Enter artist name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio Field */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biography</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter artist biography (optional)"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload Field */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUpload
                    disabled={isSubmitting}
                    label="Profile Image"
                    onChange={field.onChange}
                    onUpload={handleImageUpload}
                    onError={(message) => toast.error(message)}
                    onSuccess={(message) => toast.success(message)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Website Field */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Official Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Spotify URL Field */}
            <FormField
              control={form.control}
              name="spotifyUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spotify URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://open.spotify.com/artist/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country Field */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Debut Year Field */}
          <FormField
            control={form.control}
            name="debutYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Debut Year</FormLabel>
                <FormControl>
                  <Input
                    max={new Date().getFullYear()}
                    min="1900"
                    placeholder="Enter debut year (e.g., 2020)"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex items-center gap-2"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-current" />
                  {isSubmitting ? 'Processing...' : submitButtonText}
                </>
              ) : (
                <>
                  {submitButtonIcon}
                  {submitButtonText}
                </>
              )}
            </Button>
            <Button asChild variant="secondary">
              <Link to={cancelTo}>{cancelButtonText}</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
