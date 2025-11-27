/**
 * InventoryForm Component
 * Manage inventory levels for a variant
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CreateInventoryCommand } from '@/types/product.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Package } from 'lucide-react'
import { useEffect } from 'react'

const inventorySchema = z.object({
    quantityAvailable: z.number().min(0, 'Quantity must be non-negative'),
    quantityReserved: z.number().min(0, 'Reserved quantity must be non-negative'),
    isBackOrderAllowed: z.boolean()
})

interface InventoryFormProps {
    initialData?: CreateInventoryCommand
    onChange: (data: CreateInventoryCommand) => void
}

export function InventoryForm({ initialData, onChange }: InventoryFormProps) {
    const form = useForm<z.infer<typeof inventorySchema>>({
        resolver: zodResolver(inventorySchema),
        defaultValues: initialData || {
            quantityAvailable: 0,
            quantityReserved: 0,
            isBackOrderAllowed: false
        }
    })

    // Watch for changes and propagate to parent
    useEffect(() => {
        const subscription = form.watch((value) => {
            if (value.quantityAvailable !== undefined &&
                value.quantityReserved !== undefined &&
                value.isBackOrderAllowed !== undefined) {
                onChange({
                    quantityAvailable: value.quantityAvailable,
                    quantityReserved: value.quantityReserved,
                    isBackOrderAllowed: value.isBackOrderAllowed
                })
            }
        })
        return () => subscription.unsubscribe()
    }, [form, onChange])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Inventory Management
                </CardTitle>
                <CardDescription>
                    Manage stock levels and backorder settings
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantityAvailable"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Available Quantity *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Current stock available for sale
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantityReserved"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reserved Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Stock reserved for pending orders
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isBackOrderAllowed"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Allow Backorders
                                        </FormLabel>
                                        <FormDescription>
                                            Continue selling when out of stock
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
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
