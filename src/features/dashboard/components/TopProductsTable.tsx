import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const products = [
    { id: 1, name: "Shirt", price: 76.89, category: "Man Cloths", quantity: 128, amount: 6647.15, image: "https://api.dicebear.com/7.x/shapes/svg?seed=shirt" },
    { id: 2, name: "T-Shirt", price: 79.80, category: "Women Cloths", quantity: 89, amount: 6647.15, image: "https://api.dicebear.com/7.x/shapes/svg?seed=tshirt" },
    { id: 3, name: "Pant", price: 86.65, category: "Kid Cloths", quantity: 74, amount: 6647.15, image: "https://api.dicebear.com/7.x/shapes/svg?seed=pant" },
    { id: 4, name: "Sweater", price: 56.07, category: "Man Cloths", quantity: 69, amount: 6647.15, image: "https://api.dicebear.com/7.x/shapes/svg?seed=sweater" },
    { id: 5, name: "Light Jacket", price: 36.00, category: "Women Cloths", quantity: 65, amount: 6647.15, image: "https://api.dicebear.com/7.x/shapes/svg?seed=jacket" },
    { id: 6, name: "Half Shirt", price: 46.78, category: "Man Cloths", quantity: 58, amount: 6647.15, image: "https://api.dicebear.com/7.x/shapes/svg?seed=halfshirt" },
];

export function TopProductsTable() {
    return (
        <Card className="col-span-6 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">Top Selling Products</CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                        <Filter className="h-3.5 w-3.5" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                        See All
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[30px]">
                                    <Checkbox />
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Quantity</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    <td className="p-4 align-middle">
                                        <Checkbox />
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-9 w-9 rounded-md object-cover bg-muted"
                                            />
                                            <span className="font-medium">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle font-medium text-muted-foreground">${product.price.toFixed(2)}</td>
                                    <td className="p-4 align-middle text-muted-foreground">{product.category}</td>
                                    <td className="p-4 align-middle text-muted-foreground">{product.quantity}</td>
                                    <td className="p-4 align-middle font-medium">${product.amount.toLocaleString()}</td>
                                    <td className="p-4 align-middle">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
