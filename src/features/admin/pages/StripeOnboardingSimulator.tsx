import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

/**
 * Stripe Onboarding Simulator
 * Simulates the Stripe Connect onboarding flow for development
 * In production, users would be on Stripe's actual hosted page
 */
export default function StripeOnboardingSimulator() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState<'loading' | 'form' | 'success'>('loading');
    const accountId = searchParams.get('account');

    useEffect(() => {
        // Simulate loading Stripe's page
        setTimeout(() => setStep('form'), 1500);
    }, []);

    const handleComplete = () => {
        setStep('success');
        setTimeout(() => {
            // Redirect back to the app with success
            navigate('/sellers/onboarding/complete?success=true');
        }, 2000);
    };

    if (step === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                            <p className="text-muted-foreground">Connecting to Stripe...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
                            <h2 className="text-2xl font-bold">Setup Complete!</h2>
                            <p className="text-muted-foreground">Redirecting you back...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="border-b bg-white">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div>
                            <CardTitle>Stripe Connect</CardTitle>
                            <CardDescription>Secure payment setup</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                            <strong>🔒 Development Mode:</strong> This is a simulator. In production,
                            you would see Stripe's actual secure onboarding form.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Banking Information</h3>
                        <p className="text-sm text-muted-foreground">
                            Account ID: <code className="bg-muted px-2 py-1 rounded">{accountId}</code>
                        </p>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Bank account verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Identity verification complete</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Tax information submitted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Terms of service accepted</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-xs text-muted-foreground">
                        <p>✓ Your information is encrypted with bank-level security</p>
                        <p>✓ PCI-DSS Level 1 certified</p>
                        <p>✓ We never see or store your bank account details</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => navigate('/sellers')}>
                            Cancel
                        </Button>
                        <Button onClick={handleComplete}>
                            Complete Setup
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
