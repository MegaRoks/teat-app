import { ApiProperty } from '@nestjs/swagger';

export class PriceCarDto {
  @ApiProperty()
  public readonly start_booked: Date;

  @ApiProperty()
  public readonly end_booked: Date;
}
