import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OtherPeopleService } from './other_people.service';
import { CreateOtherDto } from './dtos/create-other.dto';
import { Response } from 'express';
import {
  Key_Success_Marriage,
  Key_Success_Other,
} from '../../common/helpers/responses';
import { UpdateOtherDto } from './dtos/update-other.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';

@ApiTags('other-people(sons-daughters)')
@Controller('other-people')
export class OtherPeopleController {
  constructor(private readonly otherService: OtherPeopleService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Admin create a new other person',
    description: '- person is required',
  })
  @ApiBody({ type: CreateOtherDto })
  async createOtherPeople(
    @Res() res: Response,
    @Body() createOtherDto: CreateOtherDto,
  ) {
    const newPerson = await this.otherService.createOtherPeople(createOtherDto);

    return res.status(HttpStatus.OK).json({
      message: Key_Success_Other.CREATE_OTHER,
      data: newPerson,
    });
  }

  @Get('/all/:personId')
  @ApiOperation({
    summary: 'User enter personId to find all other-person belongs to person',
  })
  async getAllOtherPeopleByPersonId(
    @Param('personId') id: string,
    @Res() res: Response,
  ) {
    const list = await this.otherService.getAllOtherPeopleByPersonId(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Marriage.GET_ALL_MARRIAGE,
      data: list,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'User finds an other-person by id',
  })
  async getOneOtherPeople(@Param('id') id: string, @Res() res: Response) {
    const person = await this.otherService.getOneOtherPeople(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Marriage.GET_MARRIAGE,
      data: person,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Admin update an other-person',
  })
  @ApiBody({ type: CreateOtherDto })
  async updateOtherPeople(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateOtherDto: CreateOtherDto,
  ) {
    const person = await this.otherService.updateOtherPeople(
      id,
      updateOtherDto,
    );
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Other.UPDATE_OTHER,
      data: person,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  async deleteMarriagePerson(@Param('id') id: string, @Res() res: Response) {
    const person = await this.otherService.permanentlyDelete(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Marriage.DELETE_MARRIAGE_PERSON,
      data: person,
    });
  }
}
