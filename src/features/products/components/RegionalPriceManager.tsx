/**
 * RegionalPriceManager Component
 * Manage regional pricing for different countries/regions
 */

import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CreateRegionalPriceCommand, SUPPORTED_REGIONS } from '@/types/pricing.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Globe } from 'lucide-react'

const regionalPriceSchema = z.object({
    region: z.string().min(1, 'Region is required'),
    currency: z.string().min(1, 'Currency is required'),
    priceAmount: z.number().min(0.01, 'Price must be greater than 0'),
    taxRate: z.number().min(0).max(100).optional(),
    includesTax: z.boolean().optional()
})

interface RegionalPriceManagerProps {
    regionalPrices: CreateRegionalPriceCommand[]
    onChange: (prices: CreateRegionalPriceCommand[]) => void
}

export function RegionalPriceManager({ regionalPrices, onChange }: RegionalPriceManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const form = useForm<z.infer<typeof regionalPriceSchema>>({
        resolver: zodResolver(regionalPriceSchema),
        defaultValues: {
            region: '',
            currency: '',
            priceAmount: 0,
            taxRate: 0,
            includesTax: false
        }
    })

    const handleAddOrUpdate = (values: z.infer<typeof regionalPriceSchema>) => {
        const newPrice: CreateRegionalPriceCommand = {
            region: values.region,
            currency: values.currency,
            priceAmount: values.priceAmount,
            taxRate: values.taxRate,
            includesTax: values.includesTax
        }

        if (editingIndex !== null) {
            // Update existing
            const updated = [...regionalPrices]
            updated[editingIndex] = newPrice
            onChange(updated)
        } else {
            // Add new
            onChange([...regionalPrices, newPrice])
        }

        form.reset()
        setIsDialogOpen(false)
        setEditingIndex(null)
    }

    const handleEdit = (index: number) => {
        const price = regionalPrices[index]
        form.reset(price)
        setEditingIndex(index)
        setIsDialogOpen(true)
    }

    const handleDelete = (index: number) => {
        onChange(regionalPrices.filter((_, i) => i !== index))
    }

    const handleRegionChange = (regionCode: string) => {
        const region = SUPPORTED_REGIONS.find(r => r.code === regionCode)
        if (region) {
            form.setValue('region', region.code)
            form.setValue('currency', region.currency)
            form.setValue('taxRate', region.taxRate)
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Regional Pricing
                        </CardTitle>
                        <CardDescription>
                            Set different prices for different regions
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { form.reset(); setEditingIndex(null) }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Region
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingIndex !== null ? 'Edit' : 'Add'} Regional Price
                                </DialogTitle>
                                <DialogDescription>
                                    Set pricing for a specific region or country
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleAddOrUpdate)} className="space-y-4">
                                    {/* Region Selector */}
                                    <FormField
                                        control={form.control}
                                        name="region"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Region *</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        handleRegionChange(value)
                                                    }}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select region" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {SUPPORTED_REGIONS.map(region => (
                                                            <SelectItem key={region.code} value={region.code}>
                                                                {region.name} ({region.code})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Currency (auto-filled) */}
                                        <FormField
                                            control={form.control}
                                            name="currency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Currency</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled className="bg-muted" />
                                                    </FormControl>
                                                    <FormDescription>Auto-filled</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Price Amount */}
                                        <FormField
                                            control={form.control}
                                            name="priceAmount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="19.99"
                                                            {...field}
                                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Tax Rate */}
                                    <FormField
                                        control={form.control}
                                        name="taxRate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Rate (%)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        placeholder="20"
                                                        {...field}
                                                        onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                    />
                                                </FormControl>
                                                <FormDescription>VAT/Sales tax percentage</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Tax Included */}
                                    <FormField
                                        control={form.control}
                                        name="includesTax"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Price Includes Tax</FormLabel>
                                                    <FormDescription>
                                                        Tax is already included in the price
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            {editingIndex !== null ? 'Update' : 'Add'} Region
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {regionalPrices.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No regional prices added yet</p>
                        <p className="text-sm">Add regional pricing to sell in multiple countries</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Region</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Tax</TableHead>
                                <TableHead>Tax Included</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {regionalPrices.map((price, index) => {
                                const region = SUPPORTED_REGIONS.find(r => r.code === price.region)
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {region?.name || price.region}
                                        </TableCell>
                                        <TableCell>
                                            {price.currency} {price.priceAmount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>{price.taxRate}%</TableCell>
                                        <TableCell>
                                            {price.includesTax ? (
                                                <Badge variant="secondary">Yes</Badge>
                                            ) : (
                                                <Badge variant="outline">No</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(index)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(index)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
