import { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Mail, Loader2, Shield, AlertCircle, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';
import { notification } from '@/services/notification';
import { detectTenant, getTenantDashboardUrl } from '@/utils/tenant';
import handmadeImage from '@/assets/handmade-decor.jpg';

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  // Detect tenant from URL
  const tenantInfo = detectTenant();
  const [tenantId] = useState(tenantInfo.tenantId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('');
      const response = await authApi.login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        tenantId,
      });

      if (response.requiresTwoFactor && response.sessionId) {
        setRequires2FA(true);
        setSessionId(response.sessionId);
        notification.info('2FA Required', 'Please enter your verification code');
        return;
      }

      login(response.user, response.token, data.rememberMe, response.tenantConfig);
      notification.success('Login successful', `Welcome back, ${response.user.name}!`);

      const dashboardUrl = getTenantDashboardUrl(tenantId, response.user.role);
      const from = (location.state as any)?.from?.pathname || dashboardUrl;
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setLoginError(message);
      notification.error('Login Failed', message);
    }
  };

  const handle2FASubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (twoFactorCode.length !== 6) {
      notification.error('Invalid Code', 'Please enter a 6-digit code');
      return;
    }

    try {
      setIsVerifying2FA(true);
      setLoginError('');

      await authApi.verifyTwoFactor({ code: twoFactorCode, sessionId });

      const user = await authApi.getCurrentUser();
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';

      login(user, token, rememberMe);
      notification.success('Verification successful', 'Welcome!');

      const dashboardUrl = getTenantDashboardUrl(tenantId, user.role);
      const from = (location.state as any)?.from?.pathname || dashboardUrl;
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : '2FA verification failed';
      setLoginError(message);
      notification.error('Verification Failed', message);
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const sessionExpired = (location.state as any)?.sessionExpired;

  if (requires2FA) {
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

        {/* Right side - 2FA Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Two-Factor Authentication
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handle2FASubmit} className="space-y-4">
                {loginError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="000000"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest font-mono h-14"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isVerifying2FA || twoFactorCode.length !== 6}
                >
                  {isVerifying2FA ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Verify Code
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setRequires2FA(false);
                    setTwoFactorCode('');
                    setSessionId('');
                  }}
                >
                  Back to Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Handmade Image */}
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

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Welcome Back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to manage your store
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {sessionExpired && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Your session has expired. Please login again.</AlertDescription>
              </Alert>
            )}

            {loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    {...register('email')}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    {...register('password')}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" {...register('rememberMe')} />
                  <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Partner Registration Section */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  New to our platform?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/partner/register')}
            >
              <Store className="mr-2 h-4 w-4" />
              Register as Partner
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Start selling your handmade products today and reach thousands of customers
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
