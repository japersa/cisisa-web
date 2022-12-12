import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RouteDto {
  @ApiProperty()
  idAddress: number;
  @ApiProperty()
  @IsNotEmpty()
  readonly idUser: number; //courier
  @ApiProperty()
  readonly assignedDate: Date;
  @ApiProperty()
  readonly state: number;
  @ApiProperty()
  addressesChecked: Array<any>;
}
