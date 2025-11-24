import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { name: "Jan", current: 4000, previous: 2400 },
    { name: "Feb", current: 3000, previous: 1398 },
    { name: "Mar", current: 2000, previous: 9800 },
    { name: "Apr", current: 2780, previous: 3908 },
    { name: "May", current: 1890, previous: 4800 },
    { name: "Jun", current: 2390, previous: 3800 },
    { name: "Jul", current: 3490, previous: 4300 },
];

export function RevenueChart() {
    return (
        <Card className="col-span-4 border-none shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-muted-foreground">Current Week</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-secondary" />
                            <span className="text-muted-foreground">Previous Week</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value / 1000} k`}
                            />
                            <Tooltip
                                contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '12px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="current"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorCurrent)"
                            />
                            <Area
                                type="monotone"
                                dataKey="previous"
                                stroke="hsl(var(--secondary))"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPrevious)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
