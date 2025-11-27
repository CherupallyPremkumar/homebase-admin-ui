/**
 * Complete Product Creation Page with Pricing
 * Integrates all pricing components into product creation flow
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateProductCommand, CreateVariantCommand } from '@/types/product.types'
import { VariantManager } from '@/features/products/components/VariantManager'
import { productApi } from '@/api/productApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Package } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateProductPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // Product basic info
    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('')
    const [categoryId, setCategoryId] = useState('')

    // Variants data (includes pricing and inventory)
    const [variants, setVariants] = useState<CreateVariantCommand[]>([{
        sku: '',
        title: '',
        attributes: [],
        prices: [{
            variantId: '',
            listPrice: 0,
            currentPrice: 0,
            currency: 'USD',
            regionalPrices: [],
            priceRules: []
        }],
        inventory: {
            quantityAvailable: 0,
            quantityReserved: 0,
            isBackOrderAllowed: false
        }
    }])

    const handleSubmit = async () => {
        // Validation
        if (!productName || !description) {
            toast.error('Please fill in product name and description')
            return
        }

        if (variants.length === 0) {
            toast.error('Please add at least one variant')
            return
        }

        // Validate variants
        for (const variant of variants) {
            if (!variant.sku) {
                toast.error('All variants must have a SKU')
                return
            }
            if (!variant.prices[0]?.currentPrice) {
                toast.error(`Price missing for variant ${variant.sku}`)
                return
            }
        }

        setLoading(true)

        try {
            // Build complete product payload
            const productPayload: CreateProductCommand = {
                name: productName,
                description,
                categoryId: categoryId || 'DEFAULT',
                variants: variants.map(v => ({
                    ...v,
                    title: v.title || `${productName} - ${v.sku}`
                }))
            }

            console.log('Submitting product:', productPayload)

            // Submit to backend
            const result = await productApi.createProduct(productPayload)

            toast.success('Product created successfully!')
            console.log('Product created:', result)

            // Navigate back to products list
            setTimeout(() => {
                navigate('/products')
            }, 1500)

        } catch (error: any) {
            console.error('Failed to create product:', error)
            toast.error(error.message || 'Failed to create product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/products')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Package className="h-8 w-8" />
                            Create New Product
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Add a new product with variants, pricing, and inventory
                        </p>
                    </div>
                </div>
                <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-primary"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Creating...' : 'Create Product'}
                </Button>
            </div>

            {/* Basic Product Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Enter the basic details about your product
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                            id="name"
                            placeholder="Handmade Ceramic Mug"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="Beautiful handcrafted ceramic mug..."
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category ID</Label>
                        <Input
                            id="category"
                            placeholder="CAT-CERAMICS"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Variants Manager (Includes Pricing & Inventory) */}
            <VariantManager
                variants={variants}
                onChange={setVariants}
            />



            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate('/products')}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-primary"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Creating...' : 'Create Product'}
                </Button>
            </div>
        </div>
    )
}
