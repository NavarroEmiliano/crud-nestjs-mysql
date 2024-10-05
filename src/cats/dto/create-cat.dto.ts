import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCatDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(40)
  age: number;

  @IsString()
  @IsOptional()
  breed?: string;
}
