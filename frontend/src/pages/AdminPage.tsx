import React, { useState } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import AdminPasswordGate from '../components/AdminPasswordGate';
import AdminPanel from '../components/AdminPanel';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminPage() {
  const [authenticatedPassword, setAuthenticatedPassword] = useState<string | null>(null);
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleAuthenticated = (password: string) => {
    setAuthenticatedPassword(password);
  };

  const handleSignOut = async () => {
    setAuthenticatedPassword(null);
    if (identity) {
      await clear();
      queryClient.clear();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-gray-900">Admin Dashboard</span>
            {authenticatedPassword && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                Authenticated
              </span>
            )}
          </div>
          {authenticatedPassword && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {authenticatedPassword ? (
          <AdminPanel password={authenticatedPassword} />
        ) : (
          <AdminPasswordGate onAuthenticated={handleAuthenticated} />
        )}
      </div>
    </div>
  );
}
