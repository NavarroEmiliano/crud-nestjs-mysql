import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const userFound = await this.usersService.findOneByEmail(registerDto.email);

    if (userFound) {
      throw new ConflictException('User already exists');
    }

    return await this.usersService.create({
      ...registerDto,
      password: await bcrypt.hash(registerDto.password, await bcrypt.genSalt()),
    });
  }

  login() {
    return;
  }
}
