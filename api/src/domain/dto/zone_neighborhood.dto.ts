import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ZoneNeighborhoodDto {
  @ApiProperty()
  @IsNotEmpty()
  idZone: number;
  @ApiProperty()
  multiselectRef: Array<any>;
  @ApiProperty()
  readonly isActive: boolean;
  idNeighborhood: number;
}
