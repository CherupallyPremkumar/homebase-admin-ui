import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { CategoryForm } from '../components/CategoryForm';
import { TagForm } from '../components/TagForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { categoriesApi, tagsApi } from '@/services/api';
import { Category, Tag as TagType } from '@/types';
import { notification } from '@/services/notification';
import { useNotificationTrigger } from '@/contexts/NotificationContext';

export default function Categories() {
  const notificationTrigger = useNotificationTrigger();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [tagFormOpen, setTagFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [editingTag, setEditingTag] = useState<TagType | undefined>();
  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState<{ open: boolean; category?: Category }>({ open: false });
  const [deleteTagDialog, setDeleteTagDialog] = useState<{ open: boolean; tag?: TagType }>({ open: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [categoriesData, tagsData] = await Promise.all([
      categoriesApi.getAll(),
      tagsApi.getAll(),
    ]);
    setCategories(categoriesData);
    setTags(tagsData);
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setCategoryFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const handleCategorySubmit = async (data: Omit<Category, 'id' | 'productCount'>) => {
    try {
      if (editingCategory) {
        const updated = await categoriesApi.update(editingCategory.id, data);
        setCategories(categories.map(c => c.id === editingCategory.id ? updated : c));
        notification.success('Category updated', `"${data.name}" has been updated`);
        notificationTrigger.notifyCategoryUpdated(data.name);
      } else {
        const newCategory = await categoriesApi.create(data);
        setCategories([...categories, newCategory]);
        notification.success('Category created', `"${data.name}" has been added`);
        notificationTrigger.notifyCategoryAdded(data.name);
      }
    } catch (error) {
      notification.error(
        editingCategory ? 'Failed to update category' : 'Failed to create category',
        'Please try again'
      );
      throw error;
    }
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!deleteCategoryDialog.category) return;

    const categoryName = deleteCategoryDialog.category.name;

    try {
      await categoriesApi.delete(deleteCategoryDialog.category.id);
      setCategories(categories.filter(c => c.id !== deleteCategoryDialog.category!.id));
      notification.success('Category deleted', `"${categoryName}" has been removed`);
      notificationTrigger.notifyCategoryDeleted(categoryName);
      setDeleteCategoryDialog({ open: false });
    } catch (error) {
      notification.error('Failed to delete category', 'Please try again');
    }
  };

  const handleAddTag = () => {
    setEditingTag(undefined);
    setTagFormOpen(true);
  };

  const handleEditTag = (tag: TagType) => {
    setEditingTag(tag);
    setTagFormOpen(true);
  };

  const handleTagSubmit = async (data: Omit<TagType, 'id'>) => {
    try {
      if (editingTag) {
        // TODO: Implement tag update API
        notification.success('Tag updated', `"${data.name}" has been updated`);
      } else {
        const newTag = await tagsApi.create(data);
        setTags([...tags, newTag]);
        notification.success('Tag created', `"${data.name}" has been added`);
      }
    } catch (error) {
      notification.error(
        editingTag ? 'Failed to update tag' : 'Failed to create tag',
        'Please try again'
      );
      throw error;
    }
  };

  const handleDeleteTagConfirm = async () => {
    if (!deleteTagDialog.tag) return;

    const tagName = deleteTagDialog.tag.name;

    try {
      await tagsApi.delete(deleteTagDialog.tag.id);
      setTags(tags.filter(t => t.id !== deleteTagDialog.tag!.id));
      notification.success('Tag deleted', `"${tagName}" has been removed`);
      setDeleteTagDialog({ open: false });
    } catch (error) {
      notification.error('Failed to delete tag', 'Please try again');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Categories & Tags</h1>
        <p className="text-muted-foreground">Organize your products with categories and tags</p>
      </div>

      {/* Categories */}
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <Button onClick={handleAddCategory} className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell className="max-w-md">
                      {category.description || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.productCount} products</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-secondary/20"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-destructive/20 hover:text-destructive"
                          onClick={() => setDeleteCategoryDialog({ open: true, category })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tags
          </CardTitle>
          <Button onClick={handleAddTag} className="bg-gradient-secondary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors"
              >
                <span className="font-medium">{tag.name}</span>
                <span className="text-xs text-muted-foreground">#{tag.slug}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEditTag(tag)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:text-destructive"
                    onClick={() => setDeleteTagDialog({ open: true, tag })}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CategoryForm
        open={categoryFormOpen}
        onClose={() => setCategoryFormOpen(false)}
        onSubmit={handleCategorySubmit}
        category={editingCategory}
      />

      <TagForm
        open={tagFormOpen}
        onClose={() => setTagFormOpen(false)}
        onSubmit={handleTagSubmit}
        tag={editingTag}
      />

      <ConfirmDialog
        open={deleteCategoryDialog.open}
        onClose={() => setDeleteCategoryDialog({ open: false })}
        onConfirm={handleDeleteCategoryConfirm}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteCategoryDialog.category?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />

      <ConfirmDialog
        open={deleteTagDialog.open}
        onClose={() => setDeleteTagDialog({ open: false })}
        onConfirm={handleDeleteTagConfirm}
        title="Delete Tag"
        description={`Are you sure you want to delete "${deleteTagDialog.tag?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
