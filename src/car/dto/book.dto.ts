import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
  @ApiProperty()
  public readonly car_id: number;

  @ApiProperty()
  public readonly start_booked: Date;

  @ApiProperty()
  public readonly end_booked: Date;
}
