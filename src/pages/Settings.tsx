import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getProfile, updateProfile } from '@/lib/api/profile';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TwoFactorSetup from '@/components/TwoFactorSetup';
import {
  Baby,
  Heart,
  Settings as SettingsIcon,
  User,
  Shield,
  Palette,
  Mail,
  LogOut,
  Sun,
  Moon,
  Bell,
  ChevronRight,
  Sparkles,
  Star,
  Edit3,
  Smartphone,
  ShieldCheck,
  ShieldOff,
  Loader2,
} from 'lucide-react';

const Settings = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<{
    display_name: string | null;
    theme_preference: string;
    notifications_enabled: boolean;
  }>({
    display_name: null,
    theme_preference: 'light',
    notifications_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(true);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [disablingMfa, setDisablingMfa] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const data = await getProfile();
        setProfile({
          display_name: data.display_name,
          theme_preference: data.theme_preference || 'light',
          notifications_enabled: data.notifications_enabled ?? true,
        });
        setIsDarkMode(data.theme_preference === 'dark');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
      setLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Check MFA status
  useEffect(() => {
    const checkMfaStatus = async () => {
      if (!user) {
        setMfaLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.mfa.listFactors();
        if (error) {
          console.error('Error checking MFA status:', error);
          setMfaLoading(false);
          return;
        }

        // Check if there's a verified TOTP factor
        const hasVerifiedFactor = data.totp.some(f => f.status === 'verified');
        setMfaEnabled(hasVerifiedFactor);
      } catch (err) {
        console.error('MFA check failed:', err);
      } finally {
        setMfaLoading(false);
      }
    };

    checkMfaStatus();
  }, [user]);

  const handleDisableMfa = async () => {
    setDisablingMfa(true);

    try {
      const { data, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;

      const verifiedFactor = data.totp.find(f => f.status === 'verified');
      if (!verifiedFactor) {
        throw new Error('No verified factor found');
      }

      const { error: unenrollError } = await supabase.auth.mfa.unenroll({
        factorId: verifiedFactor.id,
      });

      if (unenrollError) throw unenrollError;

      setMfaEnabled(false);
      toast({
        title: 'Two-Factor Authentication Disabled',
        description: 'Your account security has been updated.',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to Disable 2FA',
        description: err.message || 'Please try again later.',
      });
    } finally {
      setDisablingMfa(false);
    }
  };

  const handleMfaSetupComplete = () => {
    setShowMfaSetup(false);
    setMfaEnabled(true);
  };

  const handleThemeToggle = async () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);

    if (user) {
      try {
        await updateProfile({ theme_preference: newTheme });
        setProfile({ ...profile, theme_preference: newTheme });
        toast({
          title: 'Theme Updated',
          description: `Switched to ${newTheme} mode`,
        });
      } catch (error) {
        console.error('Failed to update theme:', error);
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: 'Failed to update theme preference.',
        });
        setIsDarkMode(!isDarkMode); // Revert on error
      }
    }
  };

  const handleNotificationsToggle = async () => {
    const newValue = !profile.notifications_enabled;
    const previousValue = profile.notifications_enabled;

    if (user) {
      try {
        await updateProfile({ notifications_enabled: newValue });
        setProfile({ ...profile, notifications_enabled: newValue });
        toast({
          title: newValue ? 'Notifications Enabled' : 'Notifications Disabled',
          description: newValue
            ? "You'll receive updates and tips!"
            : 'You can enable them anytime.',
        });
      } catch (error) {
        console.error('Failed to update notifications:', error);
        setProfile({ ...profile, notifications_enabled: previousValue }); // Revert on error
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: 'Failed to update notification preferences.',
        });
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'See you soon, mama! 💕',
      description: 'Successfully signed out.',
    });
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-lavender flex items-center justify-center">
        <div className="text-center">
          <Baby className="h-16 w-16 text-pink-400 animate-float mx-auto mb-4" />
          <p className="text-gray-600">Loading your settings...</p>
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <SettingsIcon className="h-12 w-12 text-pink-400 animate-float" />
                <Heart className="h-4 w-4 text-pink-500 absolute -top-1 -right-1 animate-pulse-gentle" />
              </div>
            </div>
            <h1 className="text-3xl font-pacifico text-pink-600 mb-2">Settings</h1>
            <p className="text-gray-600">Customize your SnuggleNest experience</p>
          </div>

          {/* Profile Section */}
          <div className="baby-card mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {profile.display_name || 'Sweet Mama'}
                  </h2>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>
              <Link to="/profile/edit">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-xl"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Theme Settings */}
            <div className="baby-card">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-800">Theme Settings</h3>
              </div>
              <Separator className="bg-pink-100 mb-4" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="h-5 w-5 text-purple-500" />
                  ) : (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <Label className="text-gray-700 font-medium">Dark Mode</Label>
                    <p className="text-sm text-gray-500">
                      Easier on tired mama eyes at night
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="baby-card">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              </div>
              <Separator className="bg-pink-100 mb-4" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-blue-400" />
                  <div>
                    <Label className="text-gray-700 font-medium">Email Updates</Label>
                    <p className="text-sm text-gray-500">
                      Receive baby tips and community updates
                    </p>
                  </div>
                </div>
                <Switch
                  checked={profile.notifications_enabled}
                  onCheckedChange={handleNotificationsToggle}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="baby-card">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-800">Privacy & Security</h3>
              </div>
              <Separator className="bg-pink-100 mb-4" />
              
              <div className="space-y-4">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                  <div className="flex items-center gap-3">
                    {mfaEnabled ? (
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                    ) : (
                      <Smartphone className="h-5 w-5 text-orange-500" />
                    )}
                    <div>
                      <p className="text-gray-700 font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        {mfaEnabled ? 'Your account is protected' : 'Add extra security to your account'}
                      </p>
                    </div>
                  </div>
                  {mfaLoading ? (
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : mfaEnabled ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisableMfa}
                      disabled={disablingMfa}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      {disablingMfa ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <ShieldOff className="h-4 w-4 mr-1" />
                          Disable
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMfaSetup(true)}
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      Enable
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Privacy Policy</p>
                      <p className="text-sm text-gray-500">How we protect your data</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Terms of Service</p>
                      <p className="text-sm text-gray-500">Our community guidelines</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Data Management</p>
                      <p className="text-sm text-gray-500">Download or delete your data</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Contact Us */}
            <Link to="/contact">
              <div className="baby-card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-pink-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Contact Us</p>
                      <p className="text-sm text-gray-500">Get help or send feedback</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>

            {/* Logout */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700 py-6 rounded-xl group"
            >
              <LogOut className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      {/* MFA Setup Dialog */}
      <Dialog open={showMfaSetup} onOpenChange={setShowMfaSetup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-pink-600">
              <Shield className="h-5 w-5" />
              Set Up Two-Factor Authentication
            </DialogTitle>
          </DialogHeader>
          <TwoFactorSetup
            onComplete={handleMfaSetupComplete}
            onCancel={() => setShowMfaSetup(false)}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Settings;
