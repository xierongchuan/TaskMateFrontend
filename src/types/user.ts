export type Role = 'employee' | 'observer' | 'manager' | 'owner';

export interface User {
  id: number;
  login: string;
  full_name: string;
  role: Role;
  dealership_id: number | null;
  telegram_id: number | null;
  phone: string | null;
  phone_number: string | null;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface CreateUserRequest {
  login: string;
  password: string;
  full_name: string;
  phone: string;
  role: Role;
  telegram_id?: number;
  dealership_id?: number;
}

export interface UpdateUserRequest {
  password?: string;
  full_name?: string;
  phone_number?: string;
  phone?: string;
  role?: string;
  dealership_id?: number;
  telegram_id?: number;
}
