export interface User {
  id: string;
  firstName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  // backend returns `access_token`; keep `token` for backwards compatibility
  access_token?: string;
  token?: string;
  refreshToken?: string;
}
