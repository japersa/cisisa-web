import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ZoneDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  readonly properties: object;
  @ApiProperty()
  readonly geometry: object;
  @ApiProperty()
  readonly isActive: boolean;
  @ApiProperty()
  readonly idCompany: number;
  @ApiProperty()
  readonly idCity: number;
}
