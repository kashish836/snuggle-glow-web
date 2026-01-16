import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Baby, Heart, Mail, Lock, User, Sparkles, Star, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              variant: 'destructive',
              title: 'Login Failed',
              description: 'Invalid email or password. Please try again.',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Login Failed',
              description: error.message,
            });
          }
        } else {
          toast({
            title: 'Welcome back, mama! 💕',
            description: 'Successfully signed in to your account.',
          });
        }
      } else {
        const { error } = await signUp(email, password, displayName);
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
                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl"
                  />
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
                  className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl ${
                    errors.email ? 'border-red-400' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
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
                  className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl ${
                    errors.password ? 'border-red-400' : ''
                  }`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
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
