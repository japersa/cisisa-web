import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class HeadquartersDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly nameHeadquarters: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly description: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly idCity: number;
  readonly isActive: boolean;
  @ApiProperty()
  readonly idCompany: number;
}
