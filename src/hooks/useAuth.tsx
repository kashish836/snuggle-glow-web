import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout, type User } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  session: { access_token: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const token = apiClient.getAccessToken();
      if (token) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          setSession({ access_token: token });
        } catch (error) {
          // Token invalid, clear it
          apiClient.clearTokens();
          setUser(null);
          setSession(null);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await apiLogin({ email, password });
      if (result.error) {
        return { error: new Error(result.error.detail || 'Login failed') };
      }
      
      // Get user info after successful login
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setSession({ access_token: result.tokens!.access_token });
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const result = await apiRegister({ email, password, display_name: displayName });
      if (result.error) {
        return { error: new Error(result.error.detail || 'Registration failed') };
      }
      
      // Auto-login after registration
      const loginResult = await apiLogin({ email, password });
      if (loginResult.tokens) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setSession({ access_token: loginResult.tokens.access_token });
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    apiLogout();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
