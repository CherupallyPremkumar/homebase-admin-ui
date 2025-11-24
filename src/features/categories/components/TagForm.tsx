import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tag } from '@/types';

const tagSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(30),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(30),
});

type TagFormData = z.infer<typeof tagSchema>;

interface TagFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Tag, 'id'>) => Promise<void>;
  tag?: Tag;
}

export function TagForm({ open, onClose, onSubmit, tag }: TagFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: tag || {
      name: '',
      slug: '',
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setValue('slug', slug);
  };

  const handleFormSubmit = async (data: TagFormData) => {
    try {
      await onSubmit({
        name: data.name,
        slug: data.slug,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to submit tag:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {tag ? 'Edit Tag' : 'Add New Tag'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tag Name *</Label>
            <Input
              id="name"
              {...register('name')}
              onChange={(e) => {
                register('name').onChange(e);
                if (!tag) handleNameChange(e);
              }}
              placeholder="Handmade"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="handmade"
              className="font-mono text-sm"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isSubmitting ? 'Saving...' : tag ? 'Update Tag' : 'Add Tag'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
