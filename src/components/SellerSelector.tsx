import { useSeller } from '@/contexts/SellerContext'
import { usePermissions } from '@/hooks/usePermissions'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Store, X } from 'lucide-react'
import { Button } from './ui/button'

export function SellerSelector() {
    const { currentSellerId, setSellerId, availableSellers } = useSeller()
    const { isSuperAdmin, isSeller } = usePermissions()

    // Don't render for artisans or if no sellers available
    if (!isSuperAdmin && !isSeller) return null
    if (availableSellers.length === 0) return null

    // For sellers, show their shop name (read-only)
    if (isSeller) {
        const sellerName = availableSellers.find(s => s.id === currentSellerId)?.name || 'My Shop'
        return (
            <div className="flex items-center gap-2 border rounded-md px-3 py-1 bg-muted/50">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{sellerName}</span>
            </div>
        )
    }

    // For super admin, show dropdown with clear option
    return (
        <div className="flex items-center gap-2 border rounded-md px-3 py-1 bg-background">
            <Store className="h-4 w-4 text-muted-foreground" />
            <Select value={currentSellerId || 'none'} onValueChange={(value) => {
                if (value === 'none') {
                    setSellerId('');
                } else {
                    setSellerId(value);
                }
            }}>
                <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 w-[180px]">
                    <SelectValue placeholder="Select Seller" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">
                        <span className="text-muted-foreground italic">Platform View</span>
                    </SelectItem>
                    {availableSellers.map(seller => (
                        <SelectItem key={seller.id} value={seller.id}>
                            {seller.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
