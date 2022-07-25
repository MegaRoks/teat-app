import { Global, Module } from '@nestjs/common';

import { databaseProvider } from './database.config';

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
