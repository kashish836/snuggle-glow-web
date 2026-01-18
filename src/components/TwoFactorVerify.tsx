/**
 * Two-Factor Authentication Verification Component
 * 
 * SECURITY:
 * - Used during login when MFA is enabled
 * - Challenge-response based verification
 * - Rate limiting handled by parent component
 */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';

interface TwoFactorVerifyProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TwoFactorVerify = ({ onSuccess, onCancel }: TwoFactorVerifyProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  /**
   * Verifies the TOTP code during login
   * SECURITY: Challenge is created fresh for each verification attempt
   */
  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get the list of factors
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      if (factorsError) {
        throw factorsError;
      }

      // Find the verified TOTP factor
      const totpFactor = factors.totp.find(f => f.status === 'verified');
      
      if (!totpFactor) {
        throw new Error('No verified TOTP factor found');
      }

      // Challenge the factor
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });

      if (challengeError) {
        throw challengeError;
      }

      // Verify with the code
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) {
        throw verifyError;
      }

      toast({
        title: 'Welcome back! 💕',
        description: 'Two-factor verification successful.',
      });
      
      onSuccess();
    } catch (err: any) {
      setError('Invalid code. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'The code you entered is incorrect.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-16 w-16 text-pink-400 mx-auto mb-4" />
        <h2 className="text-2xl font-pacifico text-pink-600 mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-gray-600">
          Enter the code from your authenticator app
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mfaCode" className="text-gray-700">
            Verification Code
          </Label>
          <Input
            id="mfaCode"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setCode(value);
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && code.length === 6) {
                handleVerify();
              }
            }}
            className="text-center text-2xl tracking-widest border-pink-200 focus:border-pink-400"
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-500 flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
        </div>

        <Button
          onClick={handleVerify}
          disabled={loading || code.length !== 6}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </span>
          ) : (
            'Verify'
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={onCancel}
          className="w-full text-gray-500 hover:text-gray-700"
        >
          Use a different sign in method
        </Button>
      </div>

      <p className="text-xs text-center text-gray-500">
        Having trouble? Contact support if you've lost access to your authenticator app.
      </p>
    </div>
  );
};

export default TwoFactorVerify;
