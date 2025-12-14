import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { platformApi } from '@/api/platformApi';
import { Seller, SellerStatus, SELLER_STATUS_CONFIG } from '@/types/seller.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Store, Search, MoreVertical, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

export default function SellersPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
    const [actionDialog, setActionDialog] = useState<{ type: 'approve' | 'reject' | 'suspend' | null; seller: Seller | null }>({ type: null, seller: null });

    const activeTab = searchParams.get('status') || 'all';

    useEffect(() => {
        loadSellers();
    }, []);

    const loadSellers = async () => {
        try {
            setLoading(true);
            const data = await platformApi.getSellers();
            setSellers(data);
        } catch (error) {
            console.error('Failed to load sellers:', error);
            toast.error('Failed to load sellers');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (seller: Seller) => {
        try {
            await platformApi.approveSeller(seller.id);
            toast.success(`${seller.name} has been approved!`);
            await loadSellers();
        } catch (error) {
            console.error('Failed to approve seller:', error);
            toast.error('Failed to approve seller');
        } finally {
            setActionDialog({ type: null, seller: null });
        }
    };

    const handleReject = async (seller: Seller) => {
        try {
            await platformApi.rejectSeller(seller.id, 'Does not meet platform requirements');
            toast.success(`${seller.name} has been rejected`);
            await loadSellers();
        } catch (error) {
            console.error('Failed to reject seller:', error);
            toast.error('Failed to reject seller');
        } finally {
            setActionDialog({ type: null, seller: null });
        }
    };

    const handleSuspend = async (seller: Seller) => {
        try {
            await platformApi.suspendSeller(seller.id, 'Account under review');
            toast.success(`${seller.name} has been suspended`);
            await loadSellers();
        } catch (error) {
            console.error('Failed to suspend seller:', error);
            toast.error('Failed to suspend seller');
        } finally {
            setActionDialog({ type: null, seller: null });
        }
    };

    const filterSellers = (status: SellerStatus | 'all') => {
        let filtered = sellers;

        if (status !== 'all') {
            filtered = filtered.filter(s => s.status === status);
        }

        if (searchQuery) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const getStatusCounts = () => {
        return {
            all: sellers.length,
            pending: sellers.filter(s => s.status === 'PENDING').length,
            active: sellers.filter(s => s.status === 'ACTIVE').length,
            suspended: sellers.filter(s => s.status === 'SUSPENDED').length,
            rejected: sellers.filter(s => s.status === 'REJECTED').length,
        };
    };

    const counts = getStatusCounts();
    const filteredSellers = filterSellers(activeTab as SellerStatus | 'all');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sellers</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all sellers on the platform
                        {counts.pending > 0 && (
                            <span className="ml-2 text-yellow-600 font-medium">
                                • {counts.pending} pending approval
                            </span>
                        )}
                    </p>
                </div>
                <Button onClick={() => navigate('/sellers/create')} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Seller
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setSearchParams({ status: value })}>
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                        <TabsTrigger value="PENDING">
                            Pending ({counts.pending})
                            {counts.pending > 0 && <span className="ml-1 h-2 w-2 rounded-full bg-yellow-500" />}
                        </TabsTrigger>
                        <TabsTrigger value="ACTIVE">Active ({counts.active})</TabsTrigger>
                        <TabsTrigger value="SUSPENDED">Suspended ({counts.suspended})</TabsTrigger>
                        <TabsTrigger value="REJECTED">Rejected ({counts.rejected})</TabsTrigger>
                    </TabsList>

                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search sellers..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <TabsContent value={activeTab} className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {activeTab === 'all' ? 'All Sellers' : `${activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} Sellers`}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Seller Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Products</TableHead>
                                        <TableHead className="text-right">Orders</TableHead>
                                        <TableHead className="text-right">Revenue</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                Loading sellers...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredSellers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No sellers found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSellers.map((seller) => (
                                            <TableRow key={seller.id} className="cursor-pointer hover:bg-muted/50">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                                            <Store className="h-4 w-4" />
                                                        </div>
                                                        {seller.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{seller.email}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={SELLER_STATUS_CONFIG[seller.status].variant}
                                                        className={SELLER_STATUS_CONFIG[seller.status].className}
                                                    >
                                                        {SELLER_STATUS_CONFIG[seller.status].label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{seller.products || 0}</TableCell>
                                                <TableCell className="text-right">{seller.orders || 0}</TableCell>
                                                <TableCell className="text-right">${(seller.revenue || 0).toLocaleString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {seller.status === 'PENDING' && (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        onClick={() => setActionDialog({ type: 'approve', seller })}
                                                                        className="text-green-600"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                                        Approve
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => setActionDialog({ type: 'reject', seller })}
                                                                        className="text-red-600"
                                                                    >
                                                                        <XCircle className="h-4 w-4 mr-2" />
                                                                        Reject
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            {seller.status === 'ACTIVE' && (
                                                                <DropdownMenuItem
                                                                    onClick={() => setActionDialog({ type: 'suspend', seller })}
                                                                    className="text-orange-600"
                                                                >
                                                                    <PauseCircle className="h-4 w-4 mr-2" />
                                                                    Suspend
                                                                </DropdownMenuItem>
                                                            )}
                                                            {seller.status === 'SUSPENDED' && (
                                                                <DropdownMenuItem
                                                                    onClick={() => setActionDialog({ type: 'approve', seller })}
                                                                    className="text-green-600"
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                    Reactivate
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Confirmation Dialogs */}
            <AlertDialog open={actionDialog.type === 'approve'} onOpenChange={() => setActionDialog({ type: null, seller: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Seller?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to approve <strong>{actionDialog.seller?.name}</strong>?
                            They will be able to list products and receive orders.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => actionDialog.seller && handleApprove(actionDialog.seller)}>
                            Approve
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={actionDialog.type === 'reject'} onOpenChange={() => setActionDialog({ type: null, seller: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Seller?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject <strong>{actionDialog.seller?.name}</strong>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => actionDialog.seller && handleReject(actionDialog.seller)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Reject
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={actionDialog.type === 'suspend'} onOpenChange={() => setActionDialog({ type: null, seller: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Suspend Seller?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to suspend <strong>{actionDialog.seller?.name}</strong>?
                            They will not be able to receive new orders until reactivated.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => actionDialog.seller && handleSuspend(actionDialog.seller)}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            Suspend
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
