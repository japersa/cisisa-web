import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CountryDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  readonly isActive: boolean;
}
