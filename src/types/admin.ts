export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  status: 'REGISTERED' | 'ACTIVE';
}

export interface InviteFormData {
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AdminAxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface FeedbackStatus {
  message: string;
  isError: boolean;
}

export interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export interface AdminTopbarProps {
  onMenuClick: () => void;
}

export interface AdminStatsBarProps {
  total: number;
  verified: number;
  admins: number;
  feedback: FeedbackStatus;
  onUserCreated: (user: InviteFormData) => Promise<void>;
}
