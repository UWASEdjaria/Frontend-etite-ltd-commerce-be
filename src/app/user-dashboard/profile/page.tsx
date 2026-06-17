'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { UserProfileResponse, AuthError, BackendWrappedResponse } from '@/types/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const unwrapAndSetProfile = (data: UserProfileResponse | BackendWrappedResponse) => {
    let finalUser: UserProfileResponse | null = null;
    
    if ('user' in data && data.user) {
      finalUser = data.user;
    } else if ('data' in data && data.data) {
      finalUser = data.data;
    } else if ('id' in data) {
      finalUser = data as UserProfileResponse;
    }

    if (finalUser) {
      setProfile(finalUser);
      setName(finalUser.name || '');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const responseData = await authService.getProfile() as UserProfileResponse | BackendWrappedResponse;
        if (isMounted) unwrapAndSetProfile(responseData);
      } catch (err) {
        if (isMounted) {
          const typedError = err as AuthError;
          setError(typedError.response?.data?.message || 'Could not fetch your profile.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUserProfile();
    return () => { isMounted = false; };
  }, [router]);

  const handleUpdateProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const currentEmail = profile?.email || '';
      const updatedData = await authService.updateProfile({ name, email: currentEmail }) as UserProfileResponse | BackendWrappedResponse;
      
      unwrapAndSetProfile(updatedData);
      setSuccessMessage('Profile name updated successfully!');
      setIsEditing(false);
    } catch (err) {
      const typedError = err as AuthError;
      setError(typedError.response?.data?.message || 'Failed to save profile modifications.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center h-auto min-h-[200px] py-12 px-4">
        <div className="text-gray-500 font-medium animate-pulse text-sm sm:text-base">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0 my-2 sm:my-6 relative h-auto overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-50 p-4 sm:p-8 h-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-5 gap-3">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-orange-50 rounded-full flex items-center justify-center text-xl sm:text-3xl shrink-0">👤</div>
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 leading-tight">Account Profile</h1>
              <p className="text-[11px] sm:text-sm text-gray-500">Manage and update your information</p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition text-center cursor-pointer"
            >
              Edit Profile
            </button>
          )}
        </div>

        {successMessage && (
          <div className="mb-4 bg-green-50 text-green-600 px-3 py-2.5 rounded-xl border border-green-100 text-xs sm:text-sm break-words">
            ✓ {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 px-3 py-2.5 rounded-xl border border-red-100 text-xs sm:text-sm break-words">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 sm:space-y-6 h-auto">
          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">User ID</label>
            <p className="text-xs sm:text-sm font-mono text-gray-500 mt-1 p-2.5 sm:p-3 bg-gray-50 rounded-xl border border-gray-100 break-all select-all whitespace-normal">
              {profile?.id || 'No ID configured'}
            </p>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                id="profile-name"
                name="name"
                autoComplete="name"
                placeholder="Enter your full name"
                minLength={2}
                maxLength={50}
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-800 bg-white disabled:bg-gray-100 disabled:text-gray-400 transition"
                required
              />
            ) : (
              <p className="text-sm sm:text-lg font-semibold text-gray-800 px-1 break-words">{profile?.name || 'No name configured'}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
            <p className="text-sm sm:text-lg font-semibold text-gray-800 px-1 break-all bg-gray-50/50 p-2 rounded-xl border border-gray-100 sm:border-none sm:bg-transparent sm:p-1">
              {profile?.email || 'No email associated'}
            </p>
          </div>

          {isEditing && (
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition disabled:opacity-50 text-center cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsEditing(false);
                  setName(profile?.name || '');
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition text-center cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}