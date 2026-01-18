/**
 * Two-Factor Authentication Setup Component
 * 
 * SECURITY:
 * - Uses TOTP (Time-based One-Time Password) for MFA
 * - QR code generated securely by Supabase
 * - Factor verification required before enabling
 */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import {
  Shield,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

const TwoFactorSetup = ({ onComplete, onCancel }: TwoFactorSetupProps) => {
  const [step, setStep] = useState<'intro' | 'qr' | 'verify'>('intro');
  const [loading, setLoading] = useState(false);
  const [qrCodeUri, setQrCodeUri] = useState('');
  const [factorId, setFactorId] = useState('');
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  /**
   * Enrolls a new TOTP factor for the user
   * SECURITY: Factor is not active until verified
   */
  const handleEnroll = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      });

      if (error) {
        throw error;
      }

      if (data) {
        setQrCodeUri(data.totp.uri);
        setFactorId(data.id);
        // Extract secret from URI for manual entry
        const secretMatch = data.totp.uri.match(/secret=([A-Z2-7]+)/);
        if (secretMatch) {
          setSecret(secretMatch[1]);
        }
        setStep('qr');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to set up 2FA');
      toast({
        variant: 'destructive',
        title: 'Setup Failed',
        description: err.message || 'Failed to set up two-factor authentication',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verifies the TOTP code and activates the factor
   * SECURITY: Challenge-response verification
   */
  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Challenge the factor
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) {
        throw challengeError;
      }

      // Verify with the code
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode,
      });

      if (verifyError) {
        throw verifyError;
      }

      toast({
        title: 'Two-Factor Authentication Enabled! 🔐',
        description: 'Your account is now more secure.',
      });
      
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'Please check the code and try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    toast({
      title: 'Secret Copied',
      description: 'You can paste this into your authenticator app',
    });
  };

  return (
    <div className="space-y-6">
      {step === 'intro' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
            <Shield className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Enhanced Security</h3>
              <p className="text-sm text-green-700">
                Add an extra layer of protection to your account
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">What you'll need:</h4>
            <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
              <Smartphone className="h-5 w-5 text-pink-500" />
              <p className="text-sm text-gray-600">
                An authenticator app (Google Authenticator, Authy, etc.)
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={loading}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting up...
                </span>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 'qr' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-2">Scan QR Code</h3>
            <p className="text-sm text-gray-600 mb-4">
              Open your authenticator app and scan this QR code
            </p>
            
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-pink-100">
                <QRCodeSVG value={qrCodeUri} size={180} />
              </div>
            </div>

            <div className="text-left space-y-2">
              <p className="text-xs text-gray-500">Can't scan? Enter this code manually:</p>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <code className="flex-1 text-xs font-mono break-all">
                  {showSecret ? secret : '••••••••••••••••'}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSecret(!showSecret)}
                  className="h-8 w-8 p-0"
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copySecret}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setStep('verify')}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            I've scanned the code
          </Button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-4">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-pink-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Enter Verification Code</h3>
            <p className="text-sm text-gray-600">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verifyCode" className="text-gray-700">
              Verification Code
            </Label>
            <Input
              id="verifyCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={verifyCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setVerifyCode(value);
                setError('');
              }}
              className="text-center text-2xl tracking-widest border-pink-200 focus:border-pink-400"
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep('qr')}
              className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              Back
            </Button>
            <Button
              onClick={handleVerify}
              disabled={loading || verifyCode.length !== 6}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify & Enable'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;
