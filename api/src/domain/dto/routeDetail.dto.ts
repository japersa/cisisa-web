import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RouteDetailDto {
  @ApiProperty()
  idRouteDetail: number;
  @ApiProperty()
  @IsNotEmpty()
  readonly idRoute: number;
  @ApiProperty()
  readonly idRouteObservation: number;
  @ApiProperty()
  @IsNotEmpty()
  readonly novelty: string;
  @ApiProperty()
  readonly picture: string;
  @ApiProperty()
  readonly signature: string;
  @ApiProperty()
  readonly deliveryStatus: number;
}
