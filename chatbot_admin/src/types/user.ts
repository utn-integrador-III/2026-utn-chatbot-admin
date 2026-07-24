export type Department =
  | 'Calendar'
  | 'Turism'
  | 'Admissions'
  | 'Registration'
  | 'Scholarships'
  | 'General';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  department?: Department;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}