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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { USER_ROLE } from '../../common/shared/enum/user-role.enum';
import { Roles } from '../../common/decorators/metadata/roles.decorator';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Response, Request } from 'express';
import {
  Key_Success_Person,
  Key_Success_User,
} from '../../common/helpers/responses';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Admin create new user',
    description: `
* Only admin can use this API

* Admin create user and give some specific information`,
  })
  async createNewUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const newUser = await this.userService.create(createUserDto);
    if (!newUser) {
      return newUser;
    }
    return res.status(HttpStatus.OK).json({
      message: Key_Success_User.CREATE_USER,
      data: newUser,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Admin can get all user',
  })
  async findAll(@Res() res: Response) {
    const allUser = await this.userService.findAll();
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Person.GET_ALL_PERSON,
      data: allUser,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one User',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findOne(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_Person.GET_PERSON,
      data: user,
    });
  }

  @Patch(':id')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({
    summary: 'Update a user',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const email = req.body.email;
    // const user = await this.userService.update(id, updateUserDto);
    const user = await this.userService.updateUser(id, updateUserDto, email);
    if (!user) {
      return user;
    }
    return res.status(HttpStatus.OK).json({
      message: Key_Success_User.UPDATE_USER,
      data: user,
    });
  }

  @Delete(':id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Admin can delete a user',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.permanentlyDelete(id);
    return res.status(HttpStatus.OK).json({
      message: Key_Success_User.CREATE_USER,
      data: user,
    });
  }
}
