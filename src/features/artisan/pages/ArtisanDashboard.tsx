import { useEffect, useState } from 'react';
import { artisanApi, ArtisanStats, AssignedTask } from '@/api/artisanApi';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Package,
    Clock,
    CheckCircle,
    AlertCircle,
    Play,
    Check,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ArtisanDashboard() {
    const [stats, setStats] = useState<ArtisanStats | null>(null);
    const [tasks, setTasks] = useState<AssignedTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, tasksData] = await Promise.all([
                artisanApi.getArtisanStats(),
                artisanApi.getAssignedTasks(),
            ]);
            setStats(statsData);
            setTasks(tasksData);
        } catch (error) {
            console.error('Failed to load artisan dashboard:', error);
            toast.error('Failed to load your tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleStartTask = async (taskId: string) => {
        try {
            await artisanApi.updateTaskStatus(taskId, 'in_progress');
            toast.success('Task started!');
            loadDashboardData();
        } catch (error) {
            toast.error('Failed to start task');
        }
    };

    const handleCompleteTask = async (taskId: string) => {
        try {
            await artisanApi.updateTaskStatus(taskId, 'completed');
            toast.success('Task marked as complete! Waiting for approval.');
            loadDashboardData();
        } catch (error) {
            toast.error('Failed to complete task');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline">Not Started</Badge>;
            case 'in_progress':
                return <Badge className="bg-blue-500">In Progress</Badge>;
            case 'completed':
                return <Badge className="bg-green-500">Completed</Badge>;
            case 'pending_approval':
                return <Badge className="bg-amber-500">Pending Approval</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'low':
                return 'text-gray-600 bg-gray-50 border-gray-200';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays < 0) return 'Overdue';
        if (diffInDays === 0) return 'Due Today';
        if (diffInDays === 1) return 'Due Tomorrow';
        return `Due in ${diffInDays} days`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-muted-foreground">Loading your tasks...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Workbench</h1>
                <p className="text-muted-foreground mt-1">
                    Track and manage your assigned production tasks
                </p>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Assigned Tasks"
                        value={stats.assignedProducts}
                        icon={Package}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-50"
                    />
                    <StatCard
                        title="In Progress"
                        value={stats.inProgress}
                        icon={Clock}
                        iconColor="text-amber-600"
                        iconBgColor="bg-amber-50"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        icon={CheckCircle}
                        iconColor="text-green-600"
                        iconBgColor="bg-green-50"
                    />
                    <StatCard
                        title="Pending Approval"
                        value={stats.pendingApproval}
                        icon={AlertCircle}
                        iconColor="text-purple-600"
                        iconBgColor="bg-purple-50"
                    />
                </div>
            )}

            {/* Tasks List */}
            <Card>
                <CardHeader>
                    <CardTitle>Assigned Products</CardTitle>
                    <CardDescription>Your current production queue</CardDescription>
                </CardHeader>
                <CardContent>
                    {tasks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No tasks assigned yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{task.productName}</h3>
                                                {getStatusBadge(task.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                SKU: {task.sku}
                                            </p>
                                        </div>
                                        <div className={cn('px-2 py-1 rounded text-xs font-medium border', getPriorityColor(task.priority))}>
                                            {task.priority.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-medium">
                                                {task.completed} / {task.quantity} units
                                            </span>
                                        </div>
                                        <Progress value={(task.completed / task.quantity) * 100} />
                                    </div>

                                    {/* Due Date */}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(task.dueDate)}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        {task.status === 'pending' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleStartTask(task.id)}
                                                className="flex items-center gap-2"
                                            >
                                                <Play className="h-4 w-4" />
                                                Start Working
                                            </Button>
                                        )}
                                        {task.status === 'in_progress' && task.completed === task.quantity && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleCompleteTask(task.id)}
                                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                            >
                                                <Check className="h-4 w-4" />
                                                Mark Complete
                                            </Button>
                                        )}
                                        {task.status === 'pending_approval' && (
                                            <Badge variant="outline" className="text-amber-600">
                                                Awaiting seller approval
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
