import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreatePersonDto } from './dtos/create-person.dto';
import { PersonService } from './person.service';
import { Request, Response } from 'express';
import { Key_Success_Person } from '../../common/helpers/responses';
import { UpdatePersonDto } from './dtos/update-person.dto';
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}
  @Post()
  async createNewPerson(
    @Res() res: Response,
    @Body() createNewPersonDto: CreatePersonDto,
    @Req() req: Request,
  ) {
    const parent_id = req.body.parent_id;
    const newPerson = await this.personService.createNewPerson(
      createNewPersonDto,
      parent_id,
    );

    if (!newPerson) {
      // throw new BadRequestException(Key_Error_Person.CANNOT_CREATE_PERSON);
      return newPerson;
    }
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Person.CREATE_PERSON,
      data: newPerson,
    });
  }

  @Get()
  async getAllPerson(@Res() res: Response) {
    const allPerson = await this.personService.getAllPerson();
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Person.GET_ALL_PERSON,
      data: allPerson,
    });
  }

  @Get(':id')
  async getOnePerson(@Param('id') id: string, @Res() res: Response) {
    const person = await this.personService.getOnePerson(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Person.GET_PERSON,
      data: person,
    });
  }

  @Patch(':id')
  async updatePerson(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
    @Req() req: Request,
  ) {
    const email = req.body?.email;
    const person = await this.personService.updatePerson(
      id,
      updatePersonDto,
      email,
    );
    if (!person) {
      return person;
    }
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Person.UPDATE_PERSON,
      data: person,
    });
  }

  @Delete(':id')
  async deletePerson(@Param('id') id: string, @Res() res: Response) {
    const person = await this.personService.permanentlyDelete(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Person.DELETE_PERSON,
      data: person,
    });
  }
}
