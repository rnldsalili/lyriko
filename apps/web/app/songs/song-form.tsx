import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/base/button';
import { Checkbox } from '@workspace/ui/base/checkbox';
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
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { z } from 'zod';

export const songFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must contain at most 200 characters'),
  lyrics: z.string().min(1, 'Lyrics are required'),
  duration: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const parsed = parseInt(val, 10);
        return !isNaN(parsed) && parsed >= 1;
      },
      {
        message: 'Duration must be a positive number (in seconds)',
      },
    ),
  trackNumber: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const parsed = parseInt(val, 10);
        return !isNaN(parsed) && parsed >= 1;
      },
      {
        message: 'Track number must be a positive number',
      },
    ),
  albumId: z.string().optional(),
  releaseDate: z.string().optional(),
  language: z
    .string()
    .max(50, 'Language must contain at most 50 characters')
    .optional(),
  isExplicit: z.boolean(),
  isPublished: z.boolean(),
  lyricsSource: z
    .string()
    .max(100, 'Lyrics source must contain at most 100 characters')
    .optional(),
  spotifyUrl: z
    .string()
    .url('Spotify URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  youtubeUrl: z
    .string()
    .url('YouTube URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  appleMusicUrl: z
    .string()
    .url('Apple Music URL must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export type SongFormData = z.infer<typeof songFormSchema>;

interface SongFormProps {
  defaultValues?: Partial<SongFormData>;
  onSubmit: (values: SongFormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonIcon: React.ReactNode;
  cancelButtonText: string;
  cancelTo: string;
}

export function SongForm({
  defaultValues = {
    title: '',
    lyrics: '',
    duration: '',
    trackNumber: '',
    albumId: '',
    releaseDate: '',
    language: '',
    isExplicit: false,
    isPublished: false,
    lyricsSource: '',
    spotifyUrl: '',
    youtubeUrl: '',
    appleMusicUrl: '',
  },
  onSubmit,
  isSubmitting,
  submitButtonText,
  submitButtonIcon,
  cancelButtonText,
  cancelTo,
}: SongFormProps) {
  const form = useForm<SongFormData>({
    resolver: zodResolver(songFormSchema),
    defaultValues,
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter song title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lyrics Field */}
          <FormField
            control={form.control}
            name="lyrics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lyrics *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter song lyrics"
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration Field */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      min="1"
                      placeholder="e.g., 180"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Track Number Field */}
            <FormField
              control={form.control}
              name="trackNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track Number</FormLabel>
                  <FormControl>
                    <Input
                      min="1"
                      placeholder="e.g., 1"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Release Date Field */}
            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Date</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYY-MM-DD" type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language Field */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* URLs Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Spotify URL Field */}
            <FormField
              control={form.control}
              name="spotifyUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spotify URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://open.spotify.com/track/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* YouTube URL Field */}
            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Apple Music URL Field */}
            <FormField
              control={form.control}
              name="appleMusicUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apple Music URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://music.apple.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Lyrics Source Field */}
          <FormField
            control={form.control}
            name="lyricsSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lyrics Source</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Official release" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Checkboxes */}
          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="isExplicit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Explicit Content</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Published</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

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
