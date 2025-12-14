/**
 * PriceRulesManager Component
 * Manage dynamic pricing rules (bulk discounts, flash sales, etc.)
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CreatePriceRuleCommand, PriceRuleType, AdjustmentType } from '@/types/pricing.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Zap, Calendar } from 'lucide-react'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'

const priceRuleSchema = z.object({
    ruleType: z.nativeEnum(PriceRuleType),
    ruleCondition: z.string().min(1, 'Rule condition is required'),
    adjustmentType: z.nativeEnum(AdjustmentType),
    adjustmentValue: z.number().min(0, 'Adjustment value must be positive'),
    priority: z.number().min(1).max(100).optional(),
    validFrom: z.date().optional(),
    validUntil: z.date().optional()
})

interface PriceRulesManagerProps {
    priceRules: CreatePriceRuleCommand[]
    onChange: (rules: CreatePriceRuleCommand[]) => void
}

export function PriceRulesManager({ priceRules, onChange }: PriceRulesManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const form = useForm<z.infer<typeof priceRuleSchema>>({
        resolver: zodResolver(priceRuleSchema),
        defaultValues: {
            ruleType: PriceRuleType.BULK_DISCOUNT,
            ruleCondition: '',
            adjustmentType: AdjustmentType.PERCENTAGE_OFF,
            adjustmentValue: 0,
            priority: 1
        }
    })

    const watchRuleType = form.watch('ruleType')

    // Generate default condition based on rule type
    const getDefaultCondition = (ruleType: PriceRuleType): string => {
        switch (ruleType) {
            case PriceRuleType.BULK_DISCOUNT:
                return '{"minQuantity": 10}'
            case PriceRuleType.CUSTOMER_SEGMENT:
                return '{"segment": "VIP"}'
            case PriceRuleType.LOCATION_BASED:
                return '{"region": "US"}'
            case PriceRuleType.TIME_BASED:
                return '{"dayOfWeek": "FRIDAY", "hour": 18}'
            default:
                return '{}'
        }
    }

    const handleAddOrUpdate = (values: z.infer<typeof priceRuleSchema>) => {
        const newRule: CreatePriceRuleCommand = {
            ruleType: values.ruleType,
            ruleCondition: values.ruleCondition,
            adjustmentType: values.adjustmentType,
            adjustmentValue: values.adjustmentValue,
            priority: values.priority,
            validFrom: values.validFrom?.toISOString(),
            validUntil: values.validUntil?.toISOString()
        }

        if (editingIndex !== null) {
            const updated = [...priceRules]
            updated[editingIndex] = newRule
            onChange(updated)
        } else {
            onChange([...priceRules, newRule])
        }

        form.reset()
        setIsDialogOpen(false)
        setEditingIndex(null)
    }

    const handleEdit = (index: number) => {
        const rule = priceRules[index]
        form.reset({
            ...rule,
            validFrom: rule.validFrom ? new Date(rule.validFrom) : undefined,
            validUntil: rule.validUntil ? new Date(rule.validUntil) : undefined
        })
        setEditingIndex(index)
        setIsDialogOpen(true)
    }

    const handleDelete = (index: number) => {
        onChange(priceRules.filter((_, i) => i !== index))
    }

    const getRuleBadgeColor = (ruleType: PriceRuleType) => {
        switch (ruleType) {
            case PriceRuleType.BULK_DISCOUNT:
                return 'bg-blue-100 text-blue-800'
            case PriceRuleType.PROMOTIONAL:
                return 'bg-purple-100 text-purple-800'
            case PriceRuleType.SEASONAL:
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Price Rules
                        </CardTitle>
                        <CardDescription>
                            Set up dynamic pricing rules and discounts
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { form.reset(); setEditingIndex(null) }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Rule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingIndex !== null ? 'Edit' : 'Add'} Price Rule
                                </DialogTitle>
                                <DialogDescription>
                                    Create dynamic pricing rules for discounts and promotions
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleAddOrUpdate)} className="space-y-4">
                                    {/* Rule Type */}
                                    <FormField
                                        control={form.control}
                                        name="ruleType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rule Type *</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        form.setValue('ruleCondition', getDefaultCondition(value as PriceRuleType))
                                                    }}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={PriceRuleType.BULK_DISCOUNT}>Bulk Discount</SelectItem>
                                                        <SelectItem value={PriceRuleType.PROMOTIONAL}>Promotional / Flash Sale</SelectItem>
                                                        <SelectItem value={PriceRuleType.SEASONAL}>Seasonal</SelectItem>
                                                        <SelectItem value={PriceRuleType.CUSTOMER_SEGMENT}>Customer Segment</SelectItem>
                                                        <SelectItem value={PriceRuleType.LOCATION_BASED}>Location Based</SelectItem>
                                                        <SelectItem value={PriceRuleType.TIME_BASED}>Time Based</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Rule Condition (JSON) */}
                                    <FormField
                                        control={form.control}
                                        name="ruleCondition"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rule Condition (JSON) *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='{"minQuantity": 10}'
                                                        className="font-mono text-sm"
                                                        rows={3}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {watchRuleType === PriceRuleType.BULK_DISCOUNT && 'Example: {"minQuantity": 10}'}
                                                    {watchRuleType === PriceRuleType.CUSTOMER_SEGMENT && 'Example: {"segment": "VIP"}'}
                                                    {watchRuleType === PriceRuleType.LOCATION_BASED && 'Example: {"region": "US"}'}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Adjustment Type */}
                                        <FormField
                                            control={form.control}
                                            name="adjustmentType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Discount Type *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={AdjustmentType.PERCENTAGE_OFF}>Percentage Off</SelectItem>
                                                            <SelectItem value={AdjustmentType.FIXED_AMOUNT_OFF}>Fixed Amount Off</SelectItem>
                                                            <SelectItem value={AdjustmentType.FIXED_PRICE}>Fixed Price</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Adjustment Value */}
                                        <FormField
                                            control={form.control}
                                            name="adjustmentValue"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Discount Value *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="15"
                                                            {...field}
                                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        {form.watch('adjustmentType') === AdjustmentType.PERCENTAGE_OFF ? '%' : '$'}
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Priority */}
                                    <FormField
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Priority</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="100"
                                                        placeholder="1"
                                                        {...field}
                                                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                    />
                                                </FormControl>
                                                <FormDescription>1 = highest priority (rules applied in order)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Validity Dates */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="validFrom"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Valid From</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                                >
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="validUntil"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Valid Until</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                                >
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            {editingIndex !== null ? 'Update' : 'Add'} Rule
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {priceRules.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No price rules added yet</p>
                        <p className="text-sm">Add rules for bulk discounts, flash sales, and more</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rule Type</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Validity</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {priceRules.map((rule, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Badge className={getRuleBadgeColor(rule.ruleType)}>
                                            {rule.ruleType.replace(/_/g, ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs max-w-[200px] truncate">
                                        {rule.ruleCondition}
                                    </TableCell>
                                    <TableCell>
                                        {rule.adjustmentValue}
                                        {rule.adjustmentType === AdjustmentType.PERCENTAGE_OFF ? '%' : '$'} off
                                    </TableCell>
                                    <TableCell>{rule.priority || 1}</TableCell>
                                    <TableCell className="text-sm">
                                        {rule.validFrom && rule.validUntil ? (
                                            <span className="text-muted-foreground">
                                                {format(new Date(rule.validFrom), 'MMM d')} - {format(new Date(rule.validUntil), 'MMM d')}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">Always</span>
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
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
