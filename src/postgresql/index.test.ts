import { expect, describe, test, beforeAll } from 'vitest';
import { postgresql } from '../index';

describe('postgresql', () => {
  let connector: ReturnType<typeof postgresql>;

  beforeAll(() => {
    connector = postgresql({
      host: process.env.VITE_ENV_POSTGRESQL_HOST || '',
      port: 5432,
      user: process.env.VITE_ENV_POSTGRESQL_USER || '',
      password: process.env.VITE_ENV_POSTGRESQL_PASSWORD || '',
      database: process.env.VITE_ENV_POSTGRESQL_DATABASE || '',
      timeout: 60e3,
    });
  });

  test('should read data from a postgres database', async () => {
    const rows = await connector.query<unknown[]>('SELECT * from samples', []);
    expect(rows).toBeDefined();
  });

  test('should write data to a postgres database', async () => {
    const key = `test from lib@${Date.now()}`;
    await connector.query('INSERT INTO samples (key, value) VALUES ($1, $2)', [
      key,
      new Date().toISOString(),
    ]);
    const rows = await connector.query<{ key: string }>(
      `
      SELECT * from samples
      WHERE key = $1
      `,
      [key],
    );
    expect(rows[0].key).toBe(key);
  });
});
