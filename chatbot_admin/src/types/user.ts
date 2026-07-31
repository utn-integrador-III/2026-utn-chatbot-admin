export type Department =
  | 'Calendar'
  | 'Turism'
  | 'Admissions'
  | 'Registration'
  | 'Scholarships'
  | 'General';

export type UserRole = 'admin' | 'super_admin';

export interface AdminUser {
  id: string;
  full_name: string;
  user_name: string;
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface CreateAdminPayload {
  full_name: string;
  user_name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  message: string;
  admin: AdminUser;
  token: string;
  expires_at: string;
}