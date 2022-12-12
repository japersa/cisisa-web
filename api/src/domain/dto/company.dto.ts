import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly description: string;
  @ApiProperty()
  readonly lat: string;
  @ApiProperty()
  readonly lon: string;
  readonly isActive: boolean;
  @ApiProperty()
  @IsNotEmpty()
  readonly gcp_pwd: string;
}
