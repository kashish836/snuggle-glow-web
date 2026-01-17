/**
 * Profile Editor Page
 * 
 * SECURITY:
 * - Input validation with Zod schemas
 * - Rate limiting on profile updates
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
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { profileUpdateSchema, type ProfileUpdateData } from '@/lib/validation';
import { rateLimiter, RATE_LIMIT_CONFIGS } from '@/lib/rate-limiter';
import {
  Baby,
  Heart,
  User,
  Camera,
  Save,
  ArrowLeft,
  Sparkles,
  Star,
  AlertCircle,
} from 'lucide-react';
import { z } from 'zod';

const ProfileEditor = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, bio, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          display_name: data.display_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        });
      }
      setLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  /**
   * Validates and saves profile
   * SECURITY: Uses Zod schema validation and rate limiting
   */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Rate limiting check
    const rateLimit = rateLimiter.check('profile', RATE_LIMIT_CONFIGS.profile, user?.id);
    if (!rateLimit.allowed) {
      toast({
        variant: 'destructive',
        title: 'Too Many Updates',
        description: rateLimit.message,
      });
      return;
    }

    // Validate input using Zod schema
    const validationResult = profileUpdateSchema.safeParse({
      display_name: profile.display_name || null,
      bio: profile.bio || null,
      avatar_url: profile.avatar_url || null,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(validationResult.data)
        .eq('user_id', user!.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Profile Updated! 💕',
        description: 'Your changes have been saved.',
      });

      navigate('/settings');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Unable to save your profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-lavender flex items-center justify-center">
        <div className="text-center">
          <Baby className="h-16 w-16 text-pink-400 animate-float mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

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
        <div className="max-w-xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="mb-6 text-gray-600 hover:text-pink-600 hover:bg-pink-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <User className="h-12 w-12 text-pink-400 animate-float" />
                <Heart className="h-4 w-4 text-pink-500 absolute -top-1 -right-1 animate-pulse-gentle" />
              </div>
            </div>
            <h1 className="text-3xl font-pacifico text-pink-600 mb-2">Edit Profile</h1>
            <p className="text-gray-600">Make your profile uniquely yours</p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSave} className="baby-card space-y-6">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <User className="h-12 w-12 text-pink-600" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Profile picture</p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display_name" className="text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-pink-400" />
                Display Name
              </Label>
              <Input
                id="display_name"
                type="text"
                placeholder="Your display name"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                maxLength={50}
                className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl ${
                  errors.display_name ? 'border-red-400' : ''
                }`}
              />
              {errors.display_name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.display_name}
                </p>
              )}
              <p className="text-xs text-gray-500">{profile.display_name.length}/50 characters</p>
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatar_url" className="text-gray-700 flex items-center gap-2">
                <Camera className="h-4 w-4 text-pink-400" />
                Avatar URL (optional)
              </Label>
              <Input
                id="avatar_url"
                type="url"
                placeholder="https://example.com/your-photo.jpg"
                value={profile.avatar_url}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                maxLength={2048}
                className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl ${
                  errors.avatar_url ? 'border-red-400' : ''
                }`}
              />
              {errors.avatar_url && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.avatar_url}
                </p>
              )}
              <p className="text-xs text-gray-500">Use a secure HTTPS URL for your profile picture</p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700 flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-400" />
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little about yourself..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                maxLength={500}
                rows={4}
                className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl resize-none ${
                  errors.bio ? 'border-red-400' : ''
                }`}
              />
              {errors.bio && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.bio}
                </p>
              )}
              <p className="text-xs text-gray-500">{profile.bio.length}/500 characters</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={saving}
              className="w-full gentle-button text-pink-800 py-6 group"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 animate-pulse" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Profile
                </span>
              )}
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfileEditor;
