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
import { Palette } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { z } from 'zod';

export const genreFormSchema = z.object({
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

export type GenreFormData = z.infer<typeof genreFormSchema>;

interface GenreFormProps {
  defaultValues?: Partial<GenreFormData>;
  onSubmit: (values: GenreFormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonIcon: React.ReactNode;
  cancelButtonText: string;
  cancelTo: string;
}

export function GenreForm({
  defaultValues = {
    name: '',
    description: '',
    color: '#6366f1',
  },
  onSubmit,
  isSubmitting,
  submitButtonText,
  submitButtonIcon,
  cancelButtonText,
  cancelTo,
}: GenreFormProps) {
  const form = useForm<GenreFormData>({
    resolver: zodResolver(genreFormSchema),
    defaultValues,
  });

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
                        type="color"
                        value={field.value || '#6366f1'}
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
