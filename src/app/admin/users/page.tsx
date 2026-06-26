'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import AdminStatsBar from '@/components/admin/AdminStatsBar';
import { UserRow, InviteFormData, AdminAxiosError, FeedbackStatus } from '@/types/admin';
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import UserFilterBar from '@/components/admin/UserFilterBar';
import { UserFilters, defaultFilters, filterUsers } from '@/lib/userFilters';
import Pagination from '@/components/ui/pagnition';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [feedback, setFeedback] = useState<FeedbackStatus>({ message: '', isError: false });
  const [editUser, setEditUser] = useState<Partial<UserRow> | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
  const fetchUsers = async (page: number) => {
    try {
    const response = await authService.getAllUsers(page, 10);
    console.log("API Response:", response);
    setUsers(response.users);
    setTotalPages(response.totalPages);
    setCurrentPage(response.currentPage);
  } catch (err) {
    setFeedback({
      message: (err as AdminAxiosError).response?.data?.message || 'Failed to load users.',
      isError: true
    });
  }
};

useEffect(() => {
  fetchUsers(1);
}, []);

  const handleUserCreated = async (data: InviteFormData) => {
    setFeedback({ message: '', isError: false });
    try {
      const newUser = await authService.inviteUser(data);
      setUsers([...users, newUser]);
      setFeedback({ message: 'User created successfully!', isError: false });
    } catch (err) {
      setFeedback({ message: (err as AdminAxiosError).response?.data?.message || 'Invitation failed.', isError: true });
    }
  };

  const handleSaveDetails = async (id: string) => {
    if (!editUser?.name?.trim() || !editUser?.email?.trim()) return;
    try {
      const updated = await authService.updateUser(id, { name: editUser.name, email: editUser.email, role: editUser.role });
      setUsers(users.map((u) => u.id === id ? { ...u, ...updated } : u));
      setEditUser(null);
    } catch (e) { console.error(e); }
  };

  const handleToggleVerification = async (user: UserRow) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const updated = await authService.updateUser(user.id, 
        { isVerified: !user.isVerified ,
          status: !user.isVerified ? "ACTIVE" : "REGISTERED"
        }as Partial<UserRow>);
        
      setUsers(users.map((u) => u.id === user.id ? { ...u,...updated} : u));
    } catch (e) { 
      console.error(e);
    } finally {
      setIsLoading(false); 
    } 
  };
  

  const handleDelete = async (id: string) => {
    try {
      await authService.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (e) { console.error(e); }
    finally {
      setDeletingId(null);
    }
  };

  const verified = users.filter((u) => u.isVerified).length;
  const admins = users.filter((u) => u.role === 'ADMIN').length;
  const filteredUsers = filterUsers(users, filters);

  return (
    <div className="flex flex-col gap-6">
       <AdminStatsBar
          total={users.length}
          verified={verified}
          admins={admins}
          feedback={feedback}
          onUserCreated={handleUserCreated}
       />

       <UserFilterBar filters={filters} onChange={setFilters} />

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-slate-50 text-slate-400 font-semibold text-xs border-b sticky top-0 z-10">
              <tr>
                <th className="px-4 sm:px-6 py-3">User</th>
                <th className="px-4 sm:px-6 py-3">Role</th>
                <th className="px-4 sm:px-6 py-3">Status</th>
                <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
            {users.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-16 text-center text-slate-400">No users found.</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-16 text-center text-slate-400">No users match your filters.</td></tr>
            ) : (
              <>
                {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 sm:px-6 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        {editUser?.id === user.id ? (
                          <input type="text" value={editUser.name || ''} aria-label="Edit name" title="Edit name"
                            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-0.5 text-sm w-32 focus:outline-none focus:border-orange-400" />
                        ) : (
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{user.name}</p>
                        )}
                        {editUser?.id === user.id ? (
                          <input type="email" value={editUser.email || ''} aria-label="Edit email" title="Edit email"
                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-0.5 text-xs w-40 mt-0.5 focus:outline-none focus:border-orange-400" />
                        ) : (
                          <p className="text-xs text-gray-400 leading-tight">{user.email}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="text-gray-600 px-4 sm:px-6 py-2.5">
                    {editUser?.id === user.id ? (
                      <select value={editUser.role || 'USER'} aria-label="Edit role" title="Edit role"
                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value as 'USER' | 'ADMIN' })}
                        className="border border-gray-300 bg-white rounded px-2 py-1 text-gray-400 text-xs focus:outline-none">
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                        {user.role}
                      </span>
                    )}
                  </td>

                  <td className="px-4 sm:px-6 py-2.5">
                    {editUser?.id === user.id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleSaveDetails(user.id)} className="text-green-600 hover:text-green-700" title="Save"><FiCheck size={15} /></button>
                        <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-gray-600" title="Cancel"><FiX size={15} /></button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                         {user.status === 'ACTIVE' ? 'Verified' : 'Pending'}
                      </span>
                    )}
                  </td>

                  <td className="px-4 sm:px-6 py-2.5 text-right">
                    {editUser?.id !== user.id && (
                      <div className="flex items-center justify-end gap-3">
                        {deletingId === user.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Delete?</span>
                            <button onClick={() => handleDelete(user.id)} className="text-xs font-bold text-red-600 hover:underline">Yes</button>
                            <button onClick={() => setDeletingId(null)} className="text-xs font-bold text-slate-500 hover:underline">No</button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => setEditUser({ id: user.id, name: user.name, email: user.email, role: user.role })}
                              className="text-gray-400 hover:text-orange-600" title="Edit"><FiEdit2 size={15} /></button>
                            <button type="button" onClick={() => setDeletingId(user.id)}
                              className="text-red-500 hover:text-red-700" title="Delete"><FiTrash2 size={15} /></button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
                ))}
                <tr><td colSpan={4} className="h-4" /></tr>
              </>
            )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 pb-32 mb-10 flex justify-center pb-10">
           <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => fetchUsers(page)} 
              />
          </div>
      </div>
  );
}