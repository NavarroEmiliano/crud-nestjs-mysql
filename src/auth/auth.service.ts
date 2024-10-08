import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const userFound = await this.usersService.findOneByEmail(registerDto.email);

    if (userFound) {
      throw new ConflictException('user already exists');
    }

    return await this.usersService.create({
      ...registerDto,
      password: await bcrypt.hash(registerDto.password, await bcrypt.genSalt()),
    });
  }

  async login(loginDto: LoginDto) {
    const userFound = await this.usersService.findOneByEmail(loginDto.email);

    if(!userFound){
      throw new UnauthorizedException('email or password is wrong')
    }
    const isPasswordValid = await bcrypt.compare(userFound.password,loginDto.password)

    if(!isPasswordValid) {
      throw new UnauthorizedException('password is wrong')
    }

    const payload = await {}
    return;
  }
}
