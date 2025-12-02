import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { platformApi } from '@/api/platformApi';
import { COUNTRIES } from '@/types/payment.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Loader2, Store, Building2, User, CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Step 1: Business Information
const businessInfoSchema = z.object({
    businessName: z.string().min(2, 'Business name must be at least 2 characters'),
    businessType: z.enum(['individual', 'llc', 'corporation', 'partnership'], {
        required_error: 'Please select a business type',
    }),
    businessCountry: z.string().min(2, 'Please select your country'),
    businessAddress: z.string().min(10, 'Please enter a complete address'),
    businessPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
    taxId: z.string()
        .optional()
        .refine((val) => !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val), {
            message: 'Invalid GSTIN format. Example: 22AAAAA0000A1Z5'
        }),
});

// Step 2: Owner Information
const ownerInfoSchema = z.object({
    ownerName: z.string().min(2, 'Name must be at least 2 characters'),
    ownerEmail: z.string().email('Invalid email address'),
    ownerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
    ownerAddress: z.string().min(10, 'Please enter a complete address'),
});

// Step 3: Store Setup
const storeSetupSchema = z.object({
    storeName: z.string().min(2, 'Store name must be at least 2 characters'),
    storeDescription: z.string().min(20, 'Description must be at least 20 characters'),
    productCategories: z.string().min(2, 'Please specify your product categories'),
});

// Step 4: Payment Setup - Bank Account Details
const paymentSetupSchema = z.object({
    accountNumber: z.string()
        .min(8, 'Account number must be at least 8 digits')
        .max(20, 'Account number cannot exceed 20 digits')
        .regex(/^[0-9]+$/, 'Account number must contain only digits'),
    ifscCode: z.string()
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format. Example: SBIN0001234'),
});

// Combined schema
const completeSellerSchema = businessInfoSchema
    .merge(ownerInfoSchema)
    .merge(storeSetupSchema)
    .merge(paymentSetupSchema);

type CompleteSellerFormValues = z.infer<typeof completeSellerSchema>;

const STEPS = [
    { id: 1, title: 'Owner Information', icon: User, description: 'Primary contact details' },
    { id: 2, title: 'Business Information', icon: Building2, description: 'Legal business details' },
    { id: 3, title: 'Store Setup', icon: Store, description: 'Your shop details' },
    { id: 4, title: 'Payment Setup', icon: CreditCard, description: 'Secure payout configuration' },
];

export default function CreateSellerPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CompleteSellerFormValues>({
        resolver: zodResolver(completeSellerSchema),
        mode: 'onChange',
        defaultValues: {
            businessName: '',
            businessType: undefined,
            businessCountry: '',
            businessAddress: '',
            businessPhone: '',
            taxId: '',
            ownerName: '',
            ownerEmail: '',
            ownerPhone: '',
            ownerAddress: '',
            storeName: '',
            storeDescription: '',
            productCategories: '',
            accountNumber: '',
            ifscCode: '',
        },
    });

    const selectedCountry = form.watch('businessCountry');

    const validateStep = async (step: number): Promise<boolean> => {
        let fields: (keyof CompleteSellerFormValues)[] = [];

        switch (step) {
            case 1:
                fields = ['ownerName', 'ownerEmail', 'ownerPhone', 'ownerAddress'];
                break;
            case 2:
                fields = ['businessName', 'businessType', 'businessCountry', 'businessAddress', 'businessPhone'];
                break;
            case 3:
                fields = ['storeName', 'storeDescription', 'productCategories'];
                break;
            case 4:
                fields = ['accountNumber', 'ifscCode'];
                break;
        }

        const result = await form.trigger(fields);
        return result;
    };

    const handleNext = async () => {
        const isValid = await validateStep(currentStep);
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const onSubmit = async (data: CompleteSellerFormValues) => {
        try {
            setIsSubmitting(true);

            // Create seller account with bank details
            await platformApi.createSeller({
                name: data.storeName,
                email: data.ownerEmail,
                phone: data.ownerPhone,
                address: data.businessAddress,
                bankAccount: {
                    accountNumber: data.accountNumber,
                    ifscCode: data.ifscCode,
                },
            });

            toast.success('Seller application submitted! Pending admin approval.');
            navigate('/sellers?status=PENDING');
        } catch (error) {
            console.error('Failed to create seller:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (currentStep / STEPS.length) * 100;

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/sellers')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">Seller Registration</h1>
                    <p className="text-muted-foreground mt-1">
                        Complete all steps to join our marketplace
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Step {currentStep} of {STEPS.length}</span>
                    <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-4">
                {STEPS.map((step) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <div
                            key={step.id}
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${isActive
                                ? 'border-primary bg-primary/5'
                                : isCompleted
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-border bg-muted/30'
                                }`}
                        >
                            <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : isCompleted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    <StepIcon className="h-5 w-5" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                    <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Step 1: Owner Information */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="ownerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Primary contact and account owner
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="ownerEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="john@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="ownerPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+1 (555) 987-6543" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="ownerAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Residential Address</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="456 Home Street, Residential City, RC 54321"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    For identity verification purposes
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Step 2: Business Information */}
                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="businessName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Legal Business Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Acme Crafts LLC" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Must match your tax documents
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="businessType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Business Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="individual">Individual / Sole Proprietor</SelectItem>
                                                            <SelectItem value="llc">LLC</SelectItem>
                                                            <SelectItem value="corporation">Corporation</SelectItem>
                                                            <SelectItem value="partnership">Partnership</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="businessCountry"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select country" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {COUNTRIES.map((country) => (
                                                                <SelectItem key={country.code} value={country.code}>
                                                                    {country.flag} {country.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        Determines your payment provider
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="businessAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Business Address</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="123 Craft Lane, Artisan City, AC 12345"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    We may send verification mail to this address
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="businessPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Business Phone</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+1 (555) 123-4567" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="taxId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tax ID / EIN (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="XX-XXXXXXX" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}


                            {/* Step 3: Store Setup */}
                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="storeName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Store Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Store className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input className="pl-9" placeholder="John's Handmade Crafts" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    This is your public shop name (must be unique)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="storeDescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Store Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell customers about your unique handmade products and what makes your shop special..."
                                                        className="min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    A compelling description helps customers discover your shop
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="productCategories"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Categories</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Pottery, Jewelry, Home Decor" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    What types of products will you sell?
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Step 4: Payment Setup */}
                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="accountNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Account Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="1234567890"
                                                            {...field}
                                                            type="text"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="ifscCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>IFSC Code</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="SBIN0001234"
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}


                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>

                                {currentStep < STEPS.length ? (
                                    <Button type="button" onClick={handleNext}>
                                        Next
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit Application
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
