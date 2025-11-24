import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { name: "Direct", value: 300.56, color: "#1e293b" },
    { name: "Affiliate", value: 135.18, color: "#10b981" },
    { name: "Sponsored", value: 154.02, color: "#8b5cf6" },
    { name: "E-mail", value: 48.96, color: "#f59e0b" },
];

export function TotalSalesChart() {
    return (
        <Card className="col-span-2 border-none shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="text-xs text-muted-foreground">Total</span>
                            <p className="text-xl font-bold">38.6%</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="font-medium">${item.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
