import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddressDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly guide: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly direction: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly reference1: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly reference2: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly clientGuide: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly declaredValue: string;
  @ApiProperty()
  readonly state: number;
  @ApiProperty()
  @IsNotEmpty()
  readonly idNeighborhood: number;
  readonly lat: string;
  readonly lon: string;
  @ApiProperty()
  readonly idCompany: number;
  readonly isActive: boolean;
  readonly idCity: number;
  readonly remitent: string;
  readonly collection: string;
  readonly product: string;
  idZone: number;
  createdAt: Date;
  updatedAt: Date;
}
