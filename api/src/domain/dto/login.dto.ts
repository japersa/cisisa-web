import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
