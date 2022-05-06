import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './DTOs/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private userRepo: UsersRepository,
  ) {}

  public async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepo.createUser(authCredentialsDTO);
  }

  public async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<string> {
    const { username, password } = authCredentialsDTO;
    const user = await this.userRepo.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'sucess';
    } else {
      throw new UnauthorizedException('Invalid username and/or password');
    }
  }
}
