import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { ProductForm } from '../components/ProductForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { productsApi, categoriesApi } from '@/services/api';
import { Product, Category } from '@/types';
import { notification } from '@/services/notification';
import { useNotificationTrigger } from '@/contexts/NotificationContext';

export default function Products() {
  const navigate = useNavigate();
  const { tenant } = useParams();
  const notificationTrigger = useNotificationTrigger();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; product?: Product }>({ open: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Single API call - fetches products and categories together
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

    try {
      const response = await fetch(`${API_BASE_URL}/products/page-data`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`,
          'X-Tenant-ID': localStorage.getItem('tenantId') || sessionStorage.getItem('tenantId') || 'default',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setCategories(data.categories);
        setTags(data.tags || []);
      }
    } catch (error) {
      console.error('Failed to load products page data:', error);
    }
  };

  const handleAdd = () => {
    // Use absolute path to avoid relative routing issues
    const tenantId = tenant || 'default';
    navigate(`/${tenantId}/admin/products/create`);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleSubmit = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingProduct) {
        const updated = await productsApi.update(editingProduct.id, data);
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        notification.success('Product updated', `"${data.name}" has been updated successfully`);
        notificationTrigger.notifyProductUpdated(data.name);
      } else {
        const newProduct = await productsApi.create(data);
        setProducts([...products, newProduct]);
        notification.success('Product added', `"${data.name}" has been added to inventory`);
        notificationTrigger.notifyProductAdded(data.name);

        // Check for low stock
        if (data.stock < 10) {
          notificationTrigger.notifyLowStock(data.name, data.stock);
        }
      }
    } catch (error) {
      notification.error(
        editingProduct ? 'Failed to update product' : 'Failed to add product',
        'Please check your information and try again'
      );
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.product) return;

    const productName = deleteDialog.product.name;

    try {
      await productsApi.delete(deleteDialog.product.id);
      setProducts(products.filter(p => p.id !== deleteDialog.product!.id));
      notification.success('Product deleted', `"${productName}" has been removed from inventory`);
      notificationTrigger.notifyProductDeleted(productName);
      setDeleteDialog({ open: false });
    } catch (error) {
      notification.error('Failed to delete product', 'Please try again later');
    }
  };

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'stock':
          return a.stock - b.stock;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-semibold">${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock < 10 ? 'destructive' : 'secondary'}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>⭐ {product.rating.toFixed(1)}</TableCell>
                    <TableCell>
                      {product.featured && (
                        <Badge className="bg-gradient-primary">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-secondary/20"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-destructive/20 hover:text-destructive"
                          onClick={() => setDeleteDialog({ open: true, product })}
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

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        product={editingProduct}
        categories={categories}
        tags={tags.map(tag => ({ id: tag, name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') }))}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteDialog.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
