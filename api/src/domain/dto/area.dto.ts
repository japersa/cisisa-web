import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AreaDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly description: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly idCity: number;
  readonly isActive: boolean;
}
