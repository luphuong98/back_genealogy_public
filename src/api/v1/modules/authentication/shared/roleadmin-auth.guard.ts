import { Injectable } from '@nestjs/common';
import { RoleAdmin } from '../guard/role-admin.guard';

@Injectable()
export class VerifyRoleAdmin extends RoleAdmin {}
