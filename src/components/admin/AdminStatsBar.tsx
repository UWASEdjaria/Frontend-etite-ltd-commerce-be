'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { InviteFormData, FeedbackStatus, AdminStatsBarProps } from '@/types/admin';
import { inviteSchema } from '@/lib/validations/authValidation';

export default function AdminStatsBar({ total, verified, admins, feedback, onUserCreated }: AdminStatsBarProps) {
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'USER' }
  });

  const onSubmit = async (data: InviteFormData) => {
    await onUserCreated(data);
    reset();
    setShowForm(false);
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">Total: {total}</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">Verified: {verified}</span>
          <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">Admins: {admins}</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 bg-orange-700 text-white text-xs font-bold rounded-lg hover:bg-orange-800 transition"
        >
          {showForm ? 'Cancel' : '+ New User'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border-b px-4 sm:px-6 py-3 shrink-0">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div>
              <AuthInput label="Full Name" type="text" placeholder="John Doe" {...register('name')} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div>
              <AuthInput label="Email" type="email" placeholder="user@email.com" {...register('email')} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="role" className="text-sm font-bold text-gray-700">Role</label>
              <select {...register('role')} id="role" aria-label="Role" title="Role"
                className="w-full text-gray-500 h-[42px] px-3 bg-gray-50 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
            </div>
            <AuthButton text="CREATE" isLoading={isSubmitting} />
          </form>
        </div>
      )}

      {feedback.message && (
        <div className={`px-4 sm:px-6 py-2 text-xs text-center border-b shrink-0 ${feedback.isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {feedback.message}
        </div>
      )}
    </>
  );
}
