import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles.enums';

export const Roles = (...role: Role[]) => SetMetadata('roles', role);
