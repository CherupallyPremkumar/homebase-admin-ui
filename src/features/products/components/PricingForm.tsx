/**
 * PricingForm Component
 * Main pricing form with list/current price, Prime pricing, Subscribe & Save
 */

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CreatePriceCommand, SUPPORTED_CURRENCIES } from '@/types/pricing.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'

const pricingSchema = z.object({
    listPrice: z.number().min(0.01, 'List price must be greater than 0'),
    currentPrice: z.number().min(0.01, 'Current price must be greater than 0'),
    currency: z.string().min(1, 'Currency is required'),
    primePrice: z.number().optional(),
    subscribeSavePercent: z.number().min(0).max(100).optional(),
    effectiveFrom: z.date().optional(),
    effectiveTo: z.date().optional()
}).refine(data => !data.listPrice || data.currentPrice <= data.listPrice, {
    message: 'Current price cannot be greater than list price',
    path: ['currentPrice']
})

interface PricingFormProps {
    variantId: string
    onSubmit: (data: CreatePriceCommand) => void
    initialData?: Partial<CreatePriceCommand>
}

export function PricingForm({ variantId, onSubmit, initialData }: PricingFormProps) {
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [discount, setDiscount] = useState({ amount: 0, percent: 0 })

    const form = useForm<z.infer<typeof pricingSchema>>({
        resolver: zodResolver(pricingSchema),
        defaultValues: {
            listPrice: initialData?.listPrice || 0,
            currentPrice: initialData?.currentPrice || 0,
            currency: initialData?.currency || 'USD',
            primePrice: initialData?.primePrice,
            subscribeSavePercent: initialData?.subscribeSavePercent || 15,
            effectiveFrom: initialData?.effectiveFrom ? new Date(initialData.effectiveFrom) : undefined,
            effectiveTo: initialData?.effectiveTo ? new Date(initialData.effectiveTo) : undefined
        }
    })

    const watchListPrice = form.watch('listPrice')
    const watchCurrentPrice = form.watch('currentPrice')

    // Auto-calculate discount
    useEffect(() => {
        if (watchListPrice && watchCurrentPrice) {
            const discountAmount = watchListPrice - watchCurrentPrice
            const discountPercent = (discountAmount / watchListPrice) * 100
            setDiscount({
                amount: Math.max(0, discountAmount),
                percent: Math.max(0, Math.round(discountPercent))
            })
        }
    }, [watchListPrice, watchCurrentPrice])

    const handleSubmit = (values: z.infer<typeof pricingSchema>) => {
        const priceData: CreatePriceCommand = {
            variantId,
            listPrice: values.listPrice,
            currentPrice: values.currentPrice,
            currency: values.currency,
            primePrice: values.primePrice,
            subscribeSavePercent: values.subscribeSavePercent,
            effectiveFrom: values.effectiveFrom?.toISOString(),
            effectiveTo: values.effectiveTo?.toISOString(),
            discountAmount: discount.amount,
            discountPercent: discount.percent
        }
        onSubmit(priceData)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>
                    Set your product pricing and discounts
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Currency */}
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {SUPPORTED_CURRENCIES.map(curr => (
                                                <SelectItem key={curr.code} value={curr.code}>
                                                    {curr.symbol} {curr.name} ({curr.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* List Price (MSRP) */}
                            <FormField
                                control={form.control}
                                name="listPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>List Price (MSRP)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="29.99"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormDescription>Original retail price</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Current Price (Selling Price) */}
                            <FormField
                                control={form.control}
                                name="currentPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Selling Price *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="24.99"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormDescription>Actual selling price</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Discount Display */}
                        {discount.amount > 0 && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                <TrendingDown className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                    Discount: ${discount.amount.toFixed(2)} ({discount.percent}% off)
                                </span>
                            </div>
                        )}

                        {/* Advanced Pricing Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium">Advanced Pricing</h4>
                                <p className="text-sm text-muted-foreground">
                                    Prime pricing, Subscribe & Save, scheduled pricing
                                </p>
                            </div>
                            <Switch
                                checked={showAdvanced}
                                onCheckedChange={setShowAdvanced}
                            />
                        </div>

                        {/* Advanced Pricing Options */}
                        {showAdvanced && (
                            <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Prime Member Price */}
                                    <FormField
                                        control={form.control}
                                        name="primePrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prime Member Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="23.99"
                                                        {...field}
                                                        onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                    />
                                                </FormControl>
                                                <FormDescription>Special price for members</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Subscribe & Save Discount */}
                                    <FormField
                                        control={form.control}
                                        name="subscribeSavePercent"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subscribe & Save Discount %</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        placeholder="15"
                                                        {...field}
                                                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                    />
                                                </FormControl>
                                                <FormDescription>Subscription discount (default: 15%)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Schedule Pricing */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="effectiveFrom"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                            >
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription>When this price becomes active</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="effectiveTo"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>End Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                            >
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription>When this price expires</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
