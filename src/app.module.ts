import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [CarModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
