import { Module } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';
import { Breed } from './entities/breed.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Breed]),AuthModule],
  controllers: [BreedsController],
  providers: [BreedsService],
  exports: [TypeOrmModule]
})
export class BreedsModule {}
