import { Role } from '../users/role.enum';

export interface JwtPayload {
  sub: string;
  role: Role;
}

export interface RefreshPayload {
  sub: string;
  jti: string;
}
