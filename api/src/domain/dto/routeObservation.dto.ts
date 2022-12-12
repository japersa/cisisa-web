import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RouteObservationDto {
  @ApiProperty()
  idRouteObservation: number;
  @ApiProperty()
  @IsNotEmpty()
  readonly observation: string;
  readonly isActive: boolean;
}
