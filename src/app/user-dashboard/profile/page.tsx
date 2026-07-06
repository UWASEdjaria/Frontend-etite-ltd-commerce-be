'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { UserProfileResponse, AuthError, BackendWrappedResponse } from '@/types/auth';
import { FiUser, FiMail, FiHash, FiEdit3, FiCheck, FiX, FiShield, FiLock } from 'react-icons/fi';
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Top Banner Header matching Orders Page style */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8">
        <div className="max-w-2xl">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3 backdrop-blur-sm">
            Security & Identity
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Account Profile 🔒</h1>
          <p className="text-orange-50 text-sm sm:text-base mt-2 leading-relaxed">
            Manage your personal credentials, view account status, and secure your profile details seamlessly in one place.
          </p>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 overflow-hidden">
        
        {/* Profile Card Header & Edit Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md shadow-orange-500/20 shrink-0">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : <FiUser />}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{profile?.name || 'User Profile'}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{profile?.email || 'No email associated'}</p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-orange-200/60"
            >
              <FiEdit3 size={15} /> Edit Profile
            </button>
          )}
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="mb-6 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl border border-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2">
            <FiCheck className="shrink-0 text-emerald-600" size={16} /> {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-2xl border border-red-200 text-xs sm:text-sm font-medium flex items-center gap-2">
            <FiX className="shrink-0 text-red-600" size={16} /> Error: {error}
          </div>
        )}

        {/* Profile Details & Form */}
        <form onSubmit={handleUpdateProfileSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account ID Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <FiHash size={14} className="text-slate-400" /> Account ID
              </div>
              <p className="text-xs font-mono text-slate-600 break-all select-all font-semibold">
                {profile?.id || 'No ID configured'}
              </p>
            </div>

            {/* Email Address Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <FiMail size={14} className="text-slate-400" /> Email Address
              </div>
              <p className="text-sm font-semibold text-slate-700 break-all">
                {profile?.email || 'No email associated'}
              </p>
            </div>
          </div>

          {/* Full Name Section */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <FiUser size={14} className="text-slate-400" /> Full Name
            </div>
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
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 bg-white disabled:bg-slate-100 transition"
                required
              />
            ) : (
              <p className="text-base font-bold text-slate-800 px-1">
                {profile?.name || 'No name configured'}
              </p>
            )}
          </div>

          {/* Action Buttons inside Editing Mode */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FiCheck size={16} /> {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsEditing(false);
                  setName(profile?.name || '');
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FiX size={16} /> Cancel
              </button>
            </div>
          )}
        </form>

        {/* Security Footer Note */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-400">
          <FiShield size={16} className="text-orange-500 shrink-0" />
          <span>Your account is protected with enterprise-grade token encryption. Keep your credentials secure.</span>
        </div>

      </div>
    </div>
  );
}