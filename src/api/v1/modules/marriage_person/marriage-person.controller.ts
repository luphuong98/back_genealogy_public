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
  UseGuards,
} from '@nestjs/common';
import { MarriagePersonService } from './marriage-person.service';
import { Request, Response } from 'express';
import { CreateMarriageDto } from './dtos/create-marriage.dto';
import { Key_Success_Marriage } from '../../common/helpers/responses';
import { UpdateMarriageDto } from './dtos/update-marriage.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';

@ApiTags('marriage-person(wives-husbands)')
@Controller('marriage-person')
export class MarriagePersonController {
  constructor(private readonly marriageService: MarriagePersonService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Admin create a new marriage person',
    description: '- person is required',
  })
  @ApiBody({ type: CreateMarriageDto })
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
  @ApiOperation({
    summary:
      'User enter personId to find all marriage-person belongs to person',
  })
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
  @ApiOperation({
    summary: 'User finds a marriage-person by id',
  })
  async getOneMarriagePerson(@Param('id') id: string, @Res() res: Response) {
    const person = await this.marriageService.getOneMarriagePerson(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Marriage.GET_MARRIAGE,
      data: person,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Admin update a marriage-person',
  })
  @ApiBody({ type: CreateMarriageDto })
  async updateMarriagePerson(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateMarriageDto: CreateMarriageDto,
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
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  async deleteMarriagePerson(@Param('id') id: string, @Res() res: Response) {
    const person = await this.marriageService.permanentlyDelete(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Marriage.DELETE_MARRIAGE_PERSON,
      data: person,
    });
  }
}
