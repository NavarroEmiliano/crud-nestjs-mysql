import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from '../breeds/entities/breed.entity';
import { UserPayload } from '../common/types/userPayload.type';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat) private catsRepository: Repository<Cat>,
    @InjectRepository(Breed) private breedsRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto, user: UserPayload) {
    const breed = await this.validateBreed(createCatDto.breed);

    const cat = this.catsRepository.create({
      ...createCatDto,
      breed,
      userEmail: user.email,
    });
    return await this.catsRepository.save(cat);
  }

  async findAll(user: UserPayload) {
    return await this.catsRepository.find({ where: { userEmail: user.email } });
  }

  async findOne(id: number, user: UserPayload) {
    const cat = await this.catsRepository.findOne({ where: { id: id } });

    if (!cat) {
      throw new BadRequestException('Cat not found');
    }

    this.validateOwnership(cat, user);

    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: UserPayload) {
    await this.findOne(id, user);
    return await this.catsRepository.update(id, {
      ...updateCatDto,
      breed: updateCatDto.breed
        ? await this.validateBreed(updateCatDto.breed)
        : undefined,
      userEmail: user.email,
    });
  }

  async remove(id: number, user: UserPayload) {
    await this.findOne(id, user);
    return await this.catsRepository.softDelete(id);
  }

  private validateOwnership(cat: Cat, user: UserPayload) {
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
  }

  private async validateBreed(breed: string) {
    const breedExists = await this.breedsRepository.findOneBy({
      name: breed,
    });

    if (!breedExists) {
      throw new BadRequestException('Breed not found');
    }
    return breedExists;
  }
}
