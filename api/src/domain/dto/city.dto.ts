import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CityDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly code: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly idDepartment: number;
  readonly isActive: boolean;
}
