import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RouteNoveltyDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly idRoute: number;
  @ApiProperty()
  @IsNotEmpty()
  readonly idNovelty: number;
  @ApiProperty()
  description: string;
  createdAt: Date;
}
