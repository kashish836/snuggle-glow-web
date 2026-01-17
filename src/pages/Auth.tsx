/**
 * Authentication Page with Google Sign-In
 * 
 * SECURITY:
 * - Rate limiting on auth attempts to prevent brute force
 * - Strict input validation with Zod schemas
 * - Password strength requirements
 * - XSS prevention through sanitization
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Baby, Heart, Mail, Lock, User, Sparkles, Star, ArrowRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { rateLimiter, RATE_LIMIT_CONFIGS } from '@/lib/rate-limiter';
import {
  emailSchema,
  passwordSchema,
  loginPasswordSchema,
  displayNameSchema,
  sanitizeString,
} from '@/lib/validation';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; displayName?: string }>({});
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  /**
   * Validates form input using Zod schemas
   * SECURITY: Schema-based validation prevents injection attacks
   */
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; displayName?: string } = {};

    // Validate email
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    // Validate password - stricter for signup
    const passwordResult = isLogin
      ? loginPasswordSchema.safeParse(password)
      : passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    // Validate display name for signup
    if (!isLogin && displayName) {
      const nameResult = displayNameSchema.safeParse(displayName);
      if (!nameResult.success) {
        newErrors.displayName = nameResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission with rate limiting
   * SECURITY: Rate limiting prevents brute force attacks
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitMessage(null);

    // Rate limiting check
    const rateLimit = rateLimiter.check('auth', RATE_LIMIT_CONFIGS.auth);
    if (!rateLimit.allowed) {
      setRateLimitMessage(rateLimit.message || 'Too many attempts. Please wait.');
      toast({
        variant: 'destructive',
        title: 'Too Many Attempts',
        description: rateLimit.message,
      });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          // Don't reveal if email exists or not (security best practice)
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid email or password. Please try again.',
          });
        } else {
          // Reset rate limit on successful login
          rateLimiter.reset('auth');
          toast({
            title: 'Welcome back, mama! 💕',
            description: 'Successfully signed in to your account.',
          });
        }
      } else {
        // Sanitize display name before sending
        const sanitizedName = displayName ? sanitizeString(displayName) : undefined;
        const { error } = await signUp(email, password, sanitizedName);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              variant: 'destructive',
              title: 'Sign Up Failed',
              description: 'This email is already registered. Try signing in instead.',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Sign Up Failed',
              description: error.message,
            });
          }
        } else {
          toast({
            title: 'Welcome to SnuggleNest! 🎀',
            description: 'Your account has been created successfully.',
          });
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles Google OAuth sign-in
   * SECURITY: Uses Supabase OAuth which handles CSRF protection
   */
  const handleGoogleSignIn = async () => {
    // Rate limiting check
    const rateLimit = rateLimiter.check('auth', RATE_LIMIT_CONFIGS.auth);
    if (!rateLimit.allowed) {
      setRateLimitMessage(rateLimit.message || 'Too many attempts. Please wait.');
      toast({
        variant: 'destructive',
        title: 'Too Many Attempts',
        description: rateLimit.message,
      });
      return;
    }

    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Google Sign-In Failed',
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to connect to Google. Please try again.',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-lavender">
      <Navigation />

      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <Heart className="absolute top-32 left-10 h-6 w-6 text-pink-200 animate-float opacity-60" />
        <Star className="absolute top-40 right-20 h-5 w-5 text-pink-200 animate-float opacity-50" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute bottom-40 left-20 h-4 w-4 text-lavender animate-pulse-gentle opacity-40" style={{ animationDelay: '2s' }} />
      </div>

      <section className="section-padding py-16 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="baby-card">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Baby className="h-16 w-16 text-pink-400 animate-float" />
                  <Heart className="h-5 w-5 text-pink-500 absolute -top-1 -right-2 animate-pulse-gentle" />
                </div>
              </div>
              <h1 className="text-3xl font-pacifico text-pink-600 mb-2">
                {isLogin ? 'Welcome Back, Mama!' : 'Join Our Nest'}
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? 'Sign in to continue your journey'
                  : 'Create an account to join our loving community'}
              </p>
            </div>

            {/* Rate Limit Warning */}
            {rateLimitMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{rateLimitMessage}</p>
              </div>
            )}

            {/* Google Sign-In Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || !!rateLimitMessage}
              className="w-full border-pink-200 text-gray-700 hover:bg-pink-50 py-6 rounded-xl mb-4 group"
            >
              {googleLoading ? (
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 animate-pulse" />
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </span>
              )}
            </Button>

            <div className="relative my-6">
              <Separator className="bg-pink-100" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-400">
                or
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-pink-400" />
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={50}
                    className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl ${
                      errors.displayName ? 'border-red-400' : ''
                    }`}
                  />
                  {errors.displayName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.displayName}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-pink-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mama@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl ${
                    errors.email ? 'border-red-400' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-pink-400" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={128}
                  className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl ${
                    errors.password ? 'border-red-400' : ''
                  }`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
                {!isLogin && (
                  <p className="text-xs text-gray-500">
                    At least 8 characters with uppercase, lowercase, and number
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !!rateLimitMessage}
                className="w-full gentle-button text-pink-800 py-6 group"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4 animate-pulse" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                    setRateLimitMessage(null);
                  }}
                  className="ml-2 text-pink-600 hover:text-pink-700 font-semibold"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Auth;
