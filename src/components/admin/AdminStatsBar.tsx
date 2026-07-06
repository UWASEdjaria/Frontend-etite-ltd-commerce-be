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
    <div className="flex items-center justify-between mb-6">
       <div>
        <h2 className="text-xl font-bold text-slate-900">Admin User Status</h2>
        <p className="text-sm text-slate-500">
         Monitor user accounts and create new users.
         </p>
        </div>

         <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
         >
         {showForm ? 'Cancel' : '+ New User'}
        </button>
      </div>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-center">
        
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-bold text-slate-400 uppercase">Total Users</p>
           <p className="text-2xl font-bold text-slate-800">{total}</p>
        </div>
  
        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-600 uppercase">Verified</p>
          <p className="text-2xl font-bold text-emerald-700">{verified}</p>
        </div>
  
        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
          <p className="text-[10px] font-bold text-purple-600 uppercase">Admins</p>
          <p className="text-2xl font-bold text-purple-700">{admins}</p>
        </div>
        <div className="flex justify-center lg:justify-end">
        </div>
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
