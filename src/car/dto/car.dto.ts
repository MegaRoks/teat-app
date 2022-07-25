import { ApiProperty } from '@nestjs/swagger';

export class CarDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly gos_number: string;

  @ApiProperty()
  public readonly start_booked: Date;

  @ApiProperty()
  public readonly end_booked: Date;
}
