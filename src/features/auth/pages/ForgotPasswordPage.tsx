import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi } from '@/services/auth';
import handmadeImage from '@/assets/handmade-decor.jpg';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      await authApi.requestPasswordReset({ email: data.email });
      setIsSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-background">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <img
            src={handmadeImage}
            alt="Handmade artisan products"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
        </div>

        {/* Right side - Success Message */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Check Your Email</h1>
                <p className="text-sm text-muted-foreground">
                  If an account exists with that email, we've sent password reset instructions.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-sm text-primary hover:underline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={handmadeImage}
          alt="Handcrafted home decor and artisan products"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Handmade with Love
          </h2>
          <p className="text-lg drop-shadow-md opacity-90">
            Discover unique artisan products crafted by talented makers around the world
          </p>
        </div>
      </div>

      {/* Right side - Reset Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Forgot Password?
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and we'll send you a link to reset your password
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    {...register('email')}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-sm text-primary hover:underline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
