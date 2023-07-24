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
import { MarriagePersonService } from './marriage-person.service';
import { Request, Response } from 'express';
import { CreateMarriageDto } from './dtos/create-marriage.dto';
import { Key_Success_Marriage } from '../../common/helpers/responses';
import { UpdateMarriageDto } from './dtos/update-marriage.dto';

@Controller('marriage-person')
export class MarriagePersonController {
  constructor(private readonly marriageService: MarriagePersonService) {}

  @Post()
  async createMarriagePerson(
    @Res() res: Response,
    @Body() createMarriageDto: CreateMarriageDto,
  ) {
    const newPerson = await this.marriageService.createMarriagePerson(
      createMarriageDto,
    );

    if (!newPerson) {
      // throw new BadRequestException(Key_Error_Person.CANNOT_CREATE_PERSON);
      return newPerson;
    }
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Marriage.CREATE_MARRIAGE,
      data: newPerson,
    });
  }
  @Get('/all/:personId')
  async getAllMarriagePersonByPersonId(
    @Param('personId') id: string,
    @Res() res: Response,
  ) {
    const list = await this.marriageService.getAllMarriagePersonByPersonId(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Marriage.GET_ALL_MARRIAGE,
      data: list,
    });
  }

  @Get(':id')
  async getOneMarriagePerson(@Param('id') id: string, @Res() res: Response) {
    const person = await this.marriageService.getOneMarriagePerson(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Marriage.GET_MARRIAGE,
      data: person,
    });
  }

  @Patch(':id')
  async updateMarriagePerson(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateMarriageDto: UpdateMarriageDto,
  ) {
    const person = await this.marriageService.updateMariagePerson(
      id,
      updateMarriageDto,
    );
    if (!person) {
      return person;
    }
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Marriage.UPDATE_MARRIAGE,
      data: person,
    });
  }

  @Delete(':id')
  async deleteMarriagePerson(@Param('id') id: string, @Res() res: Response) {
    const person = await this.marriageService.permanentlyDelete(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Marriage.DELETE_MARRIAGE_PERSON,
      data: person,
    });
  }
}
