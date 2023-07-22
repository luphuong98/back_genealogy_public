import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CreatePersonDto } from './dtos/create-person.dto';
import { PersonService } from './person.service';
import { Response } from 'express';
import {
  Key_Error_Person,
  Key_Success_Person,
} from '../../common/helpers/responses';
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}
  @Post()
  async createNewPerson(
    @Res() res: Response,
    @Body() createNewPersonDto: CreatePersonDto,
  ) {
    try {
      const newPerson = await this.personService.createNewPerson(
        createNewPersonDto,
      );
      if (!newPerson) {
        throw new BadRequestException(Key_Error_Person.CANNOT_CREATE_PERSON);
      }
      return res.status(HttpStatus.OK).json({
        message: Key_Success_Person.CREATE_PERSON,
        newPerson: newPerson,
      });
    } catch (error) {
      return error;
    }
  }
}
