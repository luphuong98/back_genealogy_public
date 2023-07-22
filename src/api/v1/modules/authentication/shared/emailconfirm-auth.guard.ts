import { Injectable } from '@nestjs/common';
import { EmailConfirmationGuard } from '../guard/confirmed.guard';

@Injectable()
export class EmailConfirmed extends EmailConfirmationGuard {}
