import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NeighborhoodDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  readonly lat: string;
  @ApiProperty()
  readonly lan: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly idCity: number;
  readonly isActive: boolean;
}
