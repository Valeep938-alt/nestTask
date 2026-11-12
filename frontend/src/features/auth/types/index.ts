export type Role = "profesor" | "estudiante";

export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: Role;
  is_active?: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: Usuario;
}

export interface MeResponse {
  id: string;
  email: string;
  role: Role;
}
