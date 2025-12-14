/**
 * VariantManager Component
 * Manage product variants including attributes, pricing, and inventory
 */

import { useState } from 'react'
import { CreateVariantCommand, VariantAttributeDTO, CreateInventoryCommand } from '@/types/product.types'
import { CreatePriceCommand } from '@/types/pricing.types'
import { PricingForm } from './PricingForm'
import { RegionalPriceManager } from './RegionalPriceManager'
import { PriceRulesManager } from './PriceRulesManager'
import { InventoryForm } from './InventoryForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Copy, Layers } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface VariantManagerProps {
    variants: CreateVariantCommand[]
    onChange: (variants: CreateVariantCommand[]) => void
}

export function VariantManager({ variants, onChange }: VariantManagerProps) {
    const [activeTab, setActiveTab] = useState<string>('details')

    const handleAddVariant = () => {
        const newVariant: CreateVariantCommand = {
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
        }
        onChange([...variants, newVariant])
    }

    const handleRemoveVariant = (index: number) => {
        const newVariants = [...variants]
        newVariants.splice(index, 1)
        onChange(newVariants)
    }

    const handleDuplicateVariant = (index: number) => {
        const variantToCopy = variants[index]
        const newVariant = {
            ...variantToCopy,
            sku: `${variantToCopy.sku}-COPY`,
            title: `${variantToCopy.title} (Copy)`
        }
        onChange([...variants, newVariant])
        toast.success('Variant duplicated')
    }

    const updateVariant = (index: number, updates: Partial<CreateVariantCommand>) => {
        const newVariants = [...variants]
        newVariants[index] = { ...newVariants[index], ...updates }
        onChange(newVariants)
    }

    const updateAttribute = (variantIndex: number, attrIndex: number, key: string, value: string) => {
        const newVariants = [...variants]
        const attributes = [...newVariants[variantIndex].attributes]
        attributes[attrIndex] = { ...attributes[attrIndex], [key]: value } as VariantAttributeDTO
        newVariants[variantIndex].attributes = attributes
        onChange(newVariants)
    }

    const addAttribute = (variantIndex: number) => {
        const newVariants = [...variants]
        newVariants[variantIndex].attributes.push({ attributeName: '', attributeValue: '' })
        onChange(newVariants)
    }

    const removeAttribute = (variantIndex: number, attrIndex: number) => {
        const newVariants = [...variants]
        newVariants[variantIndex].attributes.splice(attrIndex, 1)
        onChange(newVariants)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        Product Variants
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Manage different versions of your product (sizes, colors, etc.)
                    </p>
                </div>
                <Button onClick={handleAddVariant} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                </Button>
            </div>

            {variants.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-muted-foreground">
                        <p>No variants added yet.</p>
                        <Button onClick={handleAddVariant} variant="link">
                            Add your first variant
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {variants.map((variant, index) => (
                        <AccordionItem key={index} value={`variant-${index}`} className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">
                                            {variant.sku || `Variant ${index + 1}`}
                                        </span>
                                        {variant.attributes.map((attr, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                {attr.attributeValue}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        ${variant.prices[0]?.currentPrice?.toFixed(2) || '0.00'} • {variant.inventory?.quantityAvailable || 0} in stock
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-6">
                                <Tabs defaultValue="details" className="w-full">
                                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                                        <TabsTrigger
                                            value="details"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                                        >
                                            Details & Attributes
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="pricing"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                                        >
                                            Pricing
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="inventory"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                                        >
                                            Inventory
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="mt-6">
                                        <TabsContent value="details" className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>SKU *</Label>
                                                    <Input
                                                        value={variant.sku}
                                                        onChange={(e) => updateVariant(index, { sku: e.target.value })}
                                                        placeholder="e.g. TSHIRT-RED-M"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="space-y-2">
                                                        <Label>Variant Title</Label>
                                                        <Input
                                                            value={variant.title || ''}
                                                            onChange={(e) => updateVariant(index, { title: e.target.value })}
                                                            placeholder="e.g. Red T-Shirt Medium"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Feature Description</Label>
                                                        <Textarea
                                                            value={variant.featureDescription || ''}
                                                            onChange={(e) => updateVariant(index, { featureDescription: e.target.value })}
                                                            placeholder="Specific details about this variant..."
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label>Attributes</Label>
                                                    <Button size="sm" variant="ghost" onClick={() => addAttribute(index)}>
                                                        <Plus className="h-3 w-3 mr-1" /> Add Attribute
                                                    </Button>
                                                </div>
                                                {variant.attributes.map((attr, attrIndex) => (
                                                    <div key={attrIndex} className="flex gap-2 items-end">
                                                        <div className="flex-1 space-y-1">
                                                            <Label className="text-xs">Name</Label>
                                                            <Input
                                                                value={attr.attributeName}
                                                                onChange={(e) => updateAttribute(index, attrIndex, 'attributeName', e.target.value)}
                                                                placeholder="Color"
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <Label className="text-xs">Value</Label>
                                                            <Input
                                                                value={attr.attributeValue}
                                                                onChange={(e) => updateAttribute(index, attrIndex, 'attributeValue', e.target.value)}
                                                                placeholder="Red"
                                                            />
                                                        </div>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => removeAttribute(index, attrIndex)}
                                                            className="text-destructive hover:text-destructive/90"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="pricing" className="space-y-6">
                                            <PricingForm
                                                variantId={variant.sku}
                                                initialData={variant.prices[0]}
                                                onSubmit={(priceData) => {
                                                    const newPrices = [...variant.prices]
                                                    newPrices[0] = { ...newPrices[0], ...priceData }
                                                    updateVariant(index, { prices: newPrices })
                                                }}
                                            />

                                            <div className="border-t pt-6">
                                                <h4 className="text-sm font-medium mb-4">Regional Pricing</h4>
                                                <RegionalPriceManager
                                                    regionalPrices={variant.prices[0]?.regionalPrices || []}
                                                    onChange={(regionalPrices) => {
                                                        const newPrices = [...variant.prices]
                                                        newPrices[0] = { ...newPrices[0], regionalPrices }
                                                        updateVariant(index, { prices: newPrices })
                                                    }}
                                                />
                                            </div>

                                            <div className="border-t pt-6">
                                                <h4 className="text-sm font-medium mb-4">Price Rules</h4>
                                                <PriceRulesManager
                                                    priceRules={variant.prices[0]?.priceRules || []}
                                                    onChange={(priceRules) => {
                                                        const newPrices = [...variant.prices]
                                                        newPrices[0] = { ...newPrices[0], priceRules }
                                                        updateVariant(index, { prices: newPrices })
                                                    }}
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="inventory">
                                            <InventoryForm
                                                initialData={variant.inventory}
                                                onChange={(inventoryData) => updateVariant(index, { inventory: inventoryData })}
                                            />
                                        </TabsContent>
                                    </div>
                                </Tabs>

                                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                                    <Button variant="outline" size="sm" onClick={() => handleDuplicateVariant(index)}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Duplicate
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleRemoveVariant(index)}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove Variant
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    )
}
