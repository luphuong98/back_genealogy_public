export interface AuthPayload {
  id: string;
  email: string;
  name: string;
  role?: string;
  is_active?: boolean;
}
