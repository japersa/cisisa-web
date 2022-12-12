import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NoveltyDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly description: string;
  isActive: boolean;
}
