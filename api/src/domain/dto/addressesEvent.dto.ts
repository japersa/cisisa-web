import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddressesEventDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly idAddress: number;
  @ApiProperty()
  @IsNotEmpty()
  readonly event: string;
  @ApiProperty()
  @IsNotEmpty()
  data: object;
  createdAt: Date;
  idCreationUser: number;
}
