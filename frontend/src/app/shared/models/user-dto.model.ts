export interface UserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt:Date;
  lastLogin:Date;
  enabled: boolean;
}
