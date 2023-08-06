import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { RequestWithUser } from '../../common/types/requests.type';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Key_Error_User } from '../../common/helpers/responses';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Admin register a account',
    description: '## Admin sign up',
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      user_1: {
        value: {
          first_name: 'Le',
          last_name: 'Hau',
          email: 'hau@example.com',
          password: '123@123',
        } as RegisterDto,
      },
      user_2: {
        value: {
          first_name: 'Le',
          last_name: 'Linh',
          email: 'linh@example.com',
          password: '123@123',
        } as RegisterDto,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User created successfully!!',
    content: {
      'application/json': {
        examples: {
          created_user: {
            summary: 'Response after register',
            value: {
              access_token:
                'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ0MWNkNmJlMWQ0ZTBiNDRjNzA3NDk2IiwiaWF0IjoxNjgyMDM0MDI3LCJleHAiOjE2ODIwMzc2Mjd9.AH4z7uDWuEDjOs8sesB0ItxKUJ2M3rjul1D1mmjAKieOZblej5mp0JQE5IdgB9LlAOzOtKOLL5RWhxLCZ-YskvoRA7Yqza_rOjfIHeNseC3M66kKYqORN07aZDiA2OWhT3pXBqoKRCUBQCKLgMCAPT-CHryc0wUQGaKxP8YJO8dwIhGtjADchmzNJVBs4G7qYnpZAsORayd5GNfgoLpWmVFIBHSnPLNIL4dL8dLof0GBmVhdjhnHIUXYQlqL1wiwsmxmUC9TU2uiChm-TAhuiQyVwFokSySBJzBrLmEtgy89aaR0YizFK-QMg2xW3cJiiRzEBigTdsR0kvdUlk5GOg',
              refresh_token:
                'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ0MWNkNmJlMWQ0ZTBiNDRjNzA3NDk2IiwiaWF0IjoxNjgyMDM0MDI3LCJleHAiOjE2ODIwNTkyMjd9.aKNZymKdf3VEbPkda2cYYTS7KlpCbTqdXP30LREQ2b_fJ8q8cA0OyNEARK3Jm5yGsKoNd3txi54XmEbf19LC9CuDf9kwgLasPizEeMZsAJqSbSguzE4-9b4sSdf22GyipCcZJpkXkp01Bew04J8Y4FqhNARONsWzySXg8_VVWOGkfHGJVHFs7xYyVvmt3RErJwRM5s1Ou1ok7VW62FSTSAvXw6-qsHp5T7kXo73jECBqSuNEs5JcdluoBjdaAxggHYaDgTXoRh7y4Mn_fVKCQarAsUAxg6w0fxc8Gj0nP1ct3-GjG-Of-0O-iF7uynI2Lnq_On7WUsH7rFSysNyHUg',
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    content: {
      'application/json': {
        examples: {
          invalid_email_password: {
            value: {
              statusCode: 400,
              message: [
                Key_Error_User.EMAIL_MUST_BE_EMAIL,
                Key_Error_User.PASSWORD_ENOUGH,
              ],
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict user info',
    content: {
      'application/json': {
        examples: {
          email_duplication: {
            value: {
              statusCode: 409,
              message: Key_Error_User.EMAIL_ALREADY_EXISTS,
              error: 'Conflict',
            },
          },
          username_duplication: {
            value: {
              statusCode: 409,
              message: Key_Error_User.USERNAME_EXIST,
              error: 'Conflict',
            },
          },
        },
      },
    },
  })
  async Register(@Body() registerDto: RegisterDto) {
    return await this.authService.Register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Admin login account',
    description: '## Admin log in',
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      user_1: {
        value: {
          // first_name: 'Le',
          // last_name: 'Hau',
          email: 'hunglp202@gmail.com',
          password: 'hunglp202@Gmail.com',
        } as RegisterDto,
      },
      user_2: {
        value: {
          // first_name: 'Le',
          // last_name: 'Linh',
          email: 'linh@example.com',
          password: '1232@123',
        } as RegisterDto,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: Key_Error_User.WRONG_CREDENTIAL,
          error: 'Bad Request',
        },
      },
    },
  })
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this.authService.logIn(user._id.toString());
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Admin refresh token',
    description: '## Admin refresh token',
  })
  async refreshAccessToken(@Req() request: RequestWithUser) {
    const { user } = request;
    const access_token = this.authService.generateAccessToken({
      user_id: user._id.toString(),
    });
    return {
      access_token,
    };
  }
}
