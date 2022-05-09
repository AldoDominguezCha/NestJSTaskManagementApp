import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './DTOs/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  public signUp(@Body() authCredentialsDto: AuthCredentialsDTO): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  public signIn(
    @Body() authCredentialsDto: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
