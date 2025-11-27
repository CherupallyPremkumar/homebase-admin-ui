/**
 * Pricing Demo Page
 * Demonstrates all pricing components
 */

import { useState } from 'react'
import { CreatePriceCommand } from '@/types/pricing.types'
import { PricingForm } from '@/features/products/components/PricingForm'
import { RegionalPriceManager } from '@/features/products/components/RegionalPriceManager'
import { PriceRulesManager } from '@/features/products/components/PriceRulesManager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { DollarSign } from 'lucide-react'

export default function PricingDemoPage() {
    const [priceData, setPriceData] = useState<CreatePriceCommand>({
        variantId: 'DEMO-VARIANT-001',
        listPrice: 0,
        currentPrice: 0,
        currency: 'USD',
        regionalPrices: [],
        priceRules: []
    })

    const handlePricingSubmit = (data: CreatePriceCommand) => {
        setPriceData(prev => ({ ...prev, ...data }))
        console.log('Pricing updated:', data)
    }

    const handleRegionalPricesChange = (regionalPrices: any[]) => {
        setPriceData(prev => ({ ...prev, regionalPrices }))
        console.log('Regional prices updated:', regionalPrices)
    }

    const handlePriceRulesChange = (priceRules: any[]) => {
        setPriceData(prev => ({ ...prev, priceRules }))
        console.log('Price rules updated:', priceRules)
    }

    const handleSubmitAll = () => {
        console.log('Complete price data:', priceData)
        alert('Check console for complete price data!')
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <DollarSign className="h-8 w-8" />
                        Pricing System Demo
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Professional pricing with regional support and dynamic rules
                    </p>
                </div>
                <Button size="lg" onClick={handleSubmitAll}>
                    View Complete Data
                </Button>
            </div>

            {/* Pricing Components */}
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Pricing</TabsTrigger>
                    <TabsTrigger value="regional">Regional Pricing</TabsTrigger>
                    <TabsTrigger value="rules">Price Rules</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-6">
                    <PricingForm
                        variantId="DEMO-VARIANT-001"
                        onSubmit={handlePricingSubmit}
                        initialData={priceData}
                    />
                </TabsContent>

                <TabsContent value="regional" className="mt-6">
                    <RegionalPriceManager
                        regionalPrices={priceData.regionalPrices || []}
                        onChange={handleRegionalPricesChange}
                    />
                </TabsContent>

                <TabsContent value="rules" className="mt-6">
                    <PriceRulesManager
                        priceRules={priceData.priceRules || []}
                        onChange={handlePriceRulesChange}
                    />
                </TabsContent>
            </Tabs>

            {/* Current Data Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Price Data</CardTitle>
                    <CardDescription>
                        This is what will be sent to the backend
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                        {JSON.stringify(priceData, null, 2)}
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}
