import { ApiProperty } from '@nestjs/swagger';

export class StatCarDto {
  @ApiProperty()
  public readonly cars: { [k: string]: number };

  @ApiProperty()
  public readonly total: number;
}
