import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const locations = [
    { name: "New York", value: 72, amount: "72K" },
    { name: "San Francisco", value: 39, amount: "39K" },
    { name: "Sydney", value: 25, amount: "25K" },
    { name: "Singapore", value: 61, amount: "61K" },
];

export function SalesByLocation() {
    return (
        <Card className="col-span-2 border-none shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Sales By Location</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="h-[150px] w-full bg-muted/20 rounded-lg flex items-center justify-center mb-6">
                        <span className="text-muted-foreground text-sm">Map Visualization Placeholder</span>
                    </div>
                    <div className="space-y-4">
                        {locations.map((location) => (
                            <div key={location.name} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{location.name}</span>
                                    <span className="font-medium">{location.amount}</span>
                                </div>
                                <Progress value={location.value} className="h-1.5 bg-muted" indicatorClassName="bg-primary" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
