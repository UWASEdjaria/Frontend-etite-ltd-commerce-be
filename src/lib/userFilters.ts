import { UserRow } from '@/types/admin';

export interface UserFilters {
  search: string;
  role: 'ALL' | 'USER' | 'ADMIN';
  status: 'ALL' | 'VERIFIED' | 'PENDING';
}

export const defaultFilters: UserFilters = {
  search: '',
  role: 'ALL',
  status: 'ALL',
};

export function filterUsers(users: UserRow[], filters: UserFilters): UserRow[] {
  return users.filter((user) => {
    const matchesSearch =
      filters.search === '' ||
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesRole =
      filters.role === 'ALL' || user.role === filters.role;

    const matchesStatus =
      filters.status === 'ALL' ||
      (filters.status === 'VERIFIED' && user.isVerified) ||
      (filters.status === 'PENDING' && !user.isVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });
}
