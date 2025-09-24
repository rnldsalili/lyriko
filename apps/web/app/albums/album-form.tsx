import { zodResolver } from '@hookform/resolvers/zod';
import { ALBUM_TYPE_LABELS, AlbumType } from '@workspace/constants/album';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/base/select';
import { Textarea } from '@workspace/ui/base/textarea';
import { DatePicker } from '@workspace/ui/components/date-picker';
import { albumTypeSchema } from '@workspace/validators/albums';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { z } from 'zod';

const albumTypeOptions = Object.entries(ALBUM_TYPE_LABELS).map(
  ([value, label]) => ({
    value: value as AlbumType,
    label,
  }),
);

export const albumFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must contain at most 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must contain at most 1000 characters')
    .optional(),
  coverImage: z
    .string()
    .optional()
    .refine(
      (url) => {
        if (!url || url.trim() === '') return true;
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Cover image must be a valid URL' },
    ),
  releaseDate: z.date().optional(),
  albumType: albumTypeSchema,
  totalTracks: z
    .number()
    .int()
    .min(1, 'Total tracks must be at least 1')
    .optional(),
});

export type AlbumFormData = z.infer<typeof albumFormSchema>;

interface AlbumFormProps {
  defaultValues?: Partial<AlbumFormData>;
  onSubmit: (values: AlbumFormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonIcon: React.ReactNode;
  cancelButtonText: string;
  cancelTo: string;
}

export function AlbumForm({
  defaultValues = {
    title: '',
    description: '',
    coverImage: '',
    releaseDate: undefined,
    albumType: AlbumType.ALBUM,
    totalTracks: undefined,
  },
  onSubmit,
  isSubmitting,
  submitButtonText,
  submitButtonIcon,
  cancelButtonText,
  cancelTo,
}: AlbumFormProps) {
  const form = useForm<AlbumFormData>({
    resolver: zodResolver(albumFormSchema),
    defaultValues,
  });

  const handleSubmit = (values: AlbumFormData) => {
    // Convert empty strings to undefined for optional fields
    const processedValues = {
      ...values,
      description: values.description?.trim() || undefined,
      coverImage: values.coverImage?.trim() || undefined,
    };
    return onSubmit(processedValues);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter album title" {...field} />
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
                    placeholder="Enter album description (optional)"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Image Field */}
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/album-cover.jpg (optional)"
                    type="url"
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
                  <DatePicker
                    onChange={field.onChange}
                    placeholder="Pick a date (optional)"
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Album Type Field */}
          <FormField
            control={form.control}
            name="albumType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Album Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select album type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {albumTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Tracks Field */}
          <FormField
            control={form.control}
            name="totalTracks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Tracks</FormLabel>
                <FormControl>
                  <Input
                    min="1"
                    placeholder="Enter number of tracks (optional)"
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseInt(value, 10) : undefined);
                    }}
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
