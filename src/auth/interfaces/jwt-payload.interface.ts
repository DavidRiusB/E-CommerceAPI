import { Role } from 'src/common/enums';

export interface JwtPayload {
  sub: string;
  role?: Role;
}
