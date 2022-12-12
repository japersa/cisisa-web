import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly firstName: string;
  @ApiProperty()
  readonly secondName: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly lastName: string;
  @ApiProperty()
  readonly secondLastName: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly documentNumber: string;
  @ApiProperty()
  @IsEmail()
  readonly email: string;
  @ApiProperty()
  readonly phone: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly idRole: number;
  @ApiProperty()
  readonly userName: string;
  @ApiProperty()
  readonly isActive: boolean;
  @ApiProperty()
  readonly idHeadquarters: number;
}
