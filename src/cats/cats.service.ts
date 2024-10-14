import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from '../breeds/entities/breed.entity';
import { UserPayload } from '../common/types/userPayload.type';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat) private catsRepository: Repository<Cat>,
    @InjectRepository(Breed) private breedsRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto, user: UserPayload) {
    const breed = await this.breedsRepository.findOneBy({
      name: createCatDto.breed,
    });

    if (!breed) {
      throw new BadRequestException('Breed not found');
    }

    const cat = this.catsRepository.create({
      ...createCatDto,
      breed,
      userEmail: user.email,
    });
    return await this.catsRepository.save(cat);
  }

  async findAll() {
    return await this.catsRepository.find();
  }

  async findOne(id: number) {
    return await this.catsRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.catsRepository.findOne({ where: { id } });
    if (!cat) {
      throw new BadRequestException('Cat not found');
    }

    if (updateCatDto.breed) {
      const breed = await this.breedsRepository.findOneBy({
        name: updateCatDto.breed,
      });
      if (!breed) {
        throw new BadRequestException('Breed not found');
      }
      cat.breed = breed;
    }

    Object.assign(cat, updateCatDto);
    return await this.catsRepository.save(cat);
  }

  async remove(id: number) {
    const result = await this.catsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new BadRequestException('Gato no encontrado');
    }
    return { message: 'Gato eliminado con éxito' };
  }
}
