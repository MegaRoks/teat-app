import { Pool } from 'pg';

export interface DatabaseProvider {
  provide: string;
  useValue: Pool;
}
