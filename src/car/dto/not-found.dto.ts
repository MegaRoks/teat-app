import { ApiProperty } from '@nestjs/swagger';

export class NotFoundDto {
  @ApiProperty()
  public readonly statusCode: number;

  @ApiProperty()
  public readonly message: string;
}
