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
  UseGuards,
} from '@nestjs/common';
import { CreatePersonDto } from './dtos/create-person.dto';
import { PersonService } from './person.service';
import { Request, Response } from 'express';
import { Key_Success_Person } from '../../common/helpers/responses';
import { ConditionPerson } from './interfaces/search.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/metadata/auth.decorator';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '../../common/decorators/metadata/roles.decorator';
import { USER_ROLE } from '../../common/shared/enum/user-role.enum';

@ApiTags('persons')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('search')
  @ApiOperation({
    summary: 'User can search with name, email, phone, address',
  })
  @ApiQuery({
    name: 'name',
    description: 'Name of the person',
    required: false,
  })
  @ApiQuery({
    name: 'phone',
    description: 'Phone number of the person',
    required: false,
  })
  @ApiQuery({
    name: 'email',
    description: 'Email address of the person',
    required: false,
  })
  @ApiQuery({
    name: 'address',
    description: 'Address of the person',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    examples: {
      '1': {
        value: 1,
        description: 'Start from page 1',
      },
      '10': {
        value: 10,
        description: `Skip 10 page`,
      },
    },
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    examples: {
      '10': {
        value: 10,
        description: `Get 10 person`,
      },
      '50': {
        value: 50,
        description: `Get 50 person`,
      },
    },
    required: false,
  })
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
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Admin create a new person',
    description:
      '- Add person_id to determine if person has a father or not\n' +
      '\n- person_id is not required\n' +
      '\n- can add person_id to body\n',
  })
  @ApiBody({ type: CreatePersonDto })
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
  @ApiOperation({
    summary: 'User get get all person',
  })
  async findAll(@Res() res: Response) {
    const allPerson = await this.personService.getAllPerson();
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Person.GET_ALL_PERSON,
      data: allPerson,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'User can get one person',
  })
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
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  @ApiBody({ type: CreatePersonDto })
  @ApiOperation({
    summary: 'Admin can update a person',
    description:
      '- Enter person_id to determine if person has a father or not\n' +
      '\n- person_id is not required',
  })
  async updatePerson(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updatePersonDto: CreatePersonDto,
    @Req() req: Request,
  ) {
    const email = req.body.email;
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
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Admin can delete a person',
  })
  async deletePerson(@Param('id') id: string, @Res() res: Response) {
    const person = await this.personService.permanentlyDelete(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Person.DELETE_PERSON,
      data: person,
    });
  }
}
