import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { platformApi } from '@/api/platformApi';
import { toast } from 'sonner';

/**
 * Stripe Onboarding Complete Page
 * Shown after seller returns from Stripe Connect onboarding
 */
export default function StripeOnboardingComplete() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [sellerName, setSellerName] = useState('');

    const success = searchParams.get('success') === 'true';

    useEffect(() => {
        const completeOnboarding = async () => {
            if (!success) {
                setStatus('error');
                return;
            }

            try {
                // Retrieve saved form data from localStorage
                const savedData = localStorage.getItem('pendingSellerOnboarding');

                if (!savedData) {
                    console.error('No pending seller data found');
                    setStatus('error');
                    return;
                }

                const { sellerId, formData, gateway } = JSON.parse(savedData);

                // Create the seller account with all collected information
                await platformApi.createSeller({
                    name: formData.storeName,
                    email: formData.ownerEmail,
                    phone: formData.ownerPhone,
                    address: formData.businessAddress,
                });

                setSellerName(formData.storeName);

                // Clear the saved data
                localStorage.removeItem('pendingSellerOnboarding');

                // Show success
                setStatus('success');
                toast.success('Seller account created successfully!');

            } catch (error) {
                console.error('Failed to create seller account:', error);
                setStatus('error');
                toast.error('Failed to create seller account');
            }
        };

        completeOnboarding();
    }, [success]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                            <h2 className="text-xl font-semibold">Verifying your setup...</h2>
                            <p className="text-sm text-muted-foreground">
                                Please wait while we confirm your payment details
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle className="h-10 w-10 text-red-600" />
                            </div>
                            <div className="text-center">
                                <CardTitle className="text-2xl">Setup Incomplete</CardTitle>
                                <CardDescription className="mt-2">
                                    Your payment setup was not completed
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex gap-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-yellow-900">
                                    <p className="font-medium mb-1">What happened?</p>
                                    <p>
                                        You may have closed the window or cancelled the setup process.
                                        Don't worry, you can try again anytime.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button onClick={() => navigate('/sellers/create')}>
                                Try Again
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/sellers')}>
                                Back to Sellers
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <div className="text-center">
                            <CardTitle className="text-2xl">Payment Setup Complete!</CardTitle>
                            <CardDescription className="mt-2">
                                {sellerName && `${sellerName} is `}ready to receive payments
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-green-900">
                            <CheckCircle className="h-4 w-4" />
                            <span>Bank account verified</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-900">
                            <CheckCircle className="h-4 w-4" />
                            <span>Payouts enabled</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-900">
                            <CheckCircle className="h-4 w-4" />
                            <span>Ready to accept orders</span>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                            <strong>What's next?</strong> Your application is now pending admin approval.
                            You'll receive an email once your account is activated.
                        </p>
                    </div>

                    <Button className="w-full" onClick={() => navigate('/sellers?status=PENDING')}>
                        View Application Status
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
