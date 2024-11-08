export interface UserDTO {
  id: string;
  email: string;
  name: string | null;
  tenantId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ErrorDTO {
  error: string;
  statusCode: string;
  messages: string[];
}
