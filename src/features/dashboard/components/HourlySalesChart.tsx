import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HourlyData } from '@/types';
import { getHoursArray, formatHour } from '@/utils/date-range';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface HourlySalesChartProps {
    data: HourlyData[];
    isLoading?: boolean;
    showBusinessHoursOnly?: boolean;
}

export function HourlySalesChart({
    data,
    isLoading,
    showBusinessHoursOnly = false
}: HourlySalesChartProps) {
    const chartData = useMemo(() => {
        const hours = showBusinessHoursOnly
            ? Array.from({ length: 13 }, (_, i) => i + 9) // 9 AM to 9 PM
            : getHoursArray();

        return hours.map((hour) => {
            const hourData = data.find((d) => d.hour === hour);
            return {
                hour,
                hourLabel: formatHour(hour),
                sales: hourData?.sales || 0,
                orders: hourData?.orders || 0,
                revenue: hourData?.revenue || 0,
            };
        });
    }, [data, showBusinessHoursOnly]);

    if (isLoading) {
        return (
            <Card className="lg:col-span-5">
                <CardHeader>
                    <CardTitle>Hourly Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        );
    }

    const hasData = data.length > 0;

    return (
        <Card className="lg:col-span-5">
            <CardHeader>
                <CardTitle>Hourly Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Sales and orders by hour
                </p>
            </CardHeader>
            <CardContent>
                {!hasData ? (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                        <p>No data available for this period</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="hourLabel"
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="left"
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px',
                                }}
                                formatter={(value: number, name: string) => {
                                    if (name === 'revenue') {
                                        return [`$${value.toLocaleString()}`, 'Revenue'];
                                    }
                                    return [value, name === 'orders' ? 'Orders' : 'Sales'];
                                }}
                            />
                            <Legend />
                            <Bar
                                yAxisId="left"
                                dataKey="orders"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                                name="Orders"
                            />
                            <Bar
                                yAxisId="right"
                                dataKey="revenue"
                                fill="hsl(var(--chart-2))"
                                radius={[4, 4, 0, 0]}
                                name="Revenue"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
