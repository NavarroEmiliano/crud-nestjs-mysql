import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Role } from '../common/enums/rol.enum';
import { Auth } from '../common/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserPayload } from '../common/types/userPayload.type';

@Auth(Role.USER)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() createCatDto: CreateCatDto, @ActiveUser() user: UserPayload) {
    return this.catsService.create(createCatDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: UserPayload) {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @ActiveUser() user: UserPayload) {
    return this.catsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCatDto: UpdateCatDto,
    @ActiveUser() user: UserPayload,
  ) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: UserPayload) {
    return this.catsService.remove(+id);
  }
}
