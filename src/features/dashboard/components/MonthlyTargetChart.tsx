import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, ArrowUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function MonthlyTargetChart() {
    return (
        <Card className="col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">Monthly Target</CardTitle>
                    <p className="text-xs text-muted-foreground">Target vs Reality</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-center">
                        <div className="p-4 rounded-full bg-primary/10 text-primary mb-2">
                            <Target className="h-8 w-8" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-bold">75.34%</span>
                        </div>
                        <Progress value={75.34} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-3 rounded-lg bg-muted/30">
                            <p className="text-xs text-muted-foreground mb-1">Target</p>
                            <p className="text-lg font-bold">$25,000</p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/5">
                            <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                            <p className="text-lg font-bold text-primary">$18,835</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 bg-emerald-50 py-2 rounded-lg">
                        <ArrowUp className="h-3 w-3" />
                        <span className="font-medium">You're doing better than last month!</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
