import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Loader2, ShieldAlert, LogIn } from 'lucide-react';
import { useVerifyAdminPassword } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';

interface AdminPasswordGateProps {
  onAuthenticated: (password: string) => void;
}

export default function AdminPasswordGate({ onAuthenticated }: AdminPasswordGateProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyPassword = useVerifyAdminPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError('You must be logged in as an admin to access this panel.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter the admin password.');
      return;
    }

    try {
      const isValid = await verifyPassword.mutateAsync(password);
      if (isValid) {
        onAuthenticated(password);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Admin Access</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter the admin password to view payment records.
          </p>

          {/* Login prompt if not authenticated */}
          {!isAuthenticated && (
            <div className="mb-5 p-3 rounded-xl border border-amber-200 bg-amber-50">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-amber-800">Admin login required</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    You must be logged in with an admin account to access this panel.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isLoggingIn ? (
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Logging in...</>
                ) : (
                  <><LogIn className="w-3 h-3 mr-1" /> Log In as Admin</>
                )}
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter admin password"
                  disabled={!isAuthenticated}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  disabled={!isAuthenticated}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={verifyPassword.isPending || !isAuthenticated || isLoggingIn}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifyPassword.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Unlock Admin Panel
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
