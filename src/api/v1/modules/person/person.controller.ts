import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CreatePersonDto } from './dtos/create-person.dto';
import { PersonService } from './person.service';
import { Request, Response } from 'express';
import { Key_Success_Person } from '../../common/helpers/responses';
import { UpdatePersonDto } from './dtos/update-person.dto';
import { ConditionPerson } from './interfaces/search.interface';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('search')
  async searchPerson(
    @Res() res: Response,
    @Query('name') full_name = '',
    @Query('phone') phone = '',
    @Query('email') email = '',
    @Query('address') address = '',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const condition: ConditionPerson = {};

    if (full_name) {
      condition.full_name = full_name;
    }
    if (phone) {
      condition.phone_number = phone;
    }
    if (email) {
      condition.email = email;
    }
    if (address) {
      condition.address = address;
    }
    const person = await this.personService.getOnePersonDetail(
      condition,
      parseInt(page.toString(), 10),
      parseInt(limit.toString(), 10),
    );
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Person.GET_PERSON,
      person,
    });
  }
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
    const condition: ConditionPerson = { _id: id };
    const page = 1;
    const limit = 10;
    const person = await this.personService.getOnePersonDetail(
      condition,
      page,
      limit,
    );
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
